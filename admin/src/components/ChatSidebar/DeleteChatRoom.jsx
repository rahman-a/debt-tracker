import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import {SideAlert, Loader} from '../../components'
import actions from '../../actions'
import constants from '../../constants'

const DeleteChatRoom = ({toggleDelete, setToggleDelete, id}) => {
    const {loading, error, message} = useSelector(state => state.deleteRoom)
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const lang = i18next.language
    
    const confirmDeleteUser = _ => {
        dispatch(actions.chat.deleteRoom(id))
    }

    const clearAlert = _ => {
        dispatch({type:constants.chat.DELETE_ROOM_RESET})
    }


    useEffect(() => {
        message && setToggleDelete(false)
    },[message])
    
    return (

    <>
    
        <SideAlert
        type="success"
        isOn={message ? true :false}
        text={message}
        time={5000}
        reset={() => clearAlert()}
        />

    <SideAlert
        type="danger"
        isOn={error ? true :false}
        text={error}
        time={5000}
        reset={() => clearAlert()}
        />
        <Modal show={toggleDelete} onHide={() => setToggleDelete(false)}>
            <Modal.Body>
                <div className={style.sidebar__delete}>
                    {
                    loading && <>
                        <div className={style.sidebar__overlay}></div>
                        <Loader size='4' center options={{animation:'border'}}/>
                       </>
                    } 
                    <h2>{t('are-you-sure')}</h2>
                    <p>{t('confirm-delete-notice', {asset:lang === 'ar' ? 'المجموعة' :'Group'})}</p>
                    <p>{t('undone-process')}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    onClick={() => setToggleDelete(false)} 
                    variant='success' 
                    size='lg'
                    disabled={loading ? true : false}>
                    {t('cancel-btn')}
                </Button>
                <Button 
                    variant='danger' 
                    size='lg'
                    onClick={confirmDeleteUser}
                    disabled={loading ? true : false}>
                    {t('confirm-btn', {asset:lang === 'ar' ? 'المجموعة' :'Group'})}
                </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default DeleteChatRoom