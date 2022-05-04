import mailgun from 'mailgun-js'
import template from './template.js'
import dotenv from 'dotenv'
dotenv.config()

const mg = mailgun({
  apiKey: process.env.MG_APIKEY,
  domain: process.env.MG_DOMAIN,
})

const sendEmail = async (info, type, email) => {
  const data = {
    from: 'SWTLE <noreplay@swtle.com>',
    to: email ? email : info.email,

    subject:
      type === 'activate'
        ? 'Email Verification'
        : type === 'reset'
        ? 'Reset Account Password'
        : type === 'code'
        ? 'Login Code'
        : type === 'notice'
        ? 'Important Message from SWTLE Panel'
        : type === 'contact' && 'New Contact Message',

    html:
      type === 'activate'
        ? template.activate(info)
        : type === 'reset'
        ? template.reset(info)
        : type === 'code'
        ? template.code(info)
        : type === 'notice'
        ? template.notice(info)
        : type === 'contact' && template.receiveContact(info),
  }

  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log(error)
    }
    console.log('BODY: ', body)
  })
}

export default sendEmail
