import { StreamChat } from 'stream-chat'
import dotenv from 'dotenv'
dotenv.config()
const apiKey = process.env.STREAM_CHAT_API_KEY
const privateApiKey = process.env.STREAM_CHAT_PRIVATE_API_KEY
export const chatClient = StreamChat.getInstance(apiKey, privateApiKey)
