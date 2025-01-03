const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/appError")
const APIFeatures = require("./../utils/apiFeatures")
const APIFeaturesAggregate = require("../utils/apiFeaturesAggregate")

const deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id, { req })

    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }

    res.status(204).send({
      status: "success",
      data: null
    })
  })

const updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      req
    })
    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }

    res.status(200).send({
      status: "success",
      result: doc
    })
  })

const createOne = Model =>
  catchAsync(async (req, res, next) => {
    //console.log(req.body);
    const doc = new Model(req.body)
    await doc.save()
    //console.log(doc);
    res.status(201).send({
      status: "success",
      result: doc
    })
  })
const singularCreateAndUpdate = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    })

    res.status(200).send({
      status: "success",
      result: doc
    })
  })

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions)
    const doc = await query

    if (!doc) {
      return next(new AppError("No document found with that ID", 404))
    }

    res.status(200).send({
      status: "success",
      result: doc
    })
  })
const getOneByFilter = (Model, popOptions, queryObjParam) =>
  catchAsync(async (req, res, next) => {
    let filter = { ...queryObjParam, ...req.filterObject }
    let query = Model.findOne(filter)
    if (popOptions) query = query.populate(popOptions)
    const doc = await query

    if (!doc) {
      return next(new AppError("No document found", 404))
    }

    res.status(200).send({
      status: "success",
      result: doc
    })
  })

const getAll = (Model, popOptions, queryObjParam) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = { ...queryObjParam, ...req.filterObject }
    let { query } = new APIFeatures(Model.find(filter), req.query, Model)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    if (popOptions) query = query.populate(popOptions)

    // const doc = await features.query.explain();

    const countQuery = query.model.find().merge(query).skip(0).limit(0)
    const count = await countQuery.count()
    const doc = await query
    // SEND RESPONSE
    res.status(200).send({
      status: "success",
      count: count,
      results: doc
    })
  })
const getAllAgg = (Model, popOptions, queryObjParam) =>
  catchAsync(async (req, res, next) => {
    let filter = { ...{ $match: {} }, ...queryObjParam, ...req.filterObject }

    const { pipeline } = new APIFeaturesAggregate([filter], req.query, Model)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const countPipeline = [...pipeline]
    countPipeline.pop()
    countPipeline.pop()
    countPipeline.push({ $count: "count" })
    const doc = await Model.aggregate(pipeline)
    const countData = await Model.aggregate(countPipeline)
    const count = countData.length > 0 ? countData[0].count : 0
    res.status(200).send({
      status: "success",
      count,
      results: doc
    })
  })

module.exports = {
  createOne,
  deleteOne,
  updateOne,
  getOne,
  getOneByFilter,
  getAll,
  getAllAgg,
  singularCreateAndUpdate
}
