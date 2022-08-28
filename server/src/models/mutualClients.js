import mongoose from 'mongoose'

const mutualClientsSchema = new mongoose.Schema(
  {
    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    operations: [
      {
        operation: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Operation',
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('MutualClients', mutualClientsSchema)
