import React, {useRef, useState, useEffect} from 'react'
import style from './Chat.module.scss'
import {Scrollbar} from 'react-scrollbars-custom'
import {v4} from 'uuid'
import {Message} from '../../components'
import {FaceSmile, Microphone, Paperclip, ArrowLeft, ImagePlaceholder, FilePlaceholder} from '../../icons'
import emoji from '../../emoji.json'

const Chat = () => {
  const chatRef = useRef(null)
  const [isEmoji, setIsEmoji] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isFile, setIsFile]  = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recorder, setRecorder] = useState(null)
  const [chunks, setChunks] = useState([])
  
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
    if(e.keyCode === 13 || e.which === 13) {
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
    setIsRecording(true)
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      setRecorder(mediaRecorder)
      mediaRecorder.start();
      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        sendMessage('audio', audioUrl)
      });

      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false)
      }, 3000);
    });
  }

  useEffect(() => {
    chatRef.current && scroll()
  },[messages, chatRef.current])
  
  return (
    <div className={style.chat}>
        <header>
            <span> <ArrowLeft/> </span>
            <figure>
              <img src="/avatar.jpg" alt="chat" />
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
                  <Message
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
            {
              isEmoji && 
              <ul className={style.chat__messages_emoji}>
                {
                  emoji.map(em => (
                    <li onClick={() => addEmojiHandler(em.char)} key={v4()}> {em.char} </li>
                  ))
                }
              </ul>
            }
            {
              isFile && 
              <div className={style.chat__messages_upload}>
                <label htmlFor='image-upload' title='upload image'>
                    <ImagePlaceholder/>
                </label>
                <label htmlFor='document-upload' title='upload file'>
                  <FilePlaceholder/>
                </label>
              </div>
            }
        </Scrollbar>
        <div className={style.chat__input}>
              <span onClick={() => setIsEmoji(prev => !prev)}> <FaceSmile/> </span>
              <span onClick={() => setIsFile(prev => !prev)}> <Paperclip/> </span>
              <input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={sendMessageHandler}
              type="text" 
              placeholder='Type a message...'/>
              
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