import mongoose from 'mongoose'

const sliderSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    text: {
      en: {
        type: String,
        required: true,
      },
      ar: {
        type: String,
        required: true,
      },
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
  },
  { timestamps: true }
)

sliderSchema.post('save', (doc, next) => {
  doc.populate('article', 'title').then((_) => next())
})

export default mongoose.model('Slider', sliderSchema)
