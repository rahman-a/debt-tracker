import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { PaymentElement } from '@stripe/react-stripe-js'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import actions from '@/src/actions'

const CheckoutForm = ({ reportId }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = i18next.language

  const errorClassNames = classNames(styles.fine__msg, styles.fine__error)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/completion`,
      },
      redirect: 'if_required',
    })

    if (error?.type === 'card_error' || error?.type === 'validation_error') {
      setError(t(error.code))
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      dispatch(
        actions.reports.finalizeFinePayment({
          paymentId: paymentIntent.id,
          reportId: reportId,
          paidBy: 'stripe',
        })
      )
    } else {
      const errorMsg =
        lang === 'en'
          ? 'Something went wrong, please reload the page.'
          : 'حدث خطأ ما, من فضلك أعد تحميل الصفحة'
      setError(errorMsg)
    }

    setIsProcessing(false)
  }

  return (
    <form className={styles.fine__form} onSubmit={handleSubmit}>
      <PaymentElement id='payment-element' />
      <button
        disabled={isProcessing || !stripe || !elements}
        id='submit'
        className={styles.fine__pay}
      >
        <span id='button-text'>
          {isProcessing ? t('processing') : t('pay_now')}
        </span>
      </button>
      {/* Show any error or success messages */}
      {error && <div className={errorClassNames}>{error}</div>}
    </form>
  )
}

export default CheckoutForm
