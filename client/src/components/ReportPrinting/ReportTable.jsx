import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import styles from './style.module.scss'
import { Edit } from '../../icons'

const ReportTable = ({ reports, setReportData }) => {
  const limitCharactersNumber = 50
  const [user, setUser] = useState({})
  const [transactions, setTransactions] = useState([])
  const [note, setNote] = useState('')
  const [isNote, setIsNote] = useState(false)
  const [characters, setCharacters] = useState(limitCharactersNumber)
  const [transactionId, setTransactionId] = useState(null)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const countNoteCharacters = (value) => {
    if (value.length > limitCharactersNumber) {
      setNote(value.slice(0, limitCharactersNumber))
      return
    }
    setCharacters(limitCharactersNumber - value.length)
    setNote(value)
  }

  const initiateNoteHandler = (id, note) => {
    setTransactionId(id)
    setIsNote(true)
    note?.length && setCharacters(limitCharactersNumber - note.length)
    note && setNote(note)
  }

  const setNoteHandler = (e) => {
    e.preventDefault()
    const newTransactions = transactions.map((transaction) => {
      if (transaction._id === transactionId) {
        transaction.note = note
      }
      return transaction
    })
    setTransactions(newTransactions)
    setReportData({ ...reports, transactions: newTransactions })
    setIsNote(false)
    setTransactionId(null)
    setNote('')
  }
  useEffect(() => {
    if (reports) {
      setUser(reports.user)
      setTransactions(reports.transactions)
    }
  }, [reports])
  return (
    <div className={styles.report}>
      <header className={styles.report__header}>
        <div className={styles.report__header_overlay}></div>
        <div className={styles.report__header_path}></div>
        <img
          className={styles.report__header_logo}
          src='/images/swtle.png'
          alt='logo'
        />
      </header>
      {isNote && transactionId && (
        <div className={styles.report__overlay}>
          <Form onSubmit={setNoteHandler}>
            <Form.Group controlId='formBasicNote'>
              <Form.Label>Write note for this transaction</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={note}
                onChange={(e) => countNoteCharacters(e.target.value)}
              />
              <Form.Text style={{ color: '#fff' }}>
                {characters} characters allowed
              </Form.Text>
              <Button size='lg' type='submit'>
                Set Note
              </Button>
              <Button
                variant='secondary'
                size='lg'
                type='button'
                onClick={() => {
                  setIsNote(false)
                  setTransactionId(null)
                  setNote('')
                }}
              >
                Close
              </Button>
            </Form.Group>
          </Form>
        </div>
      )}
      <div className={styles.report__container}>
        <div className={styles.report__meta}>
          <h1 className={styles.report__meta_title}>
            كشف حساب
            <br />
            Account Statement
          </h1>
          <ul className={styles.report__meta_info}>
            <li className={styles['report__meta_info--item']}>
              <div className={styles['report__meta_info--block']}>
                <p>فترة كشف الحساب</p>
                <p>statement Period</p>
              </div>
              <p className={styles['report__meta_info--slot']}>
                {user.statement_period
                  ? `${user.statement_period.from} - ${user.statement_period.to}`
                  : 'N/A'}
              </p>
            </li>
            <li className={styles['report__meta_info--item']}>
              <div className={styles['report__meta_info--block']}>
                <p>رقم الحساب</p>
                <p>Account Number</p>
              </div>
              <p className={styles['report__meta_info--slot']}>
                {user.account_number}
              </p>
            </li>
            <li className={styles['report__meta_info--item']}>
              <div className={styles['report__meta_info--block']}>
                <p>صاحب الحساب</p>
                <p>Account Holder</p>
              </div>
              <p className={styles['report__meta_info--slot']}>
                {user.account_holder}
              </p>
            </li>
            <li className={styles['report__meta_info--item']}>
              <div className={styles['report__meta_info--block']}>
                <p>كود صاحب الحساب</p>
                <p>Account Holder Code</p>
              </div>
              <p className={styles['report__meta_info--slot']}>
                {user.account_code}
              </p>
            </li>
            <li className={styles['report__meta_info--item']}>
              <div className={styles['report__meta_info--block']}>
                <p>تاريخ طباعة الكشف</p>
                <p>Printing Date</p>
              </div>
              <p className={styles['report__meta_info--slot']}>
                {user.printing_date}
              </p>
            </li>
          </ul>
        </div>
        <div className={styles.report__table}>
          <table className={styles.report__table_fl}>
            <thead>
              <tr>
                <th></th>
                <th>
                  <span>تاريخ المعاملة</span>
                  <span>Operation Date</span>
                </th>
                <th>
                  <span>مدين</span>
                  <span>Debt</span>
                </th>
                <th>
                  <span>دائن</span>
                  <span>Credit</span>
                </th>
                <th>
                  <span>المستفيد</span>
                  <span>Beneficiary</span>
                </th>
                <th>
                  <span>العملة</span>
                  <span>Currency</span>
                </th>
                <th>
                  <span>ملاحظة</span>
                  <span>Note</span>
                </th>
                <th>
                  <span>حالة العملية</span>
                  <span>Operation status</span>
                </th>
                <th>
                  <span>تاريخ الإستحقاق</span>
                  <span>Due Date</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, idx) => {
                return (
                  <tr key={transaction._id}>
                    <td>{idx + 1}</td>
                    <td>{transaction.report_date}</td>
                    <td>{transaction.debt ? transaction.debt : '-'}</td>
                    <td>{transaction.credit ? transaction.credit : '-'}</td>
                    <td className={styles.report__expand}>
                      {transaction.beneficiary}
                    </td>
                    <td>{transaction.currency}</td>
                    <td
                      className={`${styles.report__expand} ${styles.report__expand_note}`}
                      title='add note for this transaction'
                      onClick={() =>
                        initiateNoteHandler(transaction._id, transaction.note)
                      }
                    >
                      {transaction.note ? transaction.note : <Edit />}
                    </td>
                    <td
                      className={
                        transaction.isPaid
                          ? styles.report__green
                          : styles.report__red
                      }
                    >
                      {transaction.isPaid ? 'Paid' : 'Unpaid'}
                    </td>
                    <td>
                      {transaction.due_date ? transaction.due_date : 'N/A'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ReportTable
