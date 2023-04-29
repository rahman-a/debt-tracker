import React from 'react'
import { Form, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const SingleTransaction = ({ setSearchData, searchData, error }) => {
  const { t } = useTranslation()
  return (
    <>
      <Alert variant={error?.type === 'single_transaction' ? 'danger' : 'info'}>
        <p>
          {error?.type === 'single_transaction'
            ? error?.message
            : t('single-transaction-info')}
        </p>
      </Alert>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group controlId='formBasicReport'>
          <Form.Label>{t('transaction-code')}</Form.Label>
          <Form.Control
            size='lg'
            type='text'
            placeholder={t('enter-transaction-code')}
            style={{ width: '50%' }}
            value={searchData['transaction_code']}
            onChange={(e) =>
              setSearchData({
                ...searchData,
                transaction_code: e.target.value,
              })
            }
          />
        </Form.Group>
      </Form>
    </>
  )
}

export default SingleTransaction
