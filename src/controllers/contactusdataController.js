
const ContactUsData = require("../models/ContentManagement/ContactUsData");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

module.exports = {
  addContactUsData: factory.createOne(ContactUsData),
  putContactUsData: factory.updateOne(ContactUsData),
  deleteContactUsData: factory.deleteOne(ContactUsData),
  getContactUsData: factory.getOne(ContactUsData),
  getAllContactUsDatas: factory.getAll(ContactUsData),
};
