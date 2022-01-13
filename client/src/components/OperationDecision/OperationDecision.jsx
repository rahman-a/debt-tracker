import React from 'react'
import style from './style.module.scss'
import Modal from 'react-bootstrap/Modal'
import {CheckDouble, Times} from '../../icons'
import {Currency} from '../../components'

const OperationDecision = ({show, onHide}) => {
    return (
        <Modal show={show} onHide={onHide}>
            <span className={style.decision__close}
            onClick={onHide}>
                <Times/>
            </span>
            <div className={style.decision}>
                <h2>Operation Details</h2>
                <div className={style.decision__peers}>
                    <div className={style.decision__peer}>
                        <div className={style.decision__peer_photo}>
                            <span style={{backgroundColor:'#037A12'}}></span>
                            <img src="/images/photos/photo-1.jpg" alt="peer"/>
                        </div>
                        <h3>Samantha Abraham John Jackson</h3>
                         <p>
                             <span>Creditor</span>
                             <span>Accredited Agent</span>
                         </p>
                    </div>
                    <div className={style.decision__peer}>
                        <div className={style.decision__peer_photo}>
                            <span style={{backgroundColor:'#C7E81D'}}></span>
                            <img src="/images/photos/photo-2.jpg" alt="peer"/>
                        </div>
                        <h3>Samantha Abraham John Jackson</h3>
                        <p>
                             <span>Debtor</span>
                             <span>Delayed Payment</span>
                         </p>
                    </div>
                </div>
                <ul className={style.decision__details}>
                    <li>
                        <span>Operation Value:</span> <span>5243</span>
                    </li>
                    <li>
                        <span>Value Currency:</span> <Currency currency='USD'/>
                    </li>
                    <li>
                        <span>Due Date:</span> <span>05/03/2022</span>
                    </li>
                </ul>
                <div className={style.decision__actions}>
                    <button>
                        <span> <CheckDouble/> </span>
                         <span>Approve</span> 
                    </button>
                    <button>
                        <span> <Times/> </span>
                        <span>Decline</span>
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default OperationDecision
