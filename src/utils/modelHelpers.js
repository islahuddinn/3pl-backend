const { default: mongoose } = require("mongoose")
const AppError = require("./appError")

const docPermissionMiddleware = key =>
  async function (next) {
    const doc = await this.model.findOne(this.getQuery())
    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }
    const userId = this.getOptions().req.user?._id
    console.log(userId)
    console.log(doc)
    if (doc[key] && doc[key].toString() !== userId.toString()) {
      // You do not have permission to update this document
      return next(new AppError("You do not have permission to update this document", 403))
    }

    next()
  }
const Is_Required = () => {
  return [true, `{PATH} is required`]
}
const Field_Length = (len, msg) => {
  return [len, `{PATH} is ${msg}`]
}

const mongooseCustomErrors = {
  DocumentNotFoundError: "Not found.",
  general: {
    default: "This field was invalid; please contact us if necessary.",
    required: "This field is required.",
    unique: "This field is not unique."
  },
  Number: {
    min: "This field is less than the minimum allowed value of ({MIN}).",
    max: "This field is more than the maximum allowed value ({MAX})."
  },
  Date: {
    min: "This field is before the minimum allowed value ({MIN}).",
    max: "This field is after the maximum allowed value ({MAX})."
  },
  String: {
    enum: "This field has an invalid selection.",
    match: "This field has an invalid value.",
    minlength: "This field is shorter than the minimum allowed length ({MINLENGTH}).",
    maxlength: "This field is longer than the maximum allowed length ({MAXLENGTH})."
  }
}

const removeFieldsFromBody = fields => {
  return (req, res, next) => {
    for (const key of fields) {
      if (req.body[key]) {
        delete req.body[key]
      }
    }

    next()
  }
}
4
function convertToIdString(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    // If id is a valid Mongoose ObjectId, convert it to a string
    return id.toString()
  } else {
    // If id is not a valid Mongoose ObjectId, return it as is
    return id
  }
}
module.exports = {
  docPermissionMiddleware,
  Is_Required,
  Field_Length,
  mongooseCustomErrors,
  convertToIdString,
  removeFieldsFromBody
}
