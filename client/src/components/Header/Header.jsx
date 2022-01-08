import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import { HandDollar, MenuBars, Bell, Envelope } from '../../icons'
import { Loader,SideNavbar, NotificationContainer } from '../../components'
import {v4 as uuidv4} from 'uuid'

const notifyData = [
    {
        id:uuidv4(),
        text:'Lorem ipsum dolor sit amet',
        content:'labore et dolore magna aliquyam erat, sed diam voluptua',
    },
    {
        id:uuidv4(),
        text:'Lorem ipsum dolor sit amet',
        content:'labore et dolore magna aliquyam erat, sed diam voluptua',
    },
    {
        id:uuidv4(),
        text:'Lorem ipsum dolor sit amet',
        content:'labore et dolore magna aliquyam erat, sed diam voluptua',
    },
    {
        id:uuidv4(),
        text:'Lorem ipsum dolor sit amet',
        content:'labore et dolore magna aliquyam erat, sed diam voluptua',
    },
    {
        id:uuidv4(),
        text:'Lorem ipsum dolor sit amet',
        content:'labore et dolore magna aliquyam erat, sed diam voluptua',
    }
]


const Header = () => {
    const isAuth = true // for test
    const [language, setLanguage] = useState('en')
    const [langDropDown, setLangDropDown] = useState(false)
    const [loadingState, setLoadingState] = useState(false)
    const [navbarColor, setNavbarColor] = useState('rgba(26, 55, 77, 0.7)')
    const [showSideMenu, setSideMenu] = useState(false)
    const [toggleNotification, setToggleNotification] = useState(false)
    const [toggleMessages, setToggleMessages] = useState(false)
    
    const createAccountHandler = _ => {
        console.log('create account');
    }
    
    const loginHandler = _ => {
        console.log('login');
    }

    const toggleNotifyData = type => {
        
        if(type === 'notification'){
            setToggleMessages(false)
            setToggleNotification(prev => !prev)
        }else {
            setToggleNotification(false)
            setToggleMessages(prev => !prev)
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
        setSideMenu(prev => !prev)
    }

    const showLanguageHandler = e => {
        e.stopPropagation()
        setLangDropDown(prev => !prev)
    }

    window.addEventListener('click', () => {
        setLangDropDown(false)
        setSideMenu(false)
    })

    window.onscroll = () => {
        if(window.scrollY > 110) {
            isAuth 
            ?  setNavbarColor('#1A374D') 
            :  setNavbarColor('rgba(26, 55, 77, 0.9)')
        }else {
            isAuth 
            ? setNavbarColor('#1A374D') 
            : setNavbarColor('rgba(26, 55, 77, 0.7)')
            
        }
    }

    useEffect(() => {
        isAuth && setNavbarColor('#1A374D') 
    },[])
    return (
        <>
            <div className={style.header__bg}
            style={{display: showSideMenu ? 'block' : 'none'}}></div>
            
            <div className={style.header}
            style={{backgroundColor:navbarColor}}>
               
                <div className="container">
                    <div className={style.header__wrapper}>
                        
                        {/* display the main icon */}
                        <div className={style.header__icon}>
                            <span>
                                <HandDollar/>
                            </span>
                            <span className={style.header__bars}
                            onClick={toggleSideMenuHandler}>
                                <MenuBars/>
                            </span>
                        </div>
                        
                        {/* display side menu */}
                        <SideNavbar 
                        language={language}
                        changeLanguageHandler={changeLanguageHandler}
                        loadingState={loadingState}
                        showSideMenu={showSideMenu}/>
                        
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
                            
                            {/* display the credential buttons [login - sign up] */}
                            {/* <div className={style.header__credential}>
                                <button onClick={createAccountHandler}>Sign up</button>
                                <button onClick={loginHandler}>Login</button>
                            </div> */}
                            

                            {/* display the messages and notifications  */}
                            <div className={style.header__notify}>

                                <div className={style.header__notify_list}></div>
                                <span onClick={() => toggleNotifyData('notification')}>
                                    <span className={style.header__notify_num}>10</span>
                                    <Bell/>
                                </span>
                                <span onClick={() => toggleNotifyData('messages')}>
                                    <span className={style.header__notify_num}>4</span>
                                    <Envelope/>
                                </span>
                                <span>
                                    <img src="images/photos/photo-1.png" alt="personal avatar" />
                                </span>
                            </div>
                            
                            {/* Notification List */}
                            {toggleNotification && <NotificationContainer title='Notification' data={notifyData}/>}
                            
                            {/* Messages List */}
                            {toggleMessages && <NotificationContainer title='Messages' data={notifyData}/>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
