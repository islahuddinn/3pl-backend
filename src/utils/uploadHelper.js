const multer = require("multer")
const AWS = require("aws-sdk")
require("aws-sdk/lib/maintenance_mode_message").suppress = true
const fs = require("fs")
const catchAsync = require("./catchAsync")
const cloudinary = require("cloudinary").v2
cloudinary.config({
  cloud_name: "dinmm7dvx",
  api_key: "657561951328716",
  api_secret: "9hD-z00aOfulMXw7Y1Q5lpwnSF8"
})
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1
})
const uploadMulter = multer({
  storage: multer.diskStorage({}),
  limits: { fieldSize: 25 * 1024 * 1024 }
})

const bufferUploadToCloud = async file => {
  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer
  }
  const result = await s3.upload(params).promise()
  return result.Location
}
const uploadToCloud = async file => {
  const fileStream = fs.createReadStream(file.path)
  let folderName = process.env.PROJECT || "uploads"

  const fileExists = await s3
    .headObject({
      Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
      Key: `${folderName}/${file.originalname}`
    })
    .promise()
    .then(() => true)
    .catch(() => false)

  const fileName = fileExists ? `${Date.now()}-${file.originalname}` : file.originalname

  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: `${folderName}/${fileName}`,
    Body: fileStream
  }

  const result = await s3.upload(params).promise()

  return result.Location
}

const uploadHandler = catchAsync(async (req, res, next) => {
  if (req.files) {
    for (let [fieldName, files] of Object.entries(req.files)) {
      if (files.length === 1) {
        const result = await uploadToCloud(files[0])
        req.body[fieldName] = result
      } else if (files.length > 1) {
        const results = []
        for (let file of files) {
          const result = await uploadToCloud(file)
          results.push(result)
        }
        req.body[fieldName] = results
      }
    }
  } else if (req.file) {
    const { fieldname } = req.file
    const result = await uploadToCloud(req.file)
    req.body[fieldname] = result
  }
  req.body
  next()
})
module.exports = {
  uploadMulter,
  uploadToCloud,
  uploadHandler,
  bufferUploadToCloud
}
