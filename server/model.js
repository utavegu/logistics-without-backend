class Claim {
  static id = 0;
  constructor({ datetime, firmName, fullname, phone, comments, ati }) {
    this.appNumber = ++Claim.id;
    this.datetime = datetime || "";
    this.firmName = firmName || "";
    this.fullname = fullname || "";
    this.phone = phone || "";
    this.comments = comments || "";
    this.ati = ati || "";
  }

  static setId(id) {
    Claim.id = id;
  }
}

module.exports = { Claim };
