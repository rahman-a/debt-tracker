import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.scss'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import i18next from 'i18next'
import { MenuBars, Bell, ChatHelp } from '../../icons'
import {
  Loader,
  SideNavbar,
  NotificationContainer,
  ActivityTrack,
} from '../../components'
import actions from '../../actions'
import {
  headerClasses,
  headerLanguageClasses,
  headerIconClasses,
  headerMenuClasses,
  headerCredentialClasses,
} from './classes'

const Header = () => {
  const [langDropDown, setLangDropDown] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [showSideMenu, setSideMenu] = useState(false)
  const [toggleNotification, setToggleNotification] = useState(false)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const headerBgRef = useRef(null)
  const sideMenuRef = useRef(null)
  const dispatch = useDispatch()
  const { isAuth, staff } = useSelector((state) => state.login)
  const { notifications: pushNotifications } = useSelector(
    (state) => state.pushNotifications
  )
  const navigate = useNavigate()
  const page = useLocation().pathname
  const language = i18next.language

  const {
    loading: notify_loading,
    error: notify_error,
    nonRead,
    notifications,
  } = useSelector((state) => state.listNotifications)

  const staffAvatar = staff?.avatar
    ? `/api/files/${staff.avatar}`
    : '/images/photos/photo-1.png'

  const languageFlag =
    language === 'en' ? (
      <img src='/images/usa-flag.jpg' alt='usa flag' />
    ) : (
      <img src='/images/uae-flag.png' alt='uae flag' />
    )

  const toggleNotifyData = () => {
    if (page !== '/notifications') {
      setToggleNotification((prev) => !prev)
      !toggleNotification && dispatch(actions.notifications.listNotification())
    }
  }

  const changeLanguageHandler = (e, lang) => {
    e.stopPropagation()
    setLoadingState(true)
    setTimeout(() => {
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
  }, [pushNotifications, dispatch])

  useEffect(() => {
    language === 'ar'
      ? document.body.classList.add('arabic-language')
      : document.body.classList.remove('arabic-language')
  }, [language])

  useEffect(() => {
    const initNotifications =
      isAuth &&
      setTimeout(() => {
        dispatch(actions.notifications.pushNotification())
      }, 5000)
    console.log('non Read: ', nonRead)
    !nonRead && dispatch(actions.notifications.listNotification())
    return () => clearTimeout(initNotifications)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isAuth])

  useEffect(() => {
    ;(nonRead || nonRead === 0) && setNotificationsCount(nonRead)
  }, [nonRead])

  return (
    <>
      {isAuth && process.env.NODE_ENV === 'production' && (
        <ActivityTrack setSideMenu={setSideMenu} />
      )}
      <div
        className={style.header__bg}
        ref={headerBgRef}
        style={{ display: showSideMenu ? 'block' : 'none' }}
      ></div>

      <div
        className={headerClasses}
        style={{ display: page === '/login' ? 'none' : 'block' }}
      >
        <div className='container'>
          <div className={style.header__wrapper}>
            {/* display the main icon */}
            <div className={headerIconClasses}>
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
                language={language}
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
              <div className={style.header__language}>
                {/* display the other main language */}
                <div
                  className={headerLanguageClasses}
                  onClick={showLanguageHandler}
                >
                  {languageFlag}
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

              {isAuth ? (
                //   display the messages and notifications
                <div className={style.header__notify}>
                  <div className={style.header__notify_list}></div>
                  <span onClick={() => toggleNotifyData()}>
                    {notificationsCount > 0 && (
                      <span className={style.header__notify_num}>
                        {notificationsCount < 100 ? notificationsCount : `99+`}
                      </span>
                    )}
                    <Bell width='2rem' height='2rem' />
                  </span>

                  <span>
                    {false && (
                      <span className={style.header__notify_num}>{10}</span>
                    )}
                    <ChatHelp width='2.5rem' height='2.5rem' />
                  </span>

                  <span>
                    <img src={staffAvatar} alt='personal avatar' />
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
              ) : (
                // display the credential buttons [login - sign up]
                <div className={headerCredentialClasses}>
                  <Link to='register'>Sign up</Link>
                  <Link to='login'>Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
