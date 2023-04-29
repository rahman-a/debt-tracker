import React from 'react'
import styles from './style.module.scss'
import { Form, Alert } from 'react-bootstrap'
import DatePicker from 'react-date-picker'
import { useTranslation } from 'react-i18next'
import PeerSearch from '../PeerSearch/PeerSearch'
const FilteredTransactions = ({
  setSearchData,
  searchData,
  setPeerInfo,
  error,
}) => {
  const { t } = useTranslation()
  const mutateSearchDataType = (e, prop, value) => {
    if (e.target.checked && !searchData[prop].includes(value)) {
      setSearchData({
        ...searchData,
        [prop]: [...searchData[prop], value],
      })
    } else {
      setSearchData({
        ...searchData,
        [prop]: searchData[prop].filter((a) => a !== value),
      })
    }
  }
  return (
    <>
      <Alert
        variant={error?.type === 'filtered_transactions' ? 'danger' : 'info'}
      >
        <p>
          {error?.type === 'filtered_transactions'
            ? error?.message
            : t('filter-transactions-info')}
        </p>
      </Alert>
      <Form onSubmit={(e) => e.preventDefault()}>
        {/* Choose the second party */}
        <Form.Group controlId='formBasicReports'>
          <Form.Label>{t('print-transactions-with')}: </Form.Label>
          <PeerSearch setPeerInfo={setPeerInfo} type='reports' />
        </Form.Group>
        {/* Select Transactions from mm/dd/yyyy to mm/dd/yyyy */}
        <Form.Group
          controlId='formBasicReportsPeriodFrom'
          className='d-flex flex-column my-3'
        >
          <Form.Label>
            {t('select-transactions')} {t('transactions-from')}{' '}
          </Form.Label>
          <DatePicker
            className={styles.printing__date}
            value={searchData.period.from || new Date()}
            onChange={(date) => {
              setSearchData({
                ...searchData,
                period: {
                  ...searchData.period,
                  from: new Date(date),
                },
              })
            }}
          />
        </Form.Group>
        <Form.Group
          controlId='formBasicReportsPeriodTo'
          className='d-flex flex-column mb-3'
        >
          <Form.Label>{t('transactions-to')}: </Form.Label>
          <DatePicker
            value={searchData.period.to || new Date()}
            className={styles.printing__date}
            onChange={(date) => {
              setSearchData({
                ...searchData,
                period: { ...searchData.period, to: new Date(date) },
              })
            }}
          />
        </Form.Group>
        {/* choose the first party type [credit, debt] */}
        <Form.Group
          controlId='formBasicReportsType'
          style={{ margin: '2rem 0' }}
        >
          <Form.Label>{t('transactions-as')}: </Form.Label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Form.Check
              type='switch'
              id='peer_type'
              label={t('credit')}
              checked={searchData.act_as.includes('credit')}
              onChange={(e) => mutateSearchDataType(e, 'act_as', 'credit')}
            />
            <Form.Check
              type='switch'
              label={t('debt')}
              id='peer_type'
              checked={searchData.act_as.includes('debit')}
              onChange={(e) => mutateSearchDataType(e, 'act_as', 'debit')}
            />
          </div>
        </Form.Group>
        {/* choose the transaction status [paid, unpaid] */}
        <Form.Group
          controlId='formBasicTransactionType'
          style={{ margin: '2rem 0' }}
        >
          <Form.Label>{t('transactions-status')}: </Form.Label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Form.Check
              type='switch'
              label={t('paid')}
              id='report_type'
              checked={searchData.transaction_type.includes('paid')}
              onChange={(e) =>
                mutateSearchDataType(e, 'transaction_type', 'paid')
              }
            />
            <Form.Check
              type='switch'
              id='report_type'
              label={t('unpaid')}
              checked={searchData.transaction_type.includes('unpaid')}
              onChange={(e) =>
                mutateSearchDataType(e, 'transaction_type', 'unpaid')
              }
            />
          </div>
        </Form.Group>
      </Form>
    </>
  )
}

export default FilteredTransactions
