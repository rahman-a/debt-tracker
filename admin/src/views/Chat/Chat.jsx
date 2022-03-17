import { useEffect, useState } from 'react';
import {io} from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux';
import style from './Chat.module.scss';
import {Conversation, ChatSidebar} from '../../components'
import constants from '../../constants';

const socket = io('http://localhost:5000')

function Chat() {
  const {staff} = useSelector(state => state.login)
  const {conversation} = useSelector(state => state.listMessages)
  const dispatch = useDispatch()
  useEffect(() => {

    socket.emit('join',staff._id, error => {
      if(error) alert(error)
    })
  
    return () => {
      console.log('USER LEFT ROOM!!!');
      socket.emit('left', staff._id);
      socket.off();
      dispatch({type:constants.chat.LIST_CONVERSATION_MESSAGES_RESET})
    }
  },[])

  useEffect(() => {
   conversation 
   && conversation.metadata.isRoom
   && socket.emit('join-room', 
   {
     _id:staff._id, 
     room:conversation.metadata.conversation
   }, 
   error => {
      if(error) alert(error)
    })
  },[conversation])

  return (
    <div className={style.chat}>
      <div className={style.chat__container}>
        <ChatSidebar socket={socket}/>
        <Conversation socket={socket}/>
      </div>
    </div>
  );
}

export default Chat;