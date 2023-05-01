import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { PeerSearch, OperationCreation } from '../../components'
import actions from '../../actions'
import Mutuals from './Mutuals'

const OperationInit = () => {
  const [peerInfo, setPeerInfo] = useState(null)
  const [showMutuals, setShowMutuals] = useState(false)
  const { user } = useSelector((state) => state.isAuth)
  const { mutuals } = useSelector((state) => state.mutualsPeers)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    !showMutuals && dispatch(actions.users.getMutualsPeers(user._id))
  }, [showMutuals])
  return (
    <div className={style.operation}>
      <Mutuals
        mutuals={mutuals}
        showMutuals={showMutuals}
        setShowMutuals={setShowMutuals}
        setPeerInfo={setPeerInfo}
      />
      <div className='container'>
        <Button
          variant='dark'
          size='lg'
          className={style.operation__mutuals}
          onClick={() => setShowMutuals(true)}
        >
          {t('previous-clients')}
        </Button>
        <h2 className={style.operation__header}>
          {peerInfo ? t('operation-creation') : t('peer-search')}
        </h2>
        <div className={style.operation__wrapper}>
          {peerInfo ? (
            <OperationCreation peerInfo={peerInfo} />
          ) : (
            <PeerSearch setPeerInfo={setPeerInfo} mutuals={mutuals} />
          )}
        </div>
      </div>
    </div>
  )
}

export default OperationInit
