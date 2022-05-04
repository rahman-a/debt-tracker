import axios from "axios";
import i18next from "i18next";

axios.defaults.headers['Accept-Language'] = i18next.language
axios.defaults.headers['apikey'] = process.env.REACT_APP_API_KEY

export const saveMessageToDatabase = async (conversationId, message) => {
  const url = `/api/chat/${conversationId}/messages/new`
  const {data} = await axios.post(url, message)
  return data
}

export const markMessageAsReceived = async (messageId) => {
  const url = `/api/chat/messages/${messageId}`
  const {data} = await axios.patch(url)
  return data.success
}