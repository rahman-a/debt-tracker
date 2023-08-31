import { Attachment } from 'stream-chat-react'
import CustomAudioAttachment from './CustomAudioAttachment'

const CustomAttachment = (props) => {
  return <Attachment {...props} Audio={CustomAudioAttachment} />
}

export default CustomAttachment
