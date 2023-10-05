// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.scss'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import i18next from 'i18next'
import {
  headerClasses,
  headerIconClasses,
  headerFlagClasses,
  headerMenuClasses,
} from './classes'
import { MenuBars, Bell, Chat } from '@/src/icons'
import {
  Loader,
  SideNavbar,
  NotificationContainer,
  ActivityTrack,
} from '@/src/components'
import actions from '@/src/actions'
import constants from '@/src/constants'

const Header = () => {
  const [langDropDown, setLangDropDown] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [showSideMenu, setSideMenu] = useState(false)
  const [toggleNotification, setToggleNotification] = useState(false)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const headerBgRef = useRef(null)
  const sideMenuRef = useRef(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.isAuth)
  const { chatClient } = useSelector((state) => state.chatOptions)
  const { unreadCount } = useSelector((state) => state.unreadCount)
  const { notifications: pushNotifications } = useSelector(
    (state) => state.pushNotifications
  )
  const { nonRead } = useSelector((state) => state.listNotifications)
  const language = i18next.language
  const navigate = useNavigate()
  const page = useLocation().pathname

  const {
    loading: notify_loading,
    error: notify_error,
    notifications,
  } = useSelector((state) => state.listNotifications)

  const toggleNotifyData = (type) => {
    if (type === 'notification') {
      if (page !== '/notifications') {
        setToggleNotification((prev) => !prev)
        !toggleNotification &&
          dispatch(actions.notifications.listNotification())
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

    return () => clearTimeout(initNotifications)
  }, [page])

  useEffect(() => {
    language === 'ar'
      ? document.body.classList.add('arabic-language')
      : document.body.classList.remove('arabic-language')
  }, [language])

  useEffect(() => {
    ;(nonRead || nonRead === 0) && setNotificationsCount(nonRead)
  }, [nonRead])

  useEffect(() => {
    if (chatClient) {
      chatClient.on((event) => {
        if (event.type === 'message.new') {
          dispatch({
            type: constants.chat.GET_UNREAD_COUNT,
            payload: event.unread_count,
          })
        }
      })
    }
  }, [chatClient])

  return (
    <>
      {process.env.NODE_ENV == 'production' && (
        <ActivityTrack setSideMenu={setSideMenu} />
      )}
      <div
        className={style.header__bg}
        ref={headerBgRef}
        style={{ display: showSideMenu ? 'block' : 'none' }}
      ></div>

      <div className={headerClasses}>
        <div className='container'>
          <div className={style.header__wrapper}>
            {/* display the main icon */}
            <div className={headerIconClasses}>
              <span onClick={() => navigate('/')}>
                <img src='/images/logo.svg' alt='logo' />
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
                  className={headerFlagClasses}
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
                  className={headerMenuClasses}
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

                <span onClick={() => navigate('/chat')}>
                  {unreadCount > 0 && (
                    <span className={style.header__notify_num}>
                      {unreadCount}
                    </span>
                  )}
                  <Chat />
                </span>

                <span>
                  <img
                    src={
                      user.avatar
                        ? `/api/files/${user.avatar}`
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
