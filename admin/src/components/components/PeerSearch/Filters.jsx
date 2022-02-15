import React from 'react'
import style from './style.module.scss'
import { useDispatch } from 'react-redux'
import constants from '../../constants'

const Filters = ({filter, setFilter, setSearchValue}) => {
    const dispatch = useDispatch()

    const setFilterHandler = filter => {
        setFilter(filter)
        dispatch({type:constants.users.USERS_SEARCH_RESET})
        setSearchValue('')
    }

    return (
        <div className={style.search__filter}>
            <button className={filter === 'username' ? style.search__filter_active :''}
            onClick={() => setFilterHandler('username')}> 
                username
            </button>
            <button className={filter === 'mobile' ? style.search__filter_active :''}
            onClick={() => setFilterHandler('mobile')}>
                mobile
            </button>
            <button className={filter === 'code' ? style.search__filter_active :''}
            onClick={() => setFilterHandler('code')}>
                user code
            </button>
        </div>
    )
}

export default Filters
