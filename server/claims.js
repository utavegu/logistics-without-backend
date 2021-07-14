const fs = require("fs/promises");
const { Claim } = require("./model");

class Claims {
  static _claims = [];

  constructor() {
    console.log("Claims are created: ", Claims._claims);
    Claims.loadFromDisk();
  }

  /**
   * return claim by its id
   * @param {string} id claim appNumber
   * @returns Claim | undefined
   */
  static getClaim = async (id) => {
    return Claims._claims.find((claim) => claim.appNumber === id);
  };
  /**
   * return claim's index
   * @param {string} id claim appNumber
   * @returns number | -1
   */
  static getClaimIndex = async (id) => {
    return Claims._claims.findIndex((claim) => claim.appNumber === id);
  };

  /**
   * return all _claims
   * @returns Claim[]
   */
  static getClaims = async () => Claims._claims;

  /**
   * add given claim to array. Return null if claimname exists
   * @param {Claim} claim instance of Claim
   * @returns Claim[] | null
   */
  static addClaim = async (claim) => {
    if (claim.datetime && claim.firmName && claim.fullname && claim.phone) {
      const newClaim = new Claim(claim);
      Claims._claims = [...Claims._claims, newClaim];
      return newClaim;
    }
    return null;
  };

  /**
   * update given claim with new info
   * @param {Claim} claim instance of Claim
   * @returns Claim | null
   */
  static updateClaim = async (claim) => {
    if (!claim || !claim.appNumber) return null;
    const fields = ["firmName", "fullname", "phone", "comments", "ati"];
    const index = await Claims.getClaimIndex(claim.appNumber);
    if (index === -1) return null;
    const newClaim = { ...Claims._claims[index] };
    fields.forEach((field) => {
      if (claim[field] !== undefined) newClaim[field] = claim[field];
    });
    Claims._claims[index] = newClaim;
    return Claims._claims[index];
  };

  /**
   * delete claim from array
   * @param {string} id claim id
   * @returns string | null
   */
  static deleteClaim = async (id) => {
    console.log("deleteClaims", id, Claims._claims);
    const index = await Claims.getClaimIndex(id);
    console.log(index);
    if (index === -1) return null;
    const oldClaim = Claims._claims[index];
    Claims._claims = [
      ...Claims._claims.slice(0, index),
      ...Claims._claims.slice(index + 1),
    ];
    console.log(Claims._claims);
    return oldClaim;
  };

  /**
   * saves _claims to disk (just in case we don't want to loose them)
   */
  static saveToDisk = async () => {
    const file = await fs.open("./data.json", "w+");
    await fs.writeFile(file, JSON.stringify(Claims._claims), "utf8");
    file.close();
  };

  /**
   * reads _claims from disk. Runs on server startup
   */
  static loadFromDisk = async () => {
    const file = await fs.open("./data.json", "r");
    const content = JSON.parse(await file.readFile("utf8"));
    if (!content || !content.length) return file.close();
    Claims._claims = content;
    const lastId = content[content.length - 1].appNumber;
    Claim.setId(lastId);
    console.log("lastId: ", lastId);
    file.close();
  };
}

module.exports = { Claims };
