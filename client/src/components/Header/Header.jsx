import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.scss'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import i18next from 'i18next'
import { MenuBars, Bell, Envelope, Support, ChatSupport } from '../../icons'
import {
  Loader,
  SideNavbar,
  NotificationContainer,
  PushNotification,
} from '../../components'
import actions from '../../actions'
import { useTranslation } from 'react-i18next'

const Header = () => {
  const [langDropDown, setLangDropDown] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [navbarColor, setNavbarColor] = useState('rgba(26,55,77,0.7)')
  const [showSideMenu, setSideMenu] = useState(false)
  const [toggleNotification, setToggleNotification] = useState(false)
  const [toggleMessages, setToggleMessages] = useState(false)
  const headerBgRef = useRef(null)
  const sideMenuRef = useRef(null)
  const dispatch = useDispatch()
  const { isAuth } = useSelector((state) => state.login)
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
    setTimeout(() => {
      dispatch({ type: 'CHANGE_LANGUAGE_HANDLER', payload: lang })
      i18next.changeLanguage(lang)
      setLangDropDown((prev) => !prev)
      setLoadingState(false)
    }, 500)
  }

  const toggleSideMenuHandler = (e) => {
    e.stopPropagation()
    if (!showSideMenu) {
      document.body.style.height = '100%'
      document.body.style.overflow = 'hidden'
      setSideMenu(true)
    } else {
      document.body.style.height = 'unset'
      document.body.style.overflow = 'unset'
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
    document.body.style.height = 'unset'
    document.body.style.overflow = 'unset'
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
    const initNotifications =
      isAuth &&
      setTimeout(() => {
        dispatch(actions.notifications.pushNotification())
      }, 5000)
    !nonRead && dispatch(actions.notifications.listNotification())
    !count && dispatch(actions.chat.latestMessages())

    page === '/'
      ? setNavbarColor('rgba(26,55,77,0.7)')
      : setNavbarColor('#1A374D')

    page === '/login' && setSideMenu(false)

    return () => clearTimeout(initNotifications)
  }, [page, isAuth])

  useEffect(() => {
    language === 'ar'
      ? document.body.classList.add('arabic-language')
      : document.body.classList.remove('arabic-language')
  }, [language])

  useEffect(() => {
    conversation && navigate(`/chat/${conversation}`)
  }, [conversation])

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

      <div
        className={style.header__bg}
        ref={headerBgRef}
        style={{ display: showSideMenu ? 'block' : 'none' }}
      ></div>

      <div
        className={`${style.header} ${
          language === 'ar' ? style.header__ar : ''
        }`}
        style={{
          backgroundColor: navbarColor,
          display: page === '/login' || page === '/register' ? 'none' : 'block',
        }}
      >
        <div className='container'>
          <div className={style.header__wrapper}>
            {/* display the main icon */}
            <div
              className={`${style.header__icon} ${
                language === 'ar' ? style.header__icon_ar : ''
              }`}
            >
              <span onClick={() => navigate('/')}>
                <img src='/images/swtle.png' alt='logo' />
              </span>

              {isAuth && (
                <span
                  className={style.header__bars}
                  onClick={toggleSideMenuHandler}
                >
                  <MenuBars />
                </span>
              )}
            </div>

            {/* display side menu */}
            {isAuth && (
              <SideNavbar
                changeLanguageHandler={changeLanguageHandler}
                loadingState={loadingState}
                showSideMenu={showSideMenu}
                setSideMenu={setSideMenu}
                sideMenuRef={sideMenuRef}
              />
            )}

            {/* display the actions buttons */}
            <div className={style.header__actions}>
              {/* display the main languages */}
              <div
                className={`${style.header__language}
                            ${!isAuth ? style.header__language_show : ''}`}
              >
                {/* display the other main language */}
                <div
                  className={`${style.header__language_flag} 
                                ${
                                  language === 'ar'
                                    ? style.header__language_flag_ar
                                    : ''
                                }`}
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
                  className={`${style.header__language_menu} 
                                ${
                                  language === 'ar'
                                    ? style.header__language_menu_ar
                                    : ''
                                }`}
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

              {isAuth ? (
                //   display the messages and notifications
                <div className={style.header__notify}>
                  <div className={style.header__notify_list}></div>
                  <span onClick={() => toggleNotifyData('notification')}>
                    {nonRead > 0 && (
                      <span className={style.header__notify_num}>
                        {nonRead}
                        {/* {nonRead > 100 ? '99+' : nonRead} */}
                      </span>
                    )}
                    <Bell />
                  </span>

                  <span onClick={() => toggleNotifyData('messages')}>
                    {count > 0 && (
                      <span className={style.header__notify_num}>{count}</span>
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
              ) : (
                // display the credential buttons [login - sign up]
                <div
                  className={`${style.header__credential} ${
                    language === 'ar' ? style.header__credential_ar : ''
                  }`}
                >
                  <Link to='register'>{t('signup')}</Link>
                  <Link to='login'>{t('login')}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={style.header__support}
        style={{ display: page.includes('chat') || !isAuth ? 'none' : 'block' }}
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
