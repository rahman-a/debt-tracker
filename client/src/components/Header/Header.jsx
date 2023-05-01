import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.scss'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { MenuBars, Bell, Envelope, ChatSupport } from '../../icons'
import {
  Loader,
  SideNavbar,
  NotificationContainer,
  PushNotification,
  ActivityTrack,
  ModeSwitch,
} from '../../components'
import actions from '../../actions'
import classes from './classes'

const Header = () => {
  const [langDropDown, setLangDropDown] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [showSideMenu, setSideMenu] = useState(false)
  const [toggleNotification, setToggleNotification] = useState(false)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [messagesCount, setMessagesCount] = useState(0)
  const [toggleMessages, setToggleMessages] = useState(false)
  const headerBgRef = useRef(null)
  const sideMenuRef = useRef(null)
  const dispatch = useDispatch()
  const { notifications: pushNotifications } = useSelector(
    (state) => state.pushNotifications
  )
  const { nonRead } = useSelector((state) => state.listNotifications)
  const {
    loading: latest_loading,
    error: latest_error,
    count,
    messages,
  } = useSelector((state) => state.latestMessages)
  const { loading: support_loading, conversation } = useSelector(
    (state) => state.support
  )
  const language = i18next.language
  const { t } = useTranslation()
  const navigate = useNavigate()
  const page = useLocation().pathname

  const {
    loading: notify_loading,
    error: notify_error,
    notifications,
  } = useSelector((state) => state.listNotifications)
  const avatar = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).avatar
    : null

  const toggleNotifyData = (type) => {
    if (type === 'notification') {
      if (page !== '/notifications') {
        setToggleNotification((prev) => !prev)
        !toggleNotification &&
          dispatch(actions.notifications.listNotification())
      }
    } else if (type === 'messages') {
      if (page !== '/chat') {
        setToggleMessages((prev) => !prev)
        !toggleMessages && dispatch(actions.chat.latestMessages())
      }
    }
  }

  const changeLanguageHandler = (e, lang) => {
    e.stopPropagation()
    setLoadingState(true)
    const changeLanguage = setTimeout(() => {
      dispatch({ type: 'CHANGE_LANGUAGE_HANDLER', payload: lang })
      i18next.changeLanguage(lang)
      setLangDropDown((prev) => !prev)
      setLoadingState(false)
      clearTimeout(changeLanguage)
    }, 500)
  }

  const toggleSideMenuHandler = (e) => {
    e.stopPropagation()
    if (!showSideMenu) {
      document.body.style.height = '100%'
      document.body.style.overflow = 'hidden'
      setSideMenu(true)
    } else {
      document.body.style.height = null
      document.body.style.overflow = null
      setSideMenu(false)
    }
  }

  const showLanguageHandler = (e) => {
    e.stopPropagation()
    setLangDropDown((prev) => !prev)
  }

  const createSupportGroup = (_) => {
    dispatch(actions.chat.createSupportGroup())
  }

  window.addEventListener('click', () => {
    setLangDropDown(false)
    setSideMenu(false)
    document.body.style.height = null
    document.body.style.overflow = null
  })

  useEffect(() => {
    let intervalNotificationsRequest
    if (pushNotifications) {
      intervalNotificationsRequest = setTimeout(() => {
        dispatch(actions.notifications.pushNotification())
      }, 1000 * 30)
    }
    return () => clearTimeout(intervalNotificationsRequest)
  }, [pushNotifications])

  useEffect(() => {
    const initNotifications = setTimeout(() => {
      dispatch(actions.notifications.pushNotification())
    }, 5000)
    !nonRead && dispatch(actions.notifications.listNotification())
    !count && dispatch(actions.chat.latestMessages())

    return () => clearTimeout(initNotifications)
  }, [page])

  useEffect(() => {
    language === 'ar'
      ? document.body.classList.add('arabic-language')
      : document.body.classList.remove('arabic-language')
  }, [language])

  useEffect(() => {
    conversation && navigate(`/chat/${conversation}`)
  }, [conversation])

  useEffect(() => {
    ;(nonRead || nonRead === 0) && setNotificationsCount(nonRead)
  }, [nonRead])

  useEffect(() => {
    ;(count || count === 0) && setMessagesCount(count)
  }, [count])

  return (
    <>
      {pushNotifications &&
        pushNotifications.length > 0 &&
        pushNotifications.map((notification, idx) => (
          <PushNotification
            key={notification._id}
            idx={idx}
            data={notification}
          />
        ))}
      {/* {<ActivityTrack setSideMenu={setSideMenu} />} */}
      <div
        className={style.header__bg}
        ref={headerBgRef}
        style={{ display: showSideMenu ? 'block' : 'none' }}
      ></div>

      <div
        className={classes.header(language)}
        style={{
          backgroundColor: '#1A374D',
        }}
      >
        <div className='container'>
          <div className={style.header__wrapper}>
            {/* display the main icon */}
            <div className={classes.icon(language)}>
              <span onClick={() => navigate('/')}>
                <img src='/images/swtle.png' alt='logo' />
              </span>
              <span
                className={style.header__bars}
                onClick={toggleSideMenuHandler}
              >
                <MenuBars />
              </span>
            </div>

            {/* display side menu */}
            <SideNavbar
              changeLanguageHandler={changeLanguageHandler}
              loadingState={loadingState}
              showSideMenu={showSideMenu}
              setSideMenu={setSideMenu}
              sideMenuRef={sideMenuRef}
            />
            {/* display the actions buttons */}
            <div className={style.header__actions}>
              {/* Appearance Mode Switch */}
              {/* display the main languages */}
              <div className={style.header__language}>
                {/* display the other main language */}
                <div
                  className={classes.flag(language)}
                  onClick={showLanguageHandler}
                >
                  {language === 'ar' ? (
                    <img src='/images/uae-flag.png' alt='uae flag' />
                  ) : (
                    <img src='/images/usa-flag.jpg' alt='usa flag' />
                  )}
                </div>

                {/* the dropdown to select the language */}
                <div
                  className={classes.menu(language)}
                  style={{ display: langDropDown ? 'block' : 'none' }}
                >
                  {loadingState && (
                    <div
                      className={style.header__language_loader}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Loader
                        center
                        size='4'
                        options={{ animation: 'border' }}
                      />
                    </div>
                  )}
                  <figure onClick={(e) => changeLanguageHandler(e, 'ar')}>
                    <img src='/images/uae-flag.png' alt='uae flag' />
                    <p>العربية</p>
                  </figure>
                  <figure onClick={(e) => changeLanguageHandler(e, 'en')}>
                    <img src='/images/usa-flag.jpg' alt='usa flag' />
                    <p>English</p>
                  </figure>
                </div>
              </div>
              {/* display the messages and notifications */}
              <div className={style.header__notify}>
                <div className={style.header__notify_list}></div>
                <span onClick={() => toggleNotifyData('notification')}>
                  {notificationsCount > 0 && (
                    <span className={style.header__notify_num}>
                      {notificationsCount < 100 ? notificationsCount : `99+`}
                    </span>
                  )}
                  <Bell />
                </span>

                <span onClick={() => toggleNotifyData('messages')}>
                  {messagesCount > 0 && (
                    <span className={style.header__notify_num}>
                      {messagesCount}
                    </span>
                  )}
                  <Envelope />
                </span>

                <span>
                  <img
                    src={
                      avatar
                        ? `/api/files/${avatar}`
                        : '/images/photos/photo-1.png'
                    }
                    alt='personal avatar'
                  />
                </span>

                {/* Notification List */}
                {toggleNotification && (
                  <NotificationContainer
                    setToggleNotification={setToggleNotification}
                    title='Notification'
                    loading={notify_loading}
                    error={notify_error}
                    data={notifications}
                  />
                )}

                {/* Messages List */}
                {toggleMessages && (
                  <NotificationContainer
                    setToggleNotification={setToggleNotification}
                    setToggleMessages={setToggleMessages}
                    loading={latest_loading}
                    error={latest_error}
                    title='Messages'
                    data={messages}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={style.header__support}
        style={{ display: page.includes('chat') ? 'none' : 'block' }}
      >
        {support_loading ? (
          <Loader size='5' options={{ animation: 'border' }} />
        ) : (
          <span onClick={createSupportGroup}>
            <ChatSupport />
          </span>
        )}
      </div>
    </>
  )
}

export default Header
