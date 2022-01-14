import React from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import {Loader} from '../../components'
import {
    Cogs, 
    File, 
    Logout, 
    AddressCard, 
    Globe
} from '../../icons'


const SideNavbar = ({showSideMenu, loadingState,language, changeLanguageHandler, setIsAuth}) => {
    const navigate = useNavigate()
    
    const logoutHandler = _ => {
        setIsAuth(false)
        navigate('/')
    }
    
    return (
        <div className={style.navbar__menu}
        style={{left: showSideMenu ? '0' : '-30rem'}}>
            <ul className={style.navbar__menu_list}>
                <li className={style.navbar__menu_item}
                onClick={() => navigate('/operation')}>
                    <span>
                        <Cogs/>
                    </span>
                    <span>
                        Operation
                    </span>
                </li>
                <li className={style.navbar__menu_item}
                onClick={() => navigate('/reports')}>
                    <span>
                        <File/>
                    </span>
                    <span>
                        Reports
                    </span>
                </li>
                <li className={style.navbar__menu_item}
                onClick={() => navigate('/profile')}>
                    <span>
                        <AddressCard/>
                    </span>
                    <span>
                        Profile
                    </span>
                </li>
                <li className={style.navbar__menu_item}
                onClick={logoutHandler}>
                    <span className={style.navbar__menu_item_logout}>
                        <Logout/>
                    </span>
                    <span>
                        Logout
                    </span>
                </li>
                <li className={`
                ${style.navbar__menu_item} 
                ${style.navbar__menu_item_lang}
                `}>
                    {loadingState && <span className={style.navbar__menu_item_loading}>
                        <Loader center size='5' options={{animation:'border'}}/>
                    </span>}
                    <span>
                        <Globe/>
                    </span>
                    <span className={style.navbar__menu_item_flag}>
                    {language === 'ar' 
                        ? <img 
                        onClick={(e) => changeLanguageHandler(e, 'en')} 
                        src="/images/usa-flag.jpg" 
                        alt="usa flag" />
                        :<img 
                        onClick={(e) => changeLanguageHandler(e, 'ar')} 
                        src="/images/uae-flag.png" 
                        alt="uae flag" />}     
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default SideNavbar
