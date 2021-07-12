export default class ClaimModel {
  constructor(appNumber, datetime, firmName, fullname, phone, comments, ati) {
    this.appNumber = appNumber;
    this.datetime = datetime;
    this.firmName = firmName;
    this.fullname = fullname;
    this.phone = phone;
    this.comments = comments;
    this.ati = ati;
  };
};