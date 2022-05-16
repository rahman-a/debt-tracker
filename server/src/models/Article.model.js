import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      en: String,
      ar: String,
    },
    body: {
      en: String,
      ar: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Article', ArticleSchema)
