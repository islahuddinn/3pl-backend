const { Schema, model } = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const validator = require("validator")
const { TypeCheck } = require("../utils/helpers")
const roleEnum = {
  WH: "Warehouse User",
  AD: "Admin",
  SL: "Seller"
}

function toLower(email) {
  if (!email || !TypeCheck(email).isString()) return email
  return email.toLowerCase()
}
const userSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    paymentStatus: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    address: {
      type: String,
      required: true
    },
    personName: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    position: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      set: toLower
    },
    phoneNumber: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    discountCode: {
      type: String,
      default: null
    },
    profileImage: {
      type: String,
      default: null
    },
    discounted: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: Object.keys(roleEnum),
      required: true
    },
    fullfillmentDiscount: {
      type: Number,
      default: 0
    }
  },
  {
    toJSON: true,
    timestamps: true,
    versionKey: false
  }
)

userSchema.virtual("role_value").get(function () {
  return roleEnum[this.role]
})

// Ensure that virtuals are included when converting the document to JSON
userSchema.set("toJSON", { virtuals: true })
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next()

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)
  if (this.isNew) return next()
  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (this._update?.password) {
      const hashed = await bcrypt.hash(this._update.password, 12)
      this._update.password = hashed
      this._update.passwordChangedAt = Date.now() - 1000
    }
    next()
  } catch (err) {
    return next(err)
  }
})
userSchema.pre(/^find/, function (next) {
  if (!this.getOptions()?.skipDisabled) this.find({ active: { $ne: false } })
  next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

    return JWTTimestamp < changedTimestamp
  }

  // False means NOT changed
  return false
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

module.exports = model("User", userSchema)
