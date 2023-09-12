import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    sessionToken: {
      type: String,
    },
    authToken: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Session', sessionSchema)
