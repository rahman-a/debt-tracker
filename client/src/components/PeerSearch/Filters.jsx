import React from 'react'
import style from './style.module.scss'
import { useDispatch } from 'react-redux'
import constants from '../../constants'
import { t } from 'i18next'

const Filters = ({filter, setFilter, setSearchValue, lang}) => {
    const dispatch = useDispatch()

    const setFilterHandler = filter => {
        setFilter(filter)
        dispatch({type:constants.users.USERS_SEARCH_RESET})
        setSearchValue('')
    }

    return (
        <div className={`${style.search__filter} ${lang === 'ar' ? style.search__filter_ar : ''}`}>
            <button className={filter === 'username' ? style.search__filter_active :''}
            onClick={() => setFilterHandler('username')}> 
                {t('username')}
            </button>
            <button className={filter === 'mobile' ? style.search__filter_active :''}
            onClick={() => setFilterHandler('mobile')}>
               {t('mobile')}
            </button>
            <button className={filter === 'code' ? style.search__filter_active :''}
            onClick={() => setFilterHandler('code')}>
                {t('user-code')}
            </button>
        </div>
    )
}

export default Filters
