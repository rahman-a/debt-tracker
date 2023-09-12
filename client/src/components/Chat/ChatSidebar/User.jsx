/* eslint-disable react/prop-types */
import style from './style.module.scss'
import { useDispatch } from 'react-redux'
import i18next from 'i18next'
import chatImage from '@/src/asset/images/chat.png'
import constants from '@/src/constants'
const User = ({ user, onClick }) => {
  const dispatch = useDispatch()
  const lang = i18next.language
  const initiateChannel = () => {
    dispatch({ type: constants.chat.SET_PEER_ID, payload: user._id })
    const timeout = setTimeout(() => {
      onClick && onClick()
      clearTimeout(timeout)
    }, 1000)
  }
  return (
    <div className={style.sidebar__body_chat} onClick={() => initiateChannel()}>
      <figure>
        <img
          src={user?.avatar ? `/api/files/${user.avatar}` : chatImage}
          alt='chat'
        />
      </figure>
      <div className={style.sidebar__body_overview}>
        <h3>
          {/* group or member name */}
          <span>
            {lang === 'en' ? user?.fullNameInEnglish : user?.fullNameInArabic}
          </span>
        </h3>
      </div>
    </div>
  )
}

export default User
