import mailgun from 'mailgun-js'
import {
  welcome,
  reset,
  code,
  document,
  debt,
  reminder,
  contact,
} from './template.js'
import dotenv from 'dotenv'
dotenv.config()

const mg = mailgun({
  apiKey: process.env.MG_APIKEY,
  domain: process.env.MG_DOMAIN,
})

const emailData = {
  activate: {
    subject: 'Welcome to SWTLE Portal',
    sender: '<support@swtle.com>',
    template: welcome,
  },
  reset: {
    subject: 'Reset Your Password',
    sender: '<noreplay@swtle.com>',
    template: reset,
  },
  code: {
    subject: 'One-time Login Passcode',
    sender: '<noreplay@swtle.com>',
    template: code,
  },
  debt: {
    subject: 'Due Date is Approaching',
    sender: '<support@swtle.com>',
    template: debt,
  },
  document: {
    subject: 'Upload a new Document',
    sender: '<support@swtle.com>',
    template: document,
  },
  reminder: {
    subject: 'Your document about to expire',
    sender: '<support@swtle.com>',
    template: reminder,
  },
  contact: {
    subject: 'A message from SWTLE Portal',
    sender: '<contact@swtle.com>',
    template: contact,
  },
}

const sendEmail = async (info, type, email) => {
  const data = {
    from: `SWTLE ${emailData[type].sender}`,
    to: email ? email : info.email,
    subject: emailData[type].subject,
    html: emailData[type].template(info),
  }

  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log(error)
    }
    console.log('BODY: ', body)
  })
}

export default sendEmail
