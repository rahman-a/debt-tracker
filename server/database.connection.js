// @ts-nocheck
import mongoose from 'mongoose'
import chalk from 'chalk'

export const Database = async (_) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(chalk.greenBright('Mongodb connected', conn.connection.host))
    // console.log('Mongodb connected', conn.connection.host)
  } catch (error) {
    console.log(chalk.redBright('failed to connect to database', error.message))
    // console.log('failed to connect to database', error.message)
  }
}
