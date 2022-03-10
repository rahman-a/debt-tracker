import React, { useEffect } from 'react'
import style from './style.module.scss'
import {Modal, Alert} from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import {CheckDouble, Times} from '../../icons'
import {Currency, Loader, HeaderAlert} from '../../components'
import actions from '../../actions'
import constants from '../../constants'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const OperationDecision = ({show, onHide, id, notificationId}) => {
    const dispatch = useDispatch()
    const {loading, error, operation} = useSelector(state => state.getOperation)
    const {
        loading:updateLoading, 
        error:updateError, 
        message
    } = useSelector(state => state.updateOperationState)
    
    const lang = i18next.language
    const {t} = useTranslation()

    const stateName = {
        '#037A12':lang === 'ar' ? 'مؤهل' : 'Accredited',
        '#C7E81D':lang === 'ar' ? 'تحذير' : 'Warning',
        '#EC4A0D':lang === 'ar' ? 'خطر' : 'Danger',
    }

    const textColor = {
        '#037A12':'#fff',
        '#C7E81D':'#000',
        '#EC4A0D':'#fff',
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
            <> <h2>{t('operation-details')}</h2>
                
                <div className={style.decision__peers}>
                    <div className={style.decision__peer}>
                        <div className={style.decision__peer_photo}>
                            <span style={{backgroundColor:operation.initiator.user.colorCode.code}}></span>
                            <img src={`/api/files/${operation.initiator.user.avatar}`} alt="peer"/>
                        </div>
                        <h3>{
                       lang === 'ar' 
                       ?  operation.initiator.user.fullNameInArabic
                       :  operation.initiator.user.fullNameInEnglish
                        }</h3>
                         <p>
                             <span> {t(operation.initiator.type).toLocaleUpperCase()} </span>
                             <span style={{
                                  backgroundColor:operation.initiator.user.colorCode.code,
                                  color:textColor[operation.initiator.user.colorCode.code]
                            }}> {stateName[operation.initiator.user.colorCode.code]} </span>
                         </p>
                    </div>
                    <div className={style.decision__peer}>
                        <div className={style.decision__peer_photo}>
                            <span style={{backgroundColor:operation.peer.user.colorCode.code}}></span>
                            <img src={`/api/files/${operation.peer.user.avatar}`} alt="peer"/>
                        </div>
                        <h3> {
                         lang === 'ar' 
                         ?  operation.peer.user.fullNameInArabic
                         :  operation.peer.user.fullNameInEnglish
                        }</h3>
                        <p>
                             <span> {t(operation.peer.type).toLocaleUpperCase()} </span>
                             <span style={{
                                 backgroundColor:operation.peer.user.colorCode.code,
                                 color:textColor[operation.peer.user.colorCode.code]
                            }}> {stateName[operation.peer.user.colorCode.code]} </span>
                         </p>
                    </div>
                </div>

                <ul className={`${style.decision__details} ${lang === 'ar' ? style.decision__details_ar :''}`}>
                    <li>
                        <span>{t('operation-value')}:</span> <span>{operation.peer.value}</span>
                    </li>
                    <li>
                        <span>{t('operation-currency')}:</span> <Currency currency={operation.currency}/>
                    </li>
                    <li>
                        <span>{t('due-date')}:</span> 
                        <span> 
                            {
                                operation.dueDate 
                                ? new Date(operation.dueDate).toLocaleDateString() 
                                :'N/A'
                            }
                        </span>
                    </li>
                </ul>

                <div className={`${style.decision__actions} ${lang === 'ar' ? style.decision__actions_ar :''}`}>
                    <button onClick={approveOperationHandler}>
                        <span> <CheckDouble/> </span>
                         <span>{t('decision-approve')}</span> 
                    </button>
                    <button onClick={declineOperationHandler}>
                        <span> <Times/> </span>
                        <span>{t('decision-decline')}</span>
                    </button>
                </div>

            </> } 
            </div>
        </Modal>
    )
}

export default OperationDecision
