import React, {useRef, useState, useEffect} from 'react'
import style from './style.module.scss'
import Scrollbar from 'simplebar-react'
import {v4} from 'uuid'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ObjectId from 'bson-objectid'
import {ChatMessage, Loader} from '../../components'
import {Microphone, ArrowLeft, PaperPlane} from '../../icons'
import constants from '../../constants'
import Upload from './Upload'
import Emoji from './Emoji'
import i18next from 'i18next'

const Chat = ({socket, setUnSeenMessage}) => {
  const scrollRef = useRef(null)
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [isEmoji, setIsEmoji] = useState(false)
  const [message, setMessage] = useState('')
  const [isFile, setIsFile]  = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recorder, setRecorder] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const textAreaRef = useRef(null)
  const {id} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {conversations:chat}  = useSelector(state => state.listConversations)
  const {loading, error, conversation} = useSelector(state => state.listMessages)
  const {user} = useSelector(state => state.login)
  const lang = i18next.language
  const {t} = useTranslation()
  
  
  const checkConversationIsActive = message => {
    let copiedConversations = chat ? JSON.parse(JSON.stringify(chat)) : []
    const isFound = copiedConversations.find(conversation => conversation._id === message.conversation) 
    
    if(!isFound) {
        const newlyCreatedConversation = {
          _id:message.conversation,
          isRoom:false,
          lastMessage:message,
          members:[
            message.sender,
            {
              _id:user._id,
              fullNameInEnglish:user.fullNameInEnglish,
              fullNameInArabic:user.fullNameInArabic,
              avatar:user.avatar
            }
          ],
          createdAt:message.createdAt
        }
        copiedConversations = [newlyCreatedConversation, ...copiedConversations]
        dispatch({type:constants.chat.LIST_CONVERSATION_SUCCESS, payload:copiedConversations})
    }
  }
  
  const updateLastMessage = message => {
      const copiedConversations = chat ? JSON.parse(JSON.stringify(chat)) : []
      copiedConversations.forEach(conversation => {
          if(conversation._id === message.conversation) {
              conversation.lastMessage = message
          }
      })
      dispatch({type:constants.chat.LIST_CONVERSATION_SUCCESS, payload:copiedConversations})
  
      if(id !== message.conversation) {
        
        setUnSeenMessage(message.conversation)
      }
  }
  
  
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
         _id:user._id,
        fullNameInEnglish:user.fullNameInEnglish,
        fullNameInArabic:user.fullNameInArabic,
        avatar:user.avatar
      },
      createdAt:new Date(),
      conversation:conversation.metadata.conversation,
      isRoom:conversation.metadata.isRoom,
      isNew:true
    }
    saveMessageToConversation(message)
  }
  
  

  const addEmojiHandler = emoji => {
    setMessage(prev => prev + emoji)
  }
  
  const sendMessage = () => {
    if(message === '') {
      composeMessage('error', t('cant-sent-empty-message'))
      return
    }
    
    composeMessage('text', message)

    setIsTyping(false)
  }

  const sendMessageHandler = e => {
    if((e.keyCode === 13 || e.which === 13) && !e.shiftKey) {
      
      e.preventDefault()
      
      if(message === '') {
        composeMessage('error', t('cant-sent-empty-message'))
        return
      }

      composeMessage('text', message)
      
      setIsTyping(false)
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
       position =  sender === user._id ? 'start' : 'end'
      }else {
        position =  sender === user._id ? 'end' : 'start'
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
    if(message !== '') {
      setIsTyping(true)
    }else {
      setIsTyping(false)
    }
  },[message])

  useEffect(() => {
    socket.on('getMessage', (message) => {
      setArrivalMessage({
         _id:ObjectId().toHexString(),
         isReceived:true,
         ...message
      })
    })
  },[])


  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior:'smooth'})
  },[conversation])


  useEffect(() => {
    if(arrivalMessage) {
      updateLastMessage(arrivalMessage)
      if(arrivalMessage?.conversation === conversation?.metadata.conversation) {
        saveMessageToConversation(arrivalMessage)
      }else {
        // sidebar by default contains all active conversation but
        // when other peer create conversation with user, the conversation doesn't show up
        // immediately in user sidebar, so we check with every coming message if conversation 
        // in user sidebar or not and if not create it and push it to user active conversation
        checkConversationIsActive(arrivalMessage)
      }
    }
  },[arrivalMessage])


  
  return (
    <div className={`${style.chat} ${conversation ? style.chat__on :''}`}>
        
        <header>
            <span 
              onClick={clearChat}
              style={{
                transform:lang === 'ar' ? 'rotate(180deg)' : 'unset',
                marginLeft:lang === 'ar' ? '1rem' : 'unset'
              }}
            > <ArrowLeft/> </span>
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
                          customStyle={{ backgroundColor:  message.sender._id === user._id ? '#bff4bf' :'#fff' }}
                        />
                    </div>
                  ))
                }
            </div>     
        </Scrollbar>
       {
        ((conversation && !conversation.metadata.isDeleted) || loading) ?
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
              {
                isTyping 
                ? <span onClick={sendMessage}> <PaperPlane/> </span>
                : <span onClick={recordAudio}> <Microphone/> </span>
              }

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
          : ((conversation && conversation.metadata.isDeleted))
          && <div className={style.chat__deleted}> 
              {t('chat_closed')}
            </div>
       }
    </div>
  )
}

export default Chat