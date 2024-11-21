const { TypeCheck } = require("./helpers")

class APIFeaturesAggregate {
  constructor(pipeline, queryString, Model) {
    this.pipeline = pipeline
    this.queryString = queryString
    this.Model = Model
  }
  filter() {
    const fieldDataTypes = this.Model.schema.paths
    const queryObj = { ...this.queryString }
    const excludedFields = ["page", "sort", "limit", "fields"]

    excludedFields.forEach(el => delete queryObj[el])

    // Filter for string fields with case-insensitive matching
    Object.keys(queryObj).forEach(key => {
      if (!queryObj[key]) {
        delete queryObj[key]
      } else if (TypeCheck(queryObj[key]).isObject()) {
        queryObj[key] = JSON.parse(
          JSON.stringify(queryObj[key]).replace(/\b(gte|gt|lte|lt|eq|ne)\b/g, match => `$${match}`)
        )
      } else if (fieldDataTypes[key]?.instance === "String") {
        queryObj[key] = {
          $regex: new RegExp(queryObj[key].replace(/([.*+?=^!:${}()|[\]\/\\])/g, "\\$1"), "i")
        }
      }
    })

    console.log(queryObj)
    this.pipeline.unshift({ $match: queryObj })

    return this
  }

  sort() {
    if (this.queryString.sort) {
      const sortObj = {}
      const sortFields = this.queryString.sort.split(",")
      sortFields.forEach(field => {
        if (field.startsWith("-")) {
          sortObj[field.slice(1)] = -1
        } else {
          sortObj[field] = 1
        }
      })
      this.pipeline.push({ $sort: sortObj })
    } else {
      this.pipeline.push({ $sort: { createdAt: -1 } }) // Default sorting by createdAt
    }

    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.replace("password", "").split(",")
      let fieldProject = {}
      for (const el of fields) {
        fieldProject[el] = 1
      }
      const projectStage = { $project: fieldProject }
      this.pipeline.push(projectStage)
    }

    return this
  }

  paginate() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit

    this.pipeline.push({ $skip: skip }, { $limit: limit })

    return this
  }
}
module.exports = APIFeaturesAggregate
