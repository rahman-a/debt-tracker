import React, { useState } from 'react'
import style from './style.module.scss'
import { Button, Form, Modal, Tab, Tabs, Alert } from 'react-bootstrap'

const ReportPrinting = ({ show, hideHandler, data }) => {
  const [activeTab, setActiveTab] = useState('single_transaction')
  const [isPrinting, setIsPrinting] = useState(false)
  const [peerInfo, setPeerInfo] = useState('')
  const [error, setError] = useState({
    type: null,
    message: null,
  })
  const [searchData, setSearchData] = useState({
    request_type: null,
    transaction_code: '',
    peer_id: null,
    act_as: [],
    transaction_type: [],
  })
  const initiatePrinting = (_) => {
    let final_data = {}
    if (activeTab === 'single_transaction') {
      if (!searchData.transaction_code) {
        setError({
          type: 'single',
          message: 'Please enter transaction code',
        })
        return
      }
      final_data = {
        transaction_code: searchData.transaction_code,
        request_type: 'single_transaction',
      }
    }
    if (activeTab === 'selected_transactions') {
      if (
        !peerInfo &&
        !searchData.act_as.length &&
        !searchData.transaction_type.length
      ) {
        setError({
          type: 'selected',
          message: 'Please select at least one selection criteria',
        })
        return
      }
      final_data = {
        ...searchData,
        peer_id: peerInfo._id,
        request_type: 'selected_transaction',
      }
    }
    if (activeTab === 'full_report') {
      final_data = { request_type: 'full_report' }
    }
    setSearchData({
      request_type: null,
      transaction_code: '',
      peer_id: null,
      act_as: [],
      transaction_type: [],
    })
    setPeerInfo(null)
    console.log({ final_data })
  }
  return (
    <Modal
      show={show}
      onHide={hideHandler}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header>
        <Modal.Title>Report Printing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <div className={style.printing__overlay}></div> */}
        <div className={style.printing__container}>
          <Tabs
            defaultActiveKey='single_transaction'
            id='fill-tab-example'
            className='mb-3'
            onSelect={(k) => setActiveTab(k)}
            fill
          >
            <Tab
              eventKey='single_transaction'
              title='Single transaction'
              tabClassName={style.printing__tab}
            >
              <Alert variant={error?.type === 'single' ? 'danger' : 'info'}>
                <p>
                  {error?.type === 'single'
                    ? error?.message
                    : 'You can print a single transaction just by entering its code'}
                </p>
              </Alert>
              <Form>
                <Form.Group controlId='formBasicReport'>
                  <Form.Label>Transaction Code</Form.Label>
                  <Form.Control
                    size='lg'
                    type='text'
                    placeholder='Enter transaction code'
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
            </Tab>
            <Tab
              eventKey='selected_transactions'
              title='Selected transactions'
              tabClassName={style.printing__tab}
            >
              <Alert variant={error?.type === 'selected' ? 'danger' : 'info'}>
                <p>
                  {error?.type === 'selected'
                    ? error?.message
                    : 'You can print a many transactions based on selected options'}
                </p>
              </Alert>
              <Form>
                <Form.Group controlId='formBasicReports'>
                  <Form.Label>Enter the second party code: </Form.Label>
                  <Form.Control
                    size='lg'
                    type='text'
                    placeholder='Enter the second party code'
                    style={{ width: '50%' }}
                    value={peerInfo}
                    onChange={(e) => setPeerInfo(e.target.value)}
                  />
                  {/* <PeerSearch setPeerInfo={setPeerInfo} type='reports' /> */}
                </Form.Group>
                <Form.Group
                  controlId='formBasicReportsType'
                  style={{ margin: '2rem 0' }}
                >
                  <Form.Label>Print all transactions as: </Form.Label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Form.Check
                      type='switch'
                      id='peer_type'
                      label='Credit'
                      checked={searchData.act_as.includes('credit')}
                      onChange={(e) => {
                        if (
                          e.target.checked &&
                          !searchData.act_as.includes('credit')
                        ) {
                          setSearchData({
                            ...searchData,
                            act_as: [...searchData.act_as, 'credit'],
                          })
                        } else {
                          setSearchData({
                            ...searchData,
                            act_as: searchData.act_as.filter(
                              (a) => a !== 'credit'
                            ),
                          })
                        }
                      }}
                    />
                    <Form.Check
                      type='switch'
                      label='Debit'
                      id='peer_type'
                      checked={searchData.act_as.includes('debit')}
                      onChange={(e) => {
                        if (
                          e.target.checked &&
                          !searchData.act_as.includes('debit')
                        ) {
                          setSearchData({
                            ...searchData,
                            act_as: [...searchData.act_as, 'debit'],
                          })
                        } else {
                          setSearchData({
                            ...searchData,
                            act_as: searchData.act_as.filter(
                              (a) => a !== 'debit'
                            ),
                          })
                        }
                      }}
                    />
                  </div>
                </Form.Group>
                <Form.Group
                  controlId='formBasicTransactionType'
                  style={{ margin: '2rem 0' }}
                >
                  <Form.Label>Print all transactions that are: </Form.Label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Form.Check
                      type='switch'
                      id='report_type'
                      label='Active'
                      checked={searchData.transaction_type.includes('paid')}
                      onChange={(e) => {
                        if (
                          e.target.checked &&
                          !searchData.transaction_type.includes('paid')
                        ) {
                          setSearchData({
                            ...searchData,
                            transaction_type: [
                              ...searchData.transaction_type,
                              'paid',
                            ],
                          })
                        } else {
                          setSearchData({
                            ...searchData,
                            transaction_type:
                              searchData.transaction_type.filter(
                                (a) => a !== 'paid'
                              ),
                          })
                        }
                      }}
                    />
                    <Form.Check
                      type='switch'
                      label='Closed'
                      id='report_type'
                      checked={searchData.transaction_type.includes('unpaid')}
                      onChange={(e) => {
                        if (
                          e.target.checked &&
                          !searchData.transaction_type.includes('unpaid')
                        ) {
                          setSearchData({
                            ...searchData,
                            transaction_type: [
                              ...searchData.transaction_type,
                              'unpaid',
                            ],
                          })
                        } else {
                          setSearchData({
                            ...searchData,
                            transaction_type:
                              searchData.transaction_type.filter(
                                (a) => a !== 'unpaid'
                              ),
                          })
                        }
                      }}
                    />
                  </div>
                </Form.Group>
              </Form>
            </Tab>
            <Tab
              eventKey='full_report'
              title='Full report'
              tabClassName={style.printing__tab}
            >
              <Alert variant='info'>
                <p>
                  This will print all the transactions either active or closed
                </p>
              </Alert>
            </Tab>
          </Tabs>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size='lg'
          variant='secondary'
          disabled={isPrinting}
          onClick={() => hideHandler(false)}
        >
          Close
        </Button>
        <Button
          disabled={isPrinting}
          size='lg'
          variant='primary'
          onClick={initiatePrinting}
        >
          Print
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReportPrinting
