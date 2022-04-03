import {useState, useEffect} from 'react';
import {io} from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux';
import style from './Chat.module.scss';
import {ChatSidebar, Conversation} from '../../components'
import constants from '../../constants';

const socket = io('http://localhost:5003')

function Chat() {
  const [unSeenMessage, setUnSeenMessage] = useState(null)
  const {user} = useSelector(state => state.login)
  const {conversation} = useSelector(state => state.listMessages)
  const dispatch = useDispatch()
  
  useEffect(() => {

    socket.emit('join',user._id, error => {
      if(error) alert(error)
    })
  
    return () => {
      
      socket.emit('left', user._id);
      socket.off();
      dispatch({type:constants.chat.LIST_CONVERSATION_MESSAGES_RESET})
    }
  },[dispatch, user._id])

  useEffect(() => {
   conversation 
   && conversation.metadata.isRoom
   && socket.emit('join-room', 
   {
     _id:user._id, 
     room:conversation.metadata.conversation
   }, 
   error => {
      if(error) alert(error)
    })
  },[conversation, user._id])

  return (
    <div className={style.chat}>
      <div className={style.chat__container}>
        <ChatSidebar 
        socket={socket} 
        unSeenMessage={unSeenMessage}
        setUnSeenMessage={setUnSeenMessage}/>
        <Conversation socket={socket} setUnSeenMessage={setUnSeenMessage}/>
      </div>
    </div>
  );
}

export default Chat;