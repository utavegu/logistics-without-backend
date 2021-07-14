const express = require("express");
const http = require("http");
const cors = require("cors");

const { Claims } = require("./claims");

const app = express();
const port = 4000;
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const getSuccessfulResponse = (res, data) => {
  return res.status(200).json({ error: null, data });
};
const getErrorResponse = (res, error, status) => {
  return res.status(status).json({ error, data: null });
};
const sendResponse = (res, data, error = "Claim not found", status = 404) => {
  if (!data) return getErrorResponse(res, error, status);
  return getSuccessfulResponse(res, data);
};

new Claims();

app.get("/", (req, res) => {
  return getSuccessfulResponse(res, "I'm alive!");
});

app.get("/api/claims", async (req, res) => {
  console.log("GET /api/claims");
  const claims = await Claims.getClaims();
  console.log("claims: ", claims);
  return getSuccessfulResponse(res, claims);
});
app.get("/api/claim/:id", async (req, res) => {
  console.log(`GET /api/claim/${req.params.id}`);
  const claim = await Claims.getClaim(req.params.id);
  return sendResponse(res, claim);
});

app.post("/api/claim", async (req, res) => {
  console.log("POST /api/claim");
  const body = req.body;
  const newClaim = await Claims.addClaim(body);
  console.log("new claims: ", newClaim);
  return sendResponse(res, newClaim, "Body is malformed", 400);
});

app.delete("/api/claim/:id", async (req, res) => {
  console.log(`DELETE /api/claim/${req.params.id}`);
  const claimId = await Claims.deleteClaim(+req.params.id);
  return sendResponse(res, claimId);
});

app.patch("/api/claim", async (req, res) => {
  console.log(`PATCH /api/claim/${req.params.id}`);
  const claim = await Claims.updateClaim(req.body);
  return sendResponse(res, claim);
});

app.get("/api/save", async (req, res) => {
  console.log("GET /api/save");
  try {
    await Claims.saveToDisk();
    return getSuccessfulResponse(res, "sucessfuly saved");
  } catch (e) {
    return getErrorResponse(res, "Saving failed", 500);
  }
});

app.get("/api/load", async (req, res) => {
  console.log("GET /api/load");
  try {
    await Claims.loadFromDisk();
    return getSuccessfulResponse(res, "sucessfuly loaded");
  } catch (e) {
    return getErrorResponse(res, "Loading failed", 500);
  }
});

app.all(/\/.*?/, (req, res) => {
  return getErrorResponse(res, "Route is forbidden", 403);
});

server.listen(port, () => console.log(`server started on ${port}`));
