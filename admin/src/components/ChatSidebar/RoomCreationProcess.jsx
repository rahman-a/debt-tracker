import React, {useEffect} from 'react'
import style from './ChatSidebar.module.scss'
import {Modal, Button, Form} from 'react-bootstrap'
import AsyncSelect from 'react-select/async'
import Scrollbar from 'simplebar-react'
import {ChatDialogue, Close} from '../../icons'

const Room = ({isRoomCreation, setIsRoomCreation}) => {
  
    const saveRoomHandler = _ => {
        console.log('Save');
    }
  
    useEffect(() => {
        console.log({isRoomCreation});
    },[isRoomCreation])

    return (
        <Modal show={isRoomCreation} onHide={() => setIsRoomCreation(false)}>
            <Modal.Header>
                <p>
                    <span style={{marginRight:'1rem'}}> <ChatDialogue/>  </span>
                    <span> Create Chat Room </span>
                </p>
            </Modal.Header>
            <Modal.Body>
                <div className={style.sidebar__room}>
                    
                    <Form.Group className="mb-3 fs-5" controlId="formBasicName">
                        <Form.Label> Room Name </Form.Label>
                        <Form.Control size='lg' type="text" placeholder="Enter room name" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3 fs-5" controlId="formBasicImage">
                        <Form.Label> Room Image </Form.Label>
                        <Form.Control size='lg' type="file"/>
                        <Form.Text className='text-muted'> max size for image is 500KB </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3 fs-5" controlId="formBasicMembers">
                        <div className={style.sidebar__room_members}>
                            <Scrollbar style={{width:'100%', maxHeight:'20rem'}}>
                                {
                                    [...Array(5)].map((_, idx) => (
                                        <div className={style.sidebar__room_member} key={idx}>
                                            <img src="/images/photos/photo-1.jpg" alt="member" />
                                            <span> Ahmed Abdelrahman </span>
                                            <span> <Close/> </span>
                                        </div>
                                    ))
                                }
                            </Scrollbar>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3 fs-5" controlId="formBasicSearch">
                        <Form.Label> Select Members </Form.Label>
                        <AsyncSelect/>
                    </Form.Group>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='success' onClick={saveRoomHandler}> Save </Button>
                <Button variant='danger' onClick={() => setIsRoomCreation(false)}> Close </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Room