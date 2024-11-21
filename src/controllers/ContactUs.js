const { Service } = require("aws-sdk")
const ContactUS = require("../models/ContactUs")
const catchAsync = require("../utils/catchAsync")
const nodemailer = require("nodemailer")

const contactus = catchAsync(async (req, res, next) => {
  const contact = await ContactUS.create(req.body)

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD
    }
  })

  
    const mailOptions = {
        from : process.env.EMAIL_HOST_USER,
        to: "usmanzafar783@gmail.com",
        subject:"New Contact Us Submission",
        text:`You have a new contact us submission:
           Name: ${contact.firstName}
           Email: ${contact.email}
           Message: ${contact.message}`
    }

  await transporter.sendMail(mailOptions)

  res.status(200).json({
    status: "success",
    data: {
      data: contact
    }
  })
})

module.exports = { contactus }
