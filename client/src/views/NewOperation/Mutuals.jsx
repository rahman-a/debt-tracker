import React, { useState, useEffect } from 'react'
import { Modal, Button, Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Loader, HeaderAlert } from '../../components'
import Pagination from './Pagination'
import MutualsList from './MutualsList'
import { useTranslation } from 'react-i18next'

const Mutuals = ({ mutuals, showMutuals, setShowMutuals, setPeerInfo }) => {
  const [mutualsClients, setMutualClients] = useState([])
  const { t } = useTranslation()
  const {
    mutuals: peers,
    error,
    loading,
  } = useSelector((state) => state.mutualsPeers)

  let content = (
    <MutualsList
      mutualsClients={mutualsClients}
      setPeerInfo={setPeerInfo}
      setShowMutuals={setShowMutuals}
    />
  )

  if (loading && showMutuals) {
    content = (
      <Loader
        size='6'
        options={{ animation: 'border' }}
        custom={{ marginBottom: '3rem' }}
      />
    )
  }

  if (error) {
    content = <Alert variant='danger'>{error}</Alert>
  }

  if (peers?.length === 0) {
    content = <HeaderAlert text='No thing found' size='2' />
  }

  useEffect(() => {
    mutuals?.length && setMutualClients(mutuals)
  }, [mutuals])

  useEffect(() => {
    peers && setMutualClients(peers)
  }, [peers])
  return (
    <Modal show={showMutuals} onHide={() => setShowMutuals(false)}>
      <Modal.Header></Modal.Header>
      <Modal.Body
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {content}
        <Pagination />
      </Modal.Body>
      <Modal.Footer>
        <Button
          size='lg'
          variant='secondary'
          onClick={() => setShowMutuals(false)}
        >
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Mutuals
