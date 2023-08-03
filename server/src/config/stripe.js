import stripe from 'stripe'

export default stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
})
