import React, {useState, useEffect} from 'react';
import style from './style.module.scss'
import {useNavigate} from 'react-router-dom'
import {Modal, Button, Badge} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {Loader} from '../../components'
import {Edit, Trash} from '../../icons'
import actions from '../../actions';

const Row = ({user, idx}) => {
    
    const [toggleDelete, setToggleDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [userId, setUserId] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {message, error} = useSelector(state => state.deleteUser)
    
    const variant = {
        "#037A12":{color:'success', text:'OK'},
        "#C7E81D":{color:'warning', text:'WARNING'},
        "#EC4A0D":{color:'danger', text:'DANGER'}
    }

    const dateFormat = {
        day:'2-digit',
        month:'short',
        year:'numeric'
    }
    
    const confirmDeleteUser = _ => {  
        setToggleDelete(false)
        setIsDeleting(true)
        setTimeout(() => {
            dispatch(actions.admin.deleteUser(userId))
        },500)
    }

    const initiateUserDelete = id => {
        setUserId(id)
        setToggleDelete(true)
    }

    useEffect(() => {
        (message || error) && setIsDeleting(false)
    },[message, error])

  return <>
  
    <Modal show={toggleDelete} onHide={() => setToggleDelete(false)}>
        <Modal.Body>
            <div className={style.members__delete}>
              <h2>Are You Sure?</h2>
              <p>Do you really want to delete the member?</p>
              <p>This Process can't be undone.</p>
            </div>
        </Modal.Body>
        <Modal.Footer>
              <Button 
                onClick={() => setToggleDelete(false)} 
                variant='success' 
                size='lg'>
                NO, DON'T DELETE
              </Button>
              <Button 
                variant='danger' 
                size='lg'
                onClick={confirmDeleteUser}>
                YES, DELETE THE MEMBER
              </Button>
        </Modal.Footer>
    </Modal>
    
    
    <tr>
        
        <td> {idx + 1} </td>
        
        <td style={{
            backgroundColor: user.isAccountConfirmed ?'#fff':'#dc3545',
            color:user.isAccountConfirmed ?'#1A374D':'#fff'
        }}> {user.code} </td>
        <td> {user.fullNameInEnglish} </td>
        
        <td style={{padding:'0'}}>
            <div className={style.members__photo}>
            <img src={`/api/files/${user.avatar}`} alt={user.fullNameInEnglish} />
            </div>
        </td>
        
        <td> {new Date(user.createdAt).toLocaleDateString('en-US', dateFormat)} </td>
        
        <td style={{padding:'0'}}>
            <div className={style.members__code}>
                <Badge bg={variant[user.colorCode.code].color}>
                    {variant[user.colorCode.code].text}
                </Badge>
            </div>
        </td>
        
        <td style={{padding:0}}>
            <div className={style.members__actions}>
            <span onClick={() => navigate(`/member/${user._id}`)}> <Edit/> </span>
            {
                isDeleting 
                ? <Loader size='4' options={{animation:'border'}}/>
                : <span onClick={() => initiateUserDelete(user._id)}> <Trash/> </span>
            }
            </div>
        </td>

    </tr>
  </>;
};

export default Row;
