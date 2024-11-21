const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
const colors = require("colors")
const { faker } = require("@faker-js/faker")
const connectDB = require("./config/connectDb")
const { TypeCheck } = require("./utils/helpers")

// Connect to the database
connectDB()

// Get the "models" folder path
const modelsFolderPath = path.join(__dirname, "models")

// Read all the files in the "models" folder
const modelFiles = fs.readdirSync(modelsFolderPath)

// Import all the models dynamically
const models = []

modelFiles.forEach(file => {
  const model = require(path.join(modelsFolderPath, file))
  const modelName = file.split(".")[0]

  if (TypeCheck(model).isObject()) {
    // If model is an object, it contains multiple models
    // Iterate over the sub-models and push each one to the 'models' array
    for (const subModelName in model) {
      models.push({ name: subModelName, model: model[subModelName] })
    }
  } else {
    // If model is not an object, it's a single model
    // Push it to the 'models' array
    models.push({ name: modelName, model })
  }
})

console.log(models)

const saveDataToJSON = async (model, modelName) => {
  try {
    if (!model) return
    // Fetch all data from the model
    let data
    if (modelName === "User") {
      data = await model.find().select("+password")
    } else data = await model.find()

    // Convert the data to JSON format
    const jsonData = JSON.stringify(data, null, 2)

    // Write the JSON data to a file
    const filePath = path.join(__dirname, `data/${modelName.toLowerCase()}s.json`)

    // Check if the file already exists
    if (!fs.existsSync(filePath)) {
      // If the file does not exist, create it
      fs.writeFileSync(filePath, jsonData)
      console.log(`New file "${modelName.toLowerCase()}s.json" created...`.green.inverse)
    } else {
      // If the file already exists, update its content
      fs.writeFileSync(filePath, jsonData)
      console.log(`Data saved to "${modelName.toLowerCase()}s.json"...`.green.inverse)
    }
  } catch (err) {
    console.error(err)
  }
}

// Import into DB
const importData = async (model, modelName) => {
  try {
    const data = JSON.parse(
      fs.readFileSync(`${__dirname}/data/${modelName.toLowerCase()}s.json`, "utf-8")
    )

    await model.create(data)
    console.log(`Data Imported for model "${modelName}"...`.green.inverse)
  } catch (err) {
    console.error(err)
  }
}

// Delete data
const deleteData = async (model, modelName) => {
  try {
    await model.deleteMany()
    console.log(`Data Destroyed for model "${modelName}"...`.red.inverse)
  } catch (err) {
    console.error(err)
  }
}

const generateFakeDataForFieldType = fieldType => {
  if (fieldType === "String") {
    return faker.person.firstName() // Generate a random first name as an example
  } else if (fieldType === "Number") {
    return faker.number.int({ max: 99999 }) // Generate a random number
  } else if (fieldType === "Boolean") {
    return faker.datatype.boolean() // Generate a random boolean
  } else if (fieldType === "Date") {
    return faker.date.past() // Generate a random past date
  } else if (fieldType === "ObjectId") {
    return new mongoose.Types.ObjectId() // Generate a random ObjectId
  } else if (fieldType instanceof mongoose.Schema) {
    console.log("passed2....", fieldType)
    // If the field type is a schema, generate fake data for each field in the object recursively
    const fakeData = {}
    const schemaPaths = fieldType.obj

    for (const key in schemaPaths) {
      const fieldDefinition = fieldType.path(key)
      const fieldInstance = fieldDefinition.instance
      fakeData[key] = generateFakeDataForFieldType(fieldInstance)
    }

    return fakeData
  }

  // Handle other field types or return null if unknown
  return null
}

const populateFakeDataForModel = (model, modelName) => {
  const fakeDataArray = []
  const schemaPaths = model.schema.paths

  for (let i = 0; i < 10; i++) {
    const fakeData = {}
    for (const path in schemaPaths) {
      if (path !== "__v") {
        const fieldType = schemaPaths[path].instance
        const fieldSchema = schemaPaths[path].options?.type // Get the field schema for embedded fields
        console.log(fieldType, path)
        const fakeValue =
          fieldSchema instanceof mongoose.Schema
            ? generateFakeDataForFieldType(fieldSchema)
            : generateFakeDataForFieldType(fieldType)
        fakeData[path] = fakeValue
      }
    }
    fakeDataArray.push(fakeData)
  }

  const jsonData = JSON.stringify(fakeDataArray, null, 2)

  const filePath = path.join(__dirname, `data/${modelName.toLowerCase()}s.json`)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, jsonData)
    console.log(`New file "${modelName.toLowerCase()}s.json" created...`.green.inverse)
  } else {
    fs.writeFileSync(filePath, jsonData)
    console.log(`Data saved to "${modelName.toLowerCase()}s.json"...`.green.inverse)
  }
}

const checkIfDataDirectoryExists = () => {
  const dataFolderPath = path.join(__dirname, "data")

  // Ensure the data directory exists
  if (!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath)
    console.log("Data directory created...".green.inverse)
  }
}
const performTaskForEachModel = async operation => {
  // Loop through each model object and perform the specified operation
  for (const { name: modelName, model } of models) {
    switch (operation) {
      case "-i":
        await importData(model, modelName)
        break
      case "-d":
        await deleteData(model, modelName)
        break
      case "-s":
        checkIfDataDirectoryExists()
        await saveDataToJSON(model, modelName)
        break
      case "-p":
        await populateFakeDataForModel(model, modelName)
        break
      default:
        console.log(
          'Invalid operation. Use "-i" for import, "-d" for delete, or "-s" for save to JSON.'.red
            .inverse
        )
    }
  }
  console.log("done")
  process.exit(1)
}
const performTaskForSingleModel = async (operation, modelName) => {
  // Find the model by name
  const modelObject = models.find(model => model.name.toLowerCase() === modelName.toLowerCase())

  if (!modelObject) {
    console.log(`Model "${modelName}" not found.`.red.inverse)
    process.exit(1)
  }

  const { name, model } = modelObject

  switch (operation) {
    case "-i":
      await importData(model, name)
      break
    case "-d":
      await deleteData(model, name)
      break
    case "-s":
      checkIfDataDirectoryExists()
      await saveDataToJSON(model, name)
      break
    case "-p":
      await populateFakeDataForModel(model, name)
      break
    default:
      console.log(
        'Invalid operation. Use "-i" for import, "-d" for delete, or "-s" for save to JSON.'.red
          .inverse
      )
      process.exit(1)
  }

  console.log(`Operation completed for model "${name}".`)
  process.exit(1)
}

// Process the command-line arguments
const operation = process.argv[2]

if (process.argv.length < 4) {
  console.log('No model specified. Provide the model name or use "-a" for all models.'.red.inverse)
  process.exit(1)
}

const modelName = process.argv[3]

if (modelName === "-a") {
  // Perform the specified operation for all models
  performTaskForEachModel(operation)
} else {
  // Perform the specified operation for a single model
  performTaskForSingleModel(operation, modelName)
}

// node src/seeder.js -s modelName for specific model
// node src/seeder.js -s -a    for all models
