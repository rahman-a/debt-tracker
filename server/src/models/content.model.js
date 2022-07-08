import mongoose from 'mongoose'

const contentSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    header: {
      en: String,
      ar: String,
    },
    body: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    name: {
      en: String,
      ar: String,
    },
    video: String,
    type: {
      type: String,
      enum: ['video', 'contact', 'news'],
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Content', contentSchema)
