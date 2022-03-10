import React, {useEffect} from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import {useTranslation} from 'react-i18next'
import actions from '../../actions'
import constants from '../../constants'
import {Loader} from '..'

const Input = ({ 
    filter, 
    setPeerInfo, 
    searchValue, 
    setSearchValue,
    lang
}) => { 
    
    const {loading, error, users} = useSelector(state => state.searchUsers)
    const dispatch = useDispatch()
    const {t} = useTranslation()
    
    const placeholder = {
        username:t('search-username'),
        mobile:t('search-mobile'),
        code:t('search-user-code')
    }

    const searchPeersHandler = _ => {
        dispatch(actions.users.SearchForUsers({[filter]:searchValue}))
        setSearchValue('')
    }

    useEffect(() => {
        return () => {
            dispatch({type:constants.users.USERS_SEARCH_RESET})
        }
    },[])

    return (
        <div className={`${style.search__input} ${lang === 'ar' ? style.search__input_ar : ''}`}>
            
            <input 
            type="text" 
            placeholder={placeholder[filter]}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            />
            
            <button 
            onClick={searchPeersHandler}>
               {t('search')}
            </button>
            
            {(loading || error) 
            ? <ul className={style.search__data} style={{overflow:'unset'}}>
                <li style={{border:0}}>
                   {loading
                   ? <Loader center size='4' options={{animation:'grow'}}/>
                   : error && <p style={{color:'red', fontSize:'1.4rem'}}>{error}</p>} 
                </li>    
            </ul>
            
            :users && users 
            && <ul className={style.search__data}>
                {
                    users.map(user => (
                    <li key={user._id}
                    onClick={() => setPeerInfo(user)}>
                        <img src={`/api/files/${user.image}`} alt="second peer" />
                        <p>{
                            lang === 'ar' 
                            ? user.arabicName 
                            : user.name
                        }</p>
                    </li>
                    ))
               } 
            </ul>}

        </div>
    )
}

export default Input
