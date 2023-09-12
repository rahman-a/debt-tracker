import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Button, Form, Modal, Tab, Tabs, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import Loader from '../Loader/Loader'
import SingleTransaction from './SingleTransaction'
import FilteredTransactions from './FilteredTransactions'
import ReportTable from './ReportTable'
import actions from '@/src/actions'
import { ArrowLeft, ArrowRight } from '@/src/icons'

/** required data */
// user_code[admin], isAdmin[admin]
// peer_code,request_type [single_transaction, selected_transactions, full_report],
// transaction_code,
// act_as, transaction_type,
// note
// period:{from, to}
// lang

const ReportPrinting = ({ show, hideHandler, data }) => {
  const [activeTab, setActiveTab] = useState('single_transaction')
  const [isPrinting, setIsPrinting] = useState(false)
  const [isReportData, setIsReportData] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [peerInfo, setPeerInfo] = useState(null)
  const [errors, setErrors] = useState({
    type: null,
    message: null,
  })
  const [searchData, setSearchData] = useState({
    request_type: null,
    transaction_code: '',
    peer_code: null,
    act_as: [],
    transaction_type: [],
    lang: 'en',
    period: { from: '', to: '' },
  })
  const { error, reports } = useSelector((state) => state.getReportsData)
  const { error: print_error, buffer } = useSelector(
    (state) => state.printReportsData
  )
  const { t } = useTranslation()
  const lang = i18next.language

  const dispatch = useDispatch()

  const initiatePrintingHandler = (_) => {
    setIsPrinting(true)
    dispatch(actions.reports.printReportsData(reportData))
  }
  const GetPrintingDataHandler = (_) => {
    setIsPrinting(true)
    setReportData(null)
    setIsReportData(false)
    let final_data = {}
    if (activeTab === 'single_transaction') {
      if (!searchData.transaction_code) {
        setErrors({
          type: 'single_transaction',
          message: t('required-transaction-code'),
        })
        setIsPrinting(false)
        return
      }
      setErrors({ type: null, message: null })
      final_data = {
        lang: searchData.lang,
        transaction_code: searchData.transaction_code,
        request_type: 'single_transaction',
      }
    }
    if (activeTab === 'filtered_transactions') {
      if (
        !peerInfo &&
        !searchData.act_as.length &&
        !searchData.transaction_type.length &&
        !searchData.period.from &&
        !searchData.period.to
      ) {
        setErrors({
          type: 'filtered_transactions',
          message: t('required-filter-criteria'),
        })
        setIsPrinting(false)
        return
      }
      setErrors({ type: null, message: null })
      final_data = {
        ...searchData,
        peer_code: peerInfo?.code,
        request_type: 'selected_transactions',
      }
    }
    if (activeTab === 'full_report') {
      final_data = { lang: searchData.lang, request_type: 'full_report' }
    }
    setSearchData({
      request_type: null,
      transaction_code: '',
      peer_code: null,
      act_as: [],
      transaction_type: [],
      lang: 'en',
      period: { from: '', to: '' },
    })
    setPeerInfo(null)
    dispatch(actions.reports.getReportsData(final_data))
  }

  useEffect(
    (_) => {
      if (reports) {
        setIsPrinting(false)
        setReportData(reports)
        setIsReportData(true)
      }
    },
    [reports]
  )

  useEffect(
    (_) => {
      if (buffer) {
        setIsPrinting(false)
      }
    },
    [buffer]
  )

  useEffect(() => {
    if (error) {
      setIsPrinting(false)
      setErrors({ type: activeTab, message: error })
    }
    if (print_error) {
      setIsPrinting(false)
      setErrors({ type: 'printing', message: print_error })
    }
  }, [error, print_error])
  return (
    <Modal
      show={show}
      onHide={hideHandler}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header>
        <Modal.Title>{t('report-print')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isPrinting && (
          <div className={style.printing__overlay}>
            <Loader center size='5' />
          </div>
        )}
        {isReportData && reportData ? (
          <div className={style.printing__table}>
            <Button
              variant='secondary'
              className='py-2 mb-5'
              style={{ minWidth: '10rem' }}
              onClick={() => setIsReportData(false)}
            >
              {lang === 'en' ? <ArrowLeft /> : <ArrowRight />}
            </Button>
            <ReportTable reports={reportData} setReportData={setReportData} />
          </div>
        ) : (
          <div className={style.printing__container}>
            {reportData && (
              <Button
                variant='secondary'
                className='py-2 mb-5'
                style={{
                  minWidth: '10rem',
                  position: 'absolute',
                  right: lang == 'en' ? '2rem' : 'unset',
                  left: lang == 'ar' ? '2rem' : 'unset',
                }}
                onClick={() => setIsReportData(true)}
              >
                {lang === 'en' ? <ArrowRight /> : <ArrowLeft />}
              </Button>
            )}
            <Form.Select
              aria-label='report language'
              size='lg'
              style={{ width: '50%', margin: '1rem 0' }}
              onChange={(e) =>
                setSearchData({ ...searchData, lang: e.target.value })
              }
            >
              <option value='en'>{t('select-lang')}</option>
              <option value='en'>{t('english')}</option>
              <option value='ar'>{t('arabic')}</option>
            </Form.Select>
            <Tabs
              defaultActiveKey={activeTab}
              id='fill-tab-example'
              className='mb-3'
              onSelect={(k) => setActiveTab(k)}
              fill
            >
              {/* single transaction */}
              <Tab
                eventKey='single_transaction'
                title={t('single-transaction')}
                tabClassName={style.printing__tab}
              >
                <SingleTransaction
                  setSearchData={setSearchData}
                  searchData={searchData}
                  error={errors}
                />
              </Tab>
              <Tab
                eventKey='filtered_transactions'
                title={t('filter-transactions')}
                tabClassName={style.printing__tab}
              >
                <FilteredTransactions
                  setSearchData={setSearchData}
                  searchData={searchData}
                  setPeerInfo={setPeerInfo}
                  error={errors}
                />
              </Tab>
              <Tab
                eventKey='full_report'
                title={t('full-report')}
                tabClassName={style.printing__tab}
              >
                <Alert variant='info'>
                  <p>{t('full-report-info')}</p>
                </Alert>
              </Tab>
            </Tabs>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          size='lg'
          variant='secondary'
          disabled={isPrinting}
          onClick={() => hideHandler(false)}
        >
          {t('close')}
        </Button>
        {isReportData ? (
          <Button
            disabled={isPrinting}
            size='lg'
            variant='primary'
            onClick={initiatePrintingHandler}
          >
            {t('print')}
          </Button>
        ) : (
          <Button
            disabled={isPrinting}
            size='lg'
            variant='primary'
            onClick={GetPrintingDataHandler}
          >
            {t('submit')}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default ReportPrinting
