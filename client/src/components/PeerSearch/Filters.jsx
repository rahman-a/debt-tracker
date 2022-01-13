import React from 'react'
import style from './style.module.scss'

const filters = ({filter, setFilter}) => {
    return (
        <div className={style.search__filter}>
            <button className={filter === 'username' ? style.search__filter_active :''}
            onClick={() => setFilter('username')}> 
                username
            </button>
            <button className={filter === 'mobile' ? style.search__filter_active :''}
            onClick={() => setFilter('mobile')}>
                mobile
            </button>
            <button className={filter === 'id' ? style.search__filter_active :''}
            onClick={() => setFilter('id')}>
                user id
            </button>
        </div>
    )
}

export default filters
