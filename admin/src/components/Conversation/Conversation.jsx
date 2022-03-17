import React, {useRef, useState, useEffect} from 'react'
import style from './style.module.scss'
import Scrollbar from 'simplebar-react'
import {v4} from 'uuid'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ObjectId from 'bson-objectid'
import {ChatMessage, Loader, ChatRoomUpdate} from '../../components'
import {Microphone, ArrowLeft,Users} from '../../icons'
import constants from '../../constants'
import Upload from './Upload'
import Emoji from './Emoji'
import i18next from 'i18next'

const Chat = ({socket}) => {
  const scrollRef = useRef(null)
  // const [messages, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [isEmoji, setIsEmoji] = useState(false)
  const [message, setMessage] = useState('')
  const [isFile, setIsFile]  = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recorder, setRecorder] = useState(null)
  const [isRoomUpdate, setIsRoomUpdate] = useState(false)
  const textAreaRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {loading, error, conversation} = useSelector(state => state.listMessages)
  const {staff} = useSelector(state => state.login)
  const lang = i18next.language
  const {t} = useTranslation()
  
  
  const saveMessageToConversation = message => {
    const copiedConversation = JSON.parse(JSON.stringify(conversation)) 
    copiedConversation.messages = [...copiedConversation.messages, message]
    dispatch({type:constants.chat.LIST_CONVERSATION_MESSAGES_SUCCESS, payload:copiedConversation})
    setMessage('')
    setIsEmoji(false)
  }
  
  const composeMessage = (type, content) => {
    const message = {
      _id:ObjectId().toHexString(), 
      content,
      type,
      sender:{
         _id:staff._id,
        fullNameInEnglish:staff.fullNameInEnglish,
        fullNameInArabic:staff.fullNameInArabic,
      },
      createdAt:new Date(),
      conversation:conversation.metadata.conversation,
      isRoom:conversation.metadata.isRoom,
      isNew:true
    }
    saveMessageToConversation(message)
    // setMessages([...messages, value])
    // setMessage('')
    // setIsEmoji(false)
  }
  
  

  const addEmojiHandler = emoji => {
    setMessage(prev => prev + emoji)
  }

  const sendMessageHandler = e => {
    if((e.keyCode === 13 || e.which === 13) && !e.shiftKey) {
      
      e.preventDefault()
      
      if(message === '') {
        composeMessage('error', t('cant-sent-empty-message'))
        return
      }
      
      composeMessage('text', message)
    }
  }

  const uploadImageHandler = e => {
      const file = e.target.files[0] 
      composeMessage('image',file)
      setIsFile(false)
  }

  const uploadDocumentHandler = e => {
    const file = e.target.files[0]   
    composeMessage('file',file)
    setIsFile(false)
  }

    const messagePosition = sender => {
      let position = null 
      if(lang === 'ar') {
       position =  sender === staff._id ? 'start' : 'end'
      }else {
        position =  sender === staff._id ? 'end' : 'start'
      }
      
      return position
    }

  const recordAudio = _ => {
    if(isRecording) {
      setIsRecording(false)
      recorder.stop()
      return
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      setIsRecording(true)
      const mediaRecorder = new MediaRecorder(stream);
      setRecorder(mediaRecorder)
      mediaRecorder.start();
      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, {'type': 'audio/mp3'});
        composeMessage('audio', audioBlob)
        setIsRecording(false)
      });

      setTimeout(() => {
        mediaRecorder.stop();
      }, 30000);
    });
  }

  const clearChat = _ => {
    dispatch({type:constants.chat.LIST_CONVERSATION_MESSAGES_RESET})
    navigate('/chat')
  }

  useEffect(() => {
    socket.on('getMessage', (message) => {
      setArrivalMessage({
         _id:ObjectId().toHexString(),
         isReceived:true,
         ...message
      })
    })
  },[])

  // useEffect(() => {
  //   if(conversation) {
  //     setMessages(conversation.messages)
  //   }
  // },[conversation, socket])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior:'smooth'})
  },[conversation])


  useEffect(() => {
    if(arrivalMessage 
      && arrivalMessage?.conversation === conversation?.metadata.conversation) {
        saveMessageToConversation(arrivalMessage)
    }
  },[arrivalMessage])


  
  return (
    <div className={`${style.chat} ${conversation ? style.chat__on :''}`}>
        
        {conversation 
        && conversation.metadata.isRoom 
        && <ChatRoomUpdate
        isRoomUpdate={isRoomUpdate}
        setIsRoomUpdate={setIsRoomUpdate}
        chatData={conversation.metadata}
        />}
        
        <header>
            <span onClick={clearChat}> <ArrowLeft/> </span>
            <figure style={{
              marginRight:lang === 'ar' ? 'unset' : '1rem',
              marginLeft:lang === 'ar' ? '1rem' : 'unset'
            }}>
             {conversation &&  <img src={`/api/files/${conversation.metadata.image}`} alt="chat" />}
            </figure>
            <div style={{
              marginRight:lang === 'ar' ?  'unset':'auto',
              marginLeft:lang === 'en' ?  'unset':'auto',
              }}>
              {conversation && <h3> {conversation.metadata.name} </h3>}  
                {/* <p>{t('last-seen', {date:'Fri 4 Sep 2022'})}</p> */}
            </div>
            {
              conversation 
              && conversation.metadata.isRoom 
              && (
                <p  onClick={() => setIsRoomUpdate(true)}
                    style={{marginRight:'2rem', cursor:'pointer', color:'darkgreen'}}>
                    <Users width='2.2rem' height='2.2rem'/>
                </p> 
              ) 
            }
        </header>
        <Scrollbar style={{
          height:(conversation || loading) ? '75%' : '90%', 
          backgroundColor:'#efeae2'
          }}>
            <div className={style.chat__messages}>
                {
                 
                 loading 
                ? (
                  <div className={style.chat__loading}> 
                    <Loader size='4' options={{animation:'border'}}/> 
                  </div>
                ) 
                : error 
                ?(
                  <ChatMessage
                    key={v4()}
                    content={error}
                    type='error'
                   />
                )
                : 
                conversation && conversation.messages.map((message, idx) => (  
                    <div key={message._id} 
                    ref={idx === conversation.messages.length - 1 ? scrollRef : null} 
                    style={{alignSelf: messagePosition(message.sender._id) }}
                    >
                        <ChatMessage
                          message={message}
                          socket={socket}
                          receiver={conversation?.metadata._id}
                          customStyle={{ backgroundColor:  message.sender._id === staff._id ? '#bff4bf' :'#fff' }}
                        />
                    </div>
                  ))
                }
            </div>     
        </Scrollbar>
       {
        (conversation || loading) &&
         <div className={style.chat__input}>
            <Upload isFile={isFile} setIsFile={setIsFile}/>
            <Emoji isEmoji={isEmoji} setIsEmoji={setIsEmoji} addEmojiHandler={addEmojiHandler}/>
            
            <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            onKeyDown={sendMessageHandler}
            ref={textAreaRef}
            type="text" 
            placeholder={t('type-message')}></textarea>
            
            <div className={isRecording ? style.chat__recording : ''}>
              <span onClick={recordAudio}> <Microphone/> </span>
            </div>
            
            
            <input 
            onChange={uploadImageHandler} 
            accept=".png,.PNG,.jpg,.jpeg,.JPG" 
            id='image-upload' 
            type="file" 
            name='attachment' 
            style={{display:'none'}}/>
            <input 
            onChange={uploadDocumentHandler} 
            accept=".pdf,.doc,.docx,.pptx,.xlsx,.txt" 
            id='document-upload' 
            type="file" 
            name='attachment' 
            style={{display:'none'}}/>
          </div>
       }
    </div>
  )
}

export default Chat