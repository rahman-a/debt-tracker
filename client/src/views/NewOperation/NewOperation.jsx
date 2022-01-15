import React, {useState} from 'react'
import style from './style.module.scss'
import {PeerSearch, OperationCreation} from '../../components'

const OperationInit = () => {
    const [peerInfo, setPeerInfo] = useState(null)
    
    return (
        <div className={style.operation}>
            <div className="container">
                <h2 className={style.operation__header}>
                    {peerInfo 
                    ?'Operation Creation Process'
                    :'Search for the second peer'}
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
