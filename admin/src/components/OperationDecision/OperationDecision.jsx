import React, { useEffect } from 'react'
import style from './style.module.scss'
import {Modal, Alert} from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import {CheckDouble, Times} from '../../icons'
import {Currency, Loader, HeaderAlert} from '../../components'
import actions from '../../actions'
import constants from '../../constants'

const OperationDecision = ({show, onHide, id, notificationId}) => {
    const dispatch = useDispatch()
    const {loading, error, operation} = useSelector(state => state.getOperation)
    const {
        loading:updateLoading, 
        error:updateError, 
        message
    } = useSelector(state => state.updateOperationState)
    
    const stateName = {
        '#037A12':'Accredited',
        '#C7E81D':'Warning',
        '#EC4A0D':'Danger',
    }

    const declineOperationHandler = _ => {
        dispatch(actions.operations.updateOperationState(id, notificationId,  'decline'))
    }

    const approveOperationHandler = _ => {
        dispatch(actions.operations.updateOperationState(id, notificationId,  'active'))
    }
    
    const clearAlert = _ => {
        dispatch({type: constants.operations.UPDATE_OPERATION_STATE_RESET})
    }
    
    useEffect(() => {
        id && dispatch(actions.operations.getOperation(id))
        return () => clearAlert()
    },[id])
    
    return (
        <Modal show={show} onHide={onHide}>
            
            <span className={style.decision__close}
                onClick={onHide}>
                <Times/>
            </span>
            
            <div className={style.decision}>
            
            {loading && <Loader size='8' center options={{animation:'border'}}/> } 
            
            {error && <HeaderAlert type='danger' size='2' text={error}/>}  
            
            {updateLoading && 
                <>
                    <Loader size='8' center custom={{zIndex:'9999'}} options={{animation:'border'}}/>
                    <div className={style.decision__overlay}></div>
                </> 
            }

            { updateError && 
                <Alert variant='danger' onClose={clearAlert} dismissible>
                    {updateError}
                </Alert> 
            }

            { message && 
                <Alert variant='success' onClose={clearAlert} dismissible>
                    {message}
                </Alert> 
            }

            { operation && 
            <> <h2>Operation Details</h2>
                
                <div className={style.decision__peers}>
                    <div className={style.decision__peer}>
                        <div className={style.decision__peer_photo}>
                            <span style={{backgroundColor:operation.initiator.user.colorCode.code}}></span>
                            <img src={`/api/files/${operation.initiator.user.avatar}`} alt="peer"/>
                        </div>
                        <h3>{operation.initiator.user.fullNameInEnglish}</h3>
                         <p>
                             <span> {operation.initiator.type.toLocaleUpperCase()} </span>
                             <span> {stateName[operation.initiator.user.colorCode.code]} </span>
                         </p>
                    </div>
                    <div className={style.decision__peer}>
                        <div className={style.decision__peer_photo}>
                            <span style={{backgroundColor:operation.peer.user.colorCode.code}}></span>
                            <img src={`/api/files/${operation.peer.user.avatar}`} alt="peer"/>
                        </div>
                        <h3> {operation.peer.user.fullNameInEnglish}</h3>
                        <p>
                             <span> {operation.peer.type.toLocaleUpperCase()} </span>
                             <span> {stateName[operation.peer.user.colorCode.code]} </span>
                         </p>
                    </div>
                </div>

                <ul className={style.decision__details}>
                    <li>
                        <span>Operation Value:</span> <span>{operation.peer.value}</span>
                    </li>
                    <li>
                        <span>Value Currency:</span> <Currency currency={operation.currency}/>
                    </li>
                    <li>
                        <span>Due Date:</span> 
                        <span> 
                            {
                                operation.dueDate 
                                ? new Date(operation.dueDate).toLocaleDateString() 
                                :'N/A'
                            }
                        </span>
                    </li>
                </ul>

                <div className={style.decision__actions}>
                    <button onClick={approveOperationHandler}>
                        <span> <CheckDouble/> </span>
                         <span>Approve</span> 
                    </button>
                    <button onClick={declineOperationHandler}>
                        <span> <Times/> </span>
                        <span>Decline</span>
                    </button>
                </div>

            </> } 
            </div>
        </Modal>
    )
}

export default OperationDecision
