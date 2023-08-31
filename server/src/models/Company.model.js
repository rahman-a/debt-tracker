import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    traderLicense: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    establishmentContract: String,
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      default: 'sole',
      enum: ['llc', 'sole'],
    },
    accountType: {
      type: String,
      default: 'business',
      enum: ['business', 'business_plus'],
    },
    employees: [
      {
        employee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Company', companySchema)
