import { useEffect, useRef, useState } from 'react'
import { useChatContext } from 'stream-chat-react'
import TextareaAutosize from 'react-textarea-autosize'
import { useReactMediaRecorder } from 'react-media-recorder'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import style from './style.module.scss'
import Upload from './Upload'
import Emoji from './Emoji'
import { Microphone, PaperPlane } from '../../../icons'

const ChatInput = () => {
  const { channel } = useChatContext()
  const [isEmoji, setIsEmoji] = useState(false)
  const [message, setMessage] = useState('')
  const [isFile, setIsFile] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    onStop: (url, blob) => sendAudioHandler(blob),
  })
  const { t } = useTranslation()
  const trackRecording = useRef(null)
  const textAreaRef = useRef(null)

  const addEmojiHandler = (emoji) => {
    setMessage((prev) => prev + emoji)
  }

  const sendMessageOnKeydown = async (e) => {
    await channel.keystroke()
    if ((e.keyCode === 13 || e.which === 13) && !e.shiftKey) {
      e.preventDefault()
      sendMessageHandler()
      setMessage('')
    }
  }

  const sendAudioHandler = async (audioBlob) => {
    const fileResponse = await channel.sendFile(audioBlob)
    await channel.sendMessage({
      text: '',
      attachments: [
        {
          type: 'audio',
          asset_url: fileResponse.file,
          file_size: fileResponse.size,
        },
      ],
    })
  }

  const sendMessageHandler = async () => {
    const message = textAreaRef.current.value
    if (message === '') return
    await channel.sendMessage({
      text: message,
    })
    setMessage('')
    setIsTyping(false)
  }
  const recordAudio = () => {
    if (status === 'recording') {
      stopRecording()
      return
    }
    startRecording()
  }

  useEffect(() => {
    if (status === 'recording') {
      trackRecording.current = setInterval(() => {
        stopRecording()
      }, 15000)
    } else if (status === 'stopped') {
      clearInterval(trackRecording.current)
    }
    return () => {
      clearInterval(trackRecording.current)
    }
  }, [status])

  useEffect(() => {
    message ? setIsTyping(true) : setIsTyping(false)
  }, [message])
  return (
    <div className={style.input}>
      <Upload isFile={isFile} setIsFile={setIsFile} />
      <Emoji
        isEmoji={isEmoji}
        setIsEmoji={setIsEmoji}
        addEmojiHandler={addEmojiHandler}
      />

      <TextareaAutosize
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={sendMessageOnKeydown}
        ref={textAreaRef}
        type='text'
        onFocus={() => setIsEmoji(false)}
        placeholder={t('type-message')}
      />

      <div
        className={status === 'recording' ? style.input__recording : ''}
        style={{ position: 'relative', zIndex: '999' }}
      >
        {isTyping ? (
          <span onClick={sendMessageHandler}>
            <PaperPlane />
          </span>
        ) : (
          <span onClick={recordAudio}>
            <Microphone />
          </span>
        )}
      </div>
    </div>
  )
}

export default ChatInput
