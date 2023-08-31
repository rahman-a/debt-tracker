import twilio from 'twilio'
import template from './template.js'
import dotenv from 'dotenv'
dotenv.config()

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// TODO: add uae code to phone number +971
const sendSMS = (phone, code) => {
  client.messages
    .create({
      body: template.verification(code),
      from: '+19402863101',
      to: phone,
      // to: `+2${phone.substring(4)}`,
    })
    .then((message) =>
      console.log(`message sent to ${phone} with sid ${message.sid}`)
    )
    .catch((error) => {
      console.log(error.message)
      throw new Error(error)
    })
}

export default sendSMS
