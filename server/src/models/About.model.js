import mongoose from 'mongoose'

const AboutSchema = new mongoose.Schema(
  {
    header: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        title: {
          en: String,
          ar: String,
        },
        body: {
          en: {
            type: String,
          },
          ar: {
            type: String,
          },
        },
        image: String,
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('About', AboutSchema)
