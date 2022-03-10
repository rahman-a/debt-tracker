import React, {useRef, useState, useEffect} from 'react'
import style from './Conversation.module.scss'
import Scrollbar from 'simplebar-react'
import {v4} from 'uuid'
import {ChatMessage} from '../../components'
import {Microphone, ArrowLeft} from '../../icons'
import Upload from './Upload'
import Emoji from './Emoji'

const Chat = () => {
  const chatRef = useRef(null)
  const [isEmoji, setIsEmoji] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isFile, setIsFile]  = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recorder, setRecorder] = useState(null)
  const [chunks, setChunks] = useState([])
  const textAreaRef = useRef(null)
  
  const sendMessage = (type, content, options = {}) => {
      const value = {_id: v4(), type, content, ...options}
      setMessages([...messages, value])
      setMessage('')
      setIsEmoji(false)
  }
  
  const scroll = _ => {
    chatRef.current.scrollIntoView({
      behavior:'smooth'
    })
  }

  const addEmojiHandler = emoji => {
    setMessage(prev => prev + emoji)
  }

  const sendMessageHandler = e => {
    if((e.keyCode === 13 || e.which === 13) && !e.shiftKey) {
      
      e.preventDefault()
      
      if(message === '') {
        sendMessage('error', `you can't send empty message?!`)
        return
      }
      
      sendMessage('text', message)
    }
  }

  const uploadImageHandler = e => {
      const file = e.target.files[0] 
      const splitFileName = file.name.split('.')
      const extension = splitFileName[splitFileName.length - 1] 
      const allowedExtension = ['jpg', 'JPG', 'jpeg', 'png','PNG']
      if(!allowedExtension.includes(extension)) {
        sendMessage('error','image not supported, upload those extension jpg | png | jpeg')
        return
      }
      const url = URL.createObjectURL(file)
      if(!url) {
        sendMessage('error','image corrupted, upload another image')
        return
      }

      sendMessage('image', url, {fileName:file.name})
      setIsFile(false)
  }

  const uploadDocumentHandler = e => {
    const file = e.target.files[0] 
    const splitFileName = file.name.split('.')
    const extension = splitFileName[splitFileName.length - 1] 
    const allowedExtension = ['xlsx', 'pdf', 'docx', 'pptx']
    if(!allowedExtension.includes(extension)) {
      sendMessage('error','document not supported, upload those extension pdf | docx | xlsx | pptx')
      return
    }
    const url = URL.createObjectURL(file)
    if(!url) {
      sendMessage('error','document corrupted, upload another document')
      return
    }

    const fileTypes = {
      xlsx:'excel.png',
      pdf:'pdf.png',
      pptx:'powerpoint.png',
      docx:'word.png'
    }

    const fileType = fileTypes[extension]

    sendMessage('file', url, {fileType, fileName:file.name})
    setIsFile(false)
}




  const recordAudio = _ => {
    if(isRecording) {
      setIsRecording(false)
    }else {
      setIsRecording(true)
    }
    // navigator.mediaDevices.getUserMedia({ audio: true })
    // .then(stream => {
    //   const mediaRecorder = new MediaRecorder(stream);
    //   setRecorder(mediaRecorder)
    //   mediaRecorder.start();
    //   const audioChunks = [];
    //   mediaRecorder.addEventListener("dataavailable", event => {
    //     audioChunks.push(event.data);
    //   });

    //   mediaRecorder.addEventListener("stop", () => {
    //     const audioBlob = new Blob(audioChunks);
    //     const audioUrl = URL.createObjectURL(audioBlob);
    //     sendMessage('audio', audioUrl)
    //   });

      // setTimeout(() => {
      //   mediaRecorder.stop();
      //   setIsRecording(false)
      // }, 3000);
    // });
  }

  useEffect(() => {
    chatRef.current && scroll()
  },[messages, chatRef.current])
  
  return (
    <div className={style.chat}>
        <header>
            <span> <ArrowLeft/> </span>
            <figure>
              <img src="/images/photos/photo-2.jpg" alt="chat" />
            </figure>
            <div>
                <h3 onClick={scroll}> Ahmed Abdelrahman </h3>
                <p>last seen at Fri 4 Sep 2022</p>
            </div>
        </header>
        <Scrollbar style={{height:'75%', backgroundColor:'#efeae2'}}>
            <div className={style.chat__messages}>
                {
                  messages.map((message, idx) => (
                    <ChatMessage
                        key={message._id}
                        content={message.content}
                        type={message.type}
                        fileType={message.fileType}
                        fileName={message.fileName}
                        chatRef={idx === messages.length - 1 ? chatRef : null}
                        custom={{
                        backgroundColor: idx % 2 === 0 ? '#fff' : '#bff4bf' , 
                        alignSelf: idx % 2 === 0 ? 'start' : 'end'
                      }}
                  /> 
                  ))
                }
            </div>     
        </Scrollbar>
        <div className={style.chat__input}>
              <Upload isFile={isFile} setIsFile={setIsFile}/>
              <Emoji isEmoji={isEmoji} setIsEmoji={setIsEmoji} addEmojiHandler={addEmojiHandler}/>
              
              <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={sendMessageHandler}
              ref={textAreaRef}
              type="text" 
              placeholder='Type a message...'></textarea>
              
              <div className={isRecording ? style.chat__recording : ''}>
                <span onClick={recordAudio}> <Microphone/> </span>
              </div>
              
              
              <input onChange={uploadImageHandler} id='image-upload' type="file" name='attachment' style={{display:'none'}}/>
              <input onChange={uploadDocumentHandler} id='document-upload' type="file" name='attachment' style={{display:'none'}}/>
        
              
        
        </div>
    </div>
  )
}

export default Chat