import React, {useState, useEffect, useRef} from 'react'
import style from './style.module.scss'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { HandDollar, MenuBars, Bell, Envelope } from '../../icons'
import { Loader,SideNavbar, NotificationContainer, PushNotification } from '../../components'
import actions from '../../actions'


const Header = () => {
    const [language, setLanguage] = useState('en')
    const [langDropDown, setLangDropDown] = useState(false)
    const [loadingState, setLoadingState] = useState(false)
    const [showSideMenu, setSideMenu] = useState(false)
    const [toggleNotification, setToggleNotification] = useState(false)
    const headerBgRef = useRef(null)
    const sideMenuRef = useRef(null)
    const dispatch = useDispatch()
    const {isAuth, staff} = useSelector(state => state.login)
    const {notifications: pushNotifications} = useSelector(state => state.pushNotifications)
    const {nonRead} = useSelector(state => state.listNotifications)
    const navigate = useNavigate()
    const page = useLocation().pathname

    const {
        loading:notify_loading, 
        error:notify_error, 
        notifications
    } = useSelector(state => state.listNotifications)
   
    const toggleNotifyData = type => {    
        if(type === 'notification'){
            if(page !== '/notifications') {
                setToggleNotification(prev => !prev)
                !toggleNotification && 
                dispatch(actions.notifications.listNotification())
            }
        }else {
            setToggleNotification(false)
        }
    }

    const changeLanguageHandler = (e, lang) => {
        e.stopPropagation()
        setLoadingState(true)
        setTimeout(() => {
            setLanguage(lang)
            setLangDropDown(prev => !prev)
            setLoadingState(false)
        },500)
    }

    const toggleSideMenuHandler = e => {
        e.stopPropagation()
        if(!showSideMenu) {
            document.body.style.height = '100%'
            document.body.style.overflow = 'hidden'
            setSideMenu(true)
        } else {
            document.body.style.height = 'unset'
            document.body.style.overflow = 'unset'
            setSideMenu(false)
        }
    }

    const showLanguageHandler = e => {
        e.stopPropagation()
        setLangDropDown(prev => !prev)
    }

    window.addEventListener('click', () => {
        setLangDropDown(false)
        setSideMenu(false)
        document.body.style.height = 'unset'
        document.body.style.overflow = 'unset'
    })

    // useEffect(() => {
    //     let intervalNotificationsRequest;
    //     if(pushNotifications) {
    //         intervalNotificationsRequest = setTimeout(() => {
    //           dispatch(actions.notifications.pushNotification())
    //          },1000 * 30)
    //     }
    //     return () => clearTimeout(intervalNotificationsRequest)
    // },[pushNotifications])

    // useEffect(() => {
        
    //     const initNotifications = isAuth && setTimeout(() => {
    //         dispatch(actions.notifications.pushNotification())      
    //     }, 5000);
        
    //     !nonRead && dispatch(actions.notifications.listNotification())
    
    //     return () => clearTimeout(initNotifications)
    // },[page, isAuth])

    return (
        <>
            
        {
            pushNotifications && pushNotifications.length > 0 &&
            pushNotifications.map(
            (notification, idx) => <PushNotification key={idx} idx={idx} data={notification}/>
            )
        }
            
            <div className={style.header__bg}
            ref={headerBgRef}
            style={{display: showSideMenu ? 'block' : 'none'}}></div>
            
            <div className={style.header}
            style={{ display:page === '/login' ?'none' :'block' }}>
               
                <div className="container">
                    <div className={style.header__wrapper}>
                        
                        {/* display the main icon */}
                        <div className={style.header__icon}>
                            <span onClick={() => navigate('/')}>
                                <HandDollar/>
                            </span>
                            
                            {isAuth && 
                            <span className={style.header__bars}
                            onClick={toggleSideMenuHandler}>
                                <MenuBars/>
                            </span>}
                        </div>
                        
                        {/* display side menu */}
                        {isAuth && 
                        <SideNavbar 
                        language={language}
                        changeLanguageHandler={changeLanguageHandler}
                        loadingState={loadingState}
                        showSideMenu={showSideMenu}
                        setSideMenu={setSideMenu}
                        sideMenuRef={sideMenuRef}
                       />}
                        
                        {/* display the actions buttons */}
                        <div className={style.header__actions}>
                            {/* display the main languages */}
                            <div className={style.header__language}>
                            {/* display the other main language */}
                            <div className={style.header__language_flag}
                            onClick={showLanguageHandler}>
                            {language === 'en' 
                            ? <img src="/images/usa-flag.jpg" alt="usa flag" />
                            : <img src="/images/uae-flag.png" alt="uae flag" />}
                            </div>
                            
                            {/* the dropdown to select the language */}
                            <div className={style.header__language_menu}
                            style={{display: langDropDown ? 'block' :'none'}}>
                                {loadingState && <div className={style.header__language_loader}
                                    onClick={(e) => e.stopPropagation()}>
                                    <Loader center size='4' 
                                    options={{animation:"border"}}/>
                                </div>}
                                <figure onClick={(e) => changeLanguageHandler(e, 'ar')}>
                                    <img src="/images/uae-flag.png" alt="uae flag" />
                                    <p>العربية</p>
                                </figure>
                                <figure onClick={(e) => changeLanguageHandler(e, 'en')}>
                                    <img src="/images/usa-flag.jpg" alt="usa flag" />
                                    <p>English</p>
                                </figure>
                            </div>
                            </div>
                            
                            
                            {isAuth 
                            ? //   display the messages and notifications  
                            <div className={style.header__notify}>

                                <div className={style.header__notify_list}></div>
                                <span onClick={() => toggleNotifyData('notification')}>
                                   {nonRead > 0
                                   && <span className={style.header__notify_num}>
                                        {nonRead}
                                    </span> }
                                    <Bell/>
                                </span>
                                {/* <span onClick={() => toggleNotifyData('messages')}>
                                    <span className={style.header__notify_num}>''</span>
                                    <Envelope/>
                                </span> */}
                                
                                {/* FOR TEST */}
                                <span>
                                    <Envelope/>
                                </span>
                                {/* FOR TEST */}

                                <span>
                                    <img src={
                                       staff && staff.avatar  
                                        ? `/api/files/${staff.avatar}`
                                        :"/images/photos/photo-1.png"
                                    } alt="personal avatar" />
                                </span>
                                
                                {/* Notification List */}
                                {toggleNotification 
                                && <NotificationContainer 
                                setToggleNotification={setToggleNotification}
                                title='Notification' 
                                loading={notify_loading}
                                error={notify_error}
                                data={notifications}/>}
                                
                                {/* Messages List */}
                                {/* {toggleMessages 
                                && <NotificationContainer 
                                setToggleNotification={setToggleNotification}
                                setToggleMessages={setToggleMessages}
                                title='Messages'
                                data={notifyData}/>} */}
                            </div>
                            
                            :// display the credential buttons [login - sign up] 
                            <div className={style.header__credential}>
                                <Link to='register'>Sign up</Link>
                                <Link to='login'>Login</Link>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
