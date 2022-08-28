import React from 'react'
import style from './style.module.scss'
import { Table, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const MutualsList = ({ mutualsClients, setPeerInfo, setShowMutuals }) => {
  const lang = i18next.language
  const { t } = useTranslation()
  const initiateOperationCreation = (peer) => {
    setPeerInfo(peer)
    setShowMutuals(false)
  }
  return (
    <Table striped bordered hover size='sm'>
      <thead>
        <tr>
          <th>#</th>
          <th>{t('full-name')}</th>
          <th>{t('image')}</th>
          <th>{t('entries-count')}</th>
          <th>{t('color-code')}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {mutualsClients?.length &&
          mutualsClients.map((peer, idx) => (
            <tr key={peer._id}>
              <td>{idx + 1}</td>
              <td>{lang === 'en' ? peer.name : peer.arabicName}</td>
              <td>
                <figure className={style.operation__photo}>
                  <img src={`/api/files/${peer.image}`} alt='mutual' />
                </figure>
              </td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {peer.operations}
              </td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <span
                  className={style.operation__badge}
                  style={{ backgroundColor: peer.color }}
                ></span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <Button
                  variant='success'
                  onClick={() => initiateOperationCreation(peer)}
                >
                  {t('new-operation')}
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  )
}

export default MutualsList
