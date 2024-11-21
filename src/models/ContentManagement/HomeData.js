const mongoose = require("mongoose")
const Schema = mongoose.Schema

const HomeDataSchema = new Schema(
  {
    bannerTitle: {
      type: String,
      required: [true, "Banner Title is required"]
    },
    bannerDescription: {
      type: String,
      required: [true, "Banner Description is required"]
    },
    bannerImage: {
      type: String,
      required: false
    },
    bannerVideo: {
      type: String,
      required: false
    },
    consumerTitle: {
      type: String,
      required: [true, "Consumer Title is required"]
    },
    consumerDescription: {
      type: String,
      required: [true, "Consumer Description is required"]
    },
    faqTitle: {
      type: String,
      required: [true, "FAQ Title is required"]
    },

    faqs: [
      {
        question: {
          type: String,
          required: [true, "Question is required"]
        },
        answer: {
          type: String,
          required: [true, "Answer is required"]
        }
      }
    ]
  },
  { timestamps: true }
)

// Export the model
const HomeData = mongoose.model("homeData", HomeDataSchema)
module.exports = HomeData
