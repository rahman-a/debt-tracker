import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Modal, Button, Alert } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import CheckoutForm from './CheckoutForm'
import Loader from '../Loader/Loader'
import actions from '../../actions'
import { FineSolidIcon, PoweredByStripe } from '../../icons'
import FinalizeFinePayment from './FinalizeFinePayment'

const PayFine = ({ isFine, setIsFine, fine }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = i18next.language
  const { loading, error, stripePublishableKey } = useSelector(
    (state) => state.getStripePublishableKey
  )
  const {
    loading: client_loading,
    error: client_error,
    stripeClientKey,
  } = useSelector((state) => state.getStripeClientKey)

  const {
    loading: finalize_loading,
    error: finalize_error,
    isSuccess,
    isTransactionActive,
  } = useSelector((st) => st.finalizeFinePayment)

  let ComponentElement = null

  if (isLoading || finalize_loading) {
    ComponentElement = (
      <div className={styles.fine__overflow}>
        <Loader
          size='4'
          center
          options={{ animation: 'border' }}
          custom={{ color: '#000' }}
        />
      </div>
    )
  } else if (isError || finalize_error) {
    ComponentElement = (
      <Alert variant='danger'>{isError || finalize_error}</Alert>
    )
  } else if (isSuccess) {
    ComponentElement = (
      <FinalizeFinePayment isTransactionActive={isTransactionActive} />
    )
  } else if (stripePublishableKey && stripeClientKey) {
    ComponentElement = (
      <Elements
        stripe={loadStripe(stripePublishableKey)}
        options={{ clientSecret: stripeClientKey, locale: lang }}
      >
        <CheckoutForm reportId={fine.report} />
      </Elements>
    )
  }

  useEffect(() => {
    if (isFine) {
      !stripePublishableKey &&
        dispatch(actions.reports.getStripePublishableKey())
      !stripeClientKey &&
        dispatch(actions.reports.getStripeClientKey({ reportId: fine.report }))
    }
  }, [isFine])

  useEffect(() => {
    if (loading || client_loading) {
      setIsError(null)
      setIsLoading(loading || client_loading)
    }
  }, [loading, client_loading])

  useEffect(() => {
    if (error || client_error) {
      setIsLoading(false)
      setIsError(error || client_error)
    }
  }, [error, client_error])

  useEffect(() => {
    if (stripeClientKey && stripeClientKey) {
      setIsLoading(false)
      setIsError(null)
    }
  }, [stripeClientKey, stripeClientKey])

  return (
    <Modal show={isFine} centered>
      <Modal.Header>
        <h3>
          <FineSolidIcon width='3rem' height='3rem' fill='red' />
          {t('pay_delayed_fine')}
        </h3>
      </Modal.Header>
      <Modal.Body style={{ minHeight: '5rem' }}>{ComponentElement}</Modal.Body>
      <Modal.Footer>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <a
            target='_blank'
            className={styles.fine__stripe}
            href='https://www.stripe.com'
          >
            <PoweredByStripe
              style={{
                transform:
                  lang === 'en' ? 'translateX(-3.5rem)' : 'translateX(3.5rem)',
              }}
            />
          </a>
          <Button size='lg' onClick={() => setIsFine(false)} variant='danger'>
            {t('cancel')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default PayFine
