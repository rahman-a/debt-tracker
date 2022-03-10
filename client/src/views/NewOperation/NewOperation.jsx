import React, {useState} from 'react'
import style from './style.module.scss'
import {useTranslation} from 'react-i18next'
import {PeerSearch, OperationCreation} from '../../components'

const OperationInit = () => {
    const [peerInfo, setPeerInfo] = useState(null)
    const {t} = useTranslation()
    return (
        <div className={style.operation}>
            <div className="container">
                <h2 className={style.operation__header}>
                    {peerInfo 
                    ? t('operation-creation')
                    : t('peer-search') }
                </h2>
                <div className={style.operation__wrapper}>
                    {
                        peerInfo 
                        ? <OperationCreation peerInfo={peerInfo}/>
                        : <PeerSearch  
                          setPeerInfo={setPeerInfo}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default OperationInit
