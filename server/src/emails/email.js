import mailgun from 'mailgun-js'
import template from './template.js'
import dotenv from 'dotenv'
dotenv.config()

const mg = mailgun({
  apiKey:process.env.MG_APIKEY, 
  domain:process.env.MG_DOMAIN
})

const sendEmail = async (info, type) => {
 const data = {
    from: 'noreplay@debttracker.com',
    to: info.email,
    subject: type === 'activate' 
    ?'Email Verification'
    :type === 'reset' 
    ?'Reset Account Password'
    :type === 'code' && 'Login Code',
    html: type === 'activate' 
    ? template.activate(info) 
    : type === 'reset' 
    ? template.reset(info)
    : type === 'code' 
    && template.code(info)
  };
  mg.messages().send(data, function (error, body) {
    if(error){
      console.log(error);
      throw new Error(error)
    }
    console.log('BODY: ',body);
  });
}

export default sendEmail
