import React, {useEffect, useState} from 'react'
import style from './style.module.scss'
import {Modal, Button, Form} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import AsyncSelect from 'react-select/async'
import { useTranslation } from 'react-i18next'
import Scrollbar from 'simplebar-react'
import {SideAlert, Loader} from '..'
import {ChatDialogue, Close} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'

const Room = ({isRoomCreation, setIsRoomCreation}) => {
    const [name, setName] = useState('')
    const [img, setImg] = useState(null)
    const [selectedMembers, setSelectedMembers] = useState([])
    const [errors, setErrors] = useState(null)
    const {t} = useTranslation()
    const {members} = useSelector(state => state.membersSearch)
    const {loading, error, message} = useSelector(state => state.createRoom)
    const dispatch = useDispatch()
    
    const searchMembersHandler = value => {
        dispatch(actions.chat.membersSearch(value))
    }
    
    const loadOptions = _ => {
      let result = [] 
      result = members && members.map(member => (
            {
                _id:member._id,
                label:member.name,
                image:member.image
            }
        ))
        return new Promise(resolve => resolve(result))
    }

    const addMemberHandler = member => {
        const isMemberExist = selectedMembers.find(m => m._id === member._id) 
        if(isMemberExist) return setErrors(t('member-exist'))
        if(!isMemberExist) setSelectedMembers([...selectedMembers, member])
    }
    
    const removeMember = id => {
        const filterMembers = selectedMembers.filter(member => member._id !== id)
        setSelectedMembers(filterMembers)
    }


    const saveRoomHandler = _ => {
        
        if(!name) {
            setErrors(t('group-name-required'))
            return
        }

        if(!img) {
            setErrors(t('group-image-required'))
            return
        }

        if((img.size / 1024) > 500 ) {
            setErrors(t('image-size-large'))
            return
        }

        if(selectedMembers.length < 2) {
            setErrors(t('group-require-least-2member'))
            return
        }
        
        const membersIds = selectedMembers.map(member => member._id)
        
        const data = new FormData()
        data.append('name', name)
        data.append('image', img)
        data.append('members', membersIds)
        
        dispatch(actions.chat.createRoom(data))
    }

    const clearAlert = () => {
        dispatch({type:constants.chat.CREATE_ROOM_RESET})
        setErrors(null)
    }

    useEffect(() => {
     error && setErrors(error)
    },[error])

    return (

        <>

        <SideAlert
        type='danger'
        isOn={errors ? true : false}
        text={errors}
        time={5000}
        reset={() =>  clearAlert()}/>

        <SideAlert
        type='success'
        isOn={message ? true : false}
        text={message}
        time={5000}
        reset={() =>  clearAlert()}
    
        />
        
            <Modal show={isRoomCreation} onHide={() => setIsRoomCreation(false)}>
                <Modal.Header>
                    <p>
                        <span style={{marginRight:'1rem'}}> <ChatDialogue/>  </span>
                        <span> {t('create-chat-room')} </span>
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <div className={style.room}>
                       {loading && <>
                        <div className={style.room__overlay}></div>
                        <Loader size='4' center options={{animation:'border'}}/>
                       </>} 
                        <Form.Group className="mb-3 fs-5" controlId="formBasicName">
                            <Form.Label> {t('room-name')} </Form.Label>
                            <Form.Control 
                            size='lg' 
                            type="text" 
                            placeholder={t('enter-room-name')} 
                            onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>
                        
                        <Form.Group className="mb-3 fs-5" controlId="formBasicImage">
                            <Form.Label> {t('room_image')} </Form.Label>
                            <Form.Control size='lg' type="file" onChange={(e) => setImg(e.target.files[0])}/>
                            <Form.Text className='text-muted'> {t('max-size-500')} </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3 fs-5" controlId="formBasicMembers">
                            <div className={style.room__members}>
                                <Scrollbar className='sidebar__room_scroll'
                                style={{width:'100%', maxHeight:'20rem'}}>
                                    {
                                        selectedMembers.map((member, idx) => (
                                            <div className={style.room__member} key={idx}>
                                                <img src={`/api/files/${member.image}`} alt="member" />
                                                <span> {member.label} </span>
                                                <span onClick={() => removeMember(member._id)}> <Close/> </span>
                                            </div>
                                        ))
                                    }
                                </Scrollbar>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3 fs-5" controlId="formBasicSearch">
                            <Form.Label> {t('select-members')} </Form.Label>
                            <AsyncSelect 
                            defaultOptions 
                            cacheOptions 
                            loadOptions={loadOptions}
                            onInputChange={searchMembersHandler}
                            onChange={(member) => addMemberHandler(member)}
                            />
                        </Form.Group>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        disabled={loading ? true : false} 
                        variant='success' 
                        onClick={saveRoomHandler}> 
                        {t('save')} 
                    </Button>
                    <Button 
                        disabled={loading ? true : false} 
                        variant='danger' 
                        onClick={() => setIsRoomCreation(false)}> 
                        {t('close')} 
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Room