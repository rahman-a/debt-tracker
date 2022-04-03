import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import style from './style.module.scss'
import AudioFile from '../Audio/Audio'
import constants from '../../constants'
import {Check, DoubleCheck} from '../../icons'
import {saveMessageToDatabase, markMessageAsReceived} from './messageAPI'
import i18next from 'i18next'

let isFetched = false

const Message = ({
    message,
    socket,
    receiver,
    customStyle,
}) => {
  const [isMessageSent, setIsMessageSent] = useState(false)
  const [isMessageDelivered, setIsMessageDelivered] = useState(false)
  const [error, setError] = useState(null)
  const [fileSrc, setFileSrc] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [audioURL, setAudioURL] = useState(null)
  const {conversations}  = useSelector(state => state.listConversations)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const lang = i18next.language
    
  const updateLastMessage = message => {
    const copiedConversations = JSON.parse(JSON.stringify(conversations)) 
    copiedConversations.forEach(conversation => {
        if(conversation._id === message.conversation) {
            conversation.lastMessage = message
        }
    })
    dispatch({type:constants.chat.LIST_CONVERSATION_SUCCESS, payload:copiedConversations})
  }
  
  
  const saveMessage = async (type, content) => {
   try {
        let response;    
        if(type === 'text') {
            
            response  = await saveMessageToDatabase(message.conversation, {type, content})
        }else {
            const data = new FormData()
            data.append('type', type)
            data.append('file', content)
            response  = await saveMessageToDatabase(message.conversation,data)
        }

        if(response) {
            setIsMessageSent(true);
            // update last message in sidebar conversation
            updateLastMessage(response.message)
        } 
        
        socket.emit('sendMessage', {
            type, 
            content:response.message.content, 
            conversation:message.conversation,
            sender:message.sender,
            receiver,
            isRoom:message.isRoom,
            createdAt:new Date()
        }, async () => {
            await markMessageAsReceived(response.message._id)
            setIsMessageDelivered(true)
        })

   } catch (error) {
      
   }
  }
  
  
  const fileMetadata = file => {
      const fileString = file.name ? file.name : file
      const splitFileName =fileString.split('.')
      const name = file.name ? file.name : splitFileName[0]
      const extension = splitFileName[splitFileName.length - 1] 
      const fileTypes = {
          xlsx:'excel.png',
          pdf:'pdf.png',
          pptx:'powerpoint.png',
          docx:'word.png',
          txt:'text.png'
      }

      const type = fileTypes[extension]

      return {name, extension, type}
   }
  
  
  const parseFileObject =  _ => {
    
    const data = fileMetadata(message.content)
    
    const NOT_SUPPORTED = message.type === 'file' 
    ? t('document-not-supported') 
    : t('image-not-supported')
    
    const CORRUPTED = message.type === 'file' 
    ? t('document-corrupted')
    : t('image-corrupted')

    const allowedExtension = message.type === 'file' 
    ? ['xlsx', 'pdf', 'docx', 'pptx']
    : ['jpg', 'JPG', 'jpeg', 'png','PNG']

    if(!allowedExtension.includes(data.extension)) {
      setError(NOT_SUPPORTED)
      return
    }
    
    const url = URL.createObjectURL(message.content)
    if(!url) {
      setError(CORRUPTED)
      return
    }
    
    setFileName(data.name)
    setFileType(data.type)
    setFileSrc(url)

    saveMessage(message.type, message.content)
  }
    
  
    const parseContent = _ => {
    
        if(message.type === 'text' && message.isNew) {
            
           saveMessage(message.type, message.content)
        }
    
    
        if(message.type === 'image' || message.type === 'file') {
            if(typeof message.content === 'string') {
                
                const data = fileMetadata(message.content)
                
                setFileName(data.name)
                setFileType(data.type)
                setFileSrc(`/api/files/${message.content}`)
            
            } else {
                
                parseFileObject()
            }

        }

        if(message.type === 'audio') {
            
            if(typeof message.content === 'string') {
                
                setAudioURL(`/api/files/${message.content}`)
            
            } else {
                
                const audioUrl = URL.createObjectURL(message.content);
                setAudioURL(audioUrl)
                saveMessage(message.type, message.content)
            }

        }
    }
    
  
  
    const errorStyle = _ => {
      if(error) {
          return {
            maxWidth:'unset',
            width: '100%',
            backgroundColor:'unset',
            margin: 0,
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
      } else return {}
    }

    
    
    
    const errorParagraphStyle =  _ =>{
        if(error) {
                return {
                    color: 'rgb(255 33 33)',
                    backgroundColor: '#ffeeee',
                    padding: '0.3rem',
                    borderRadius: '0.2rem'
                }
        } else return {}
    }


    const textMessage = (
        <p> {message?.content} </p>
    )

    const errorMessage = (
        <p style={errorParagraphStyle()}> {error} </p>
    )

    const imageMessage = (
        <figure style={{width:'10rem'}}> 
            <img src={fileSrc} alt="avatar"  style={{width:'100%', objectFit:'cover'}}/>
            <p style={{overflow:'hidden'}}>
                {fileName}
            </p> 
        </figure>
    )

    const fileMessage = (
        <figure style={{width:'10rem'}}> 
            <img src={`/images/placeholder/${fileType}`} alt="files"  style={{width:'100%', objectFit:'cover'}}/> 
            <p style={{overflow:'hidden'}}> {fileName} </p>
        </figure>
    )

    const downloadAsset = _ => {
        if(message.type === 'image' || message.type === 'file') {

            const anchor = document.createElement('a')
            anchor.href = fileSrc 
            anchor.target = '_blank'
            anchor.click()
        }
    }

    useEffect(() => {
        if(!isFetched) {
            
            message.type === 'error' 
            ? setError(message.content) 
            : parseContent()
        }
        return () =>  isFetched = true
    },[message.type])

    useEffect(() => {
        message.isSent && setIsMessageSent(true)
        message.isReceived && setIsMessageDelivered(true)
    },[message.isSent, message.isReceived])

    useEffect(() => {
        isFetched = false
    },[])
    
return (
    <div 
    className={style.message} 
    style={{...customStyle, ...errorStyle()}} 
    onClick={downloadAsset}>
       {!error && <p style={{fontSize:'1rem', fontWeight:'600', color:'#1a374d'}}> 
            { lang === 'ar' ? message.sender.fullNameInArabic : message.sender.fullNameInEnglish}
        </p> }
        {
            error
            ? errorMessage
            : message.type === 'text'
            ? textMessage
            : message.type === 'image' && fileName && fileSrc
            ?  imageMessage
            : message.type === 'file' && fileName && fileType
            ? fileMessage
            : message.type === 'audio' && audioURL
            && <AudioFile url={audioURL}/>
        }
        {
           !error
            && 
            <p style={{color:'#8f8f8f'}}>
                <span> {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} </span>
                <span style={{color:isMessageDelivered && 'green'}}>
                    {
                        isMessageSent || isMessageDelivered
                        ? <DoubleCheck/> 
                        : <Check/>
                    }
                    
                </span>
            </p>
        }
    </div>
  )
}

export default Message