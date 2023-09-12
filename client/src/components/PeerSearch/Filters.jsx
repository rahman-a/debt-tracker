import React from 'react'
import style from './style.module.scss'
import { useDispatch } from 'react-redux'
import { t } from 'i18next'
import constants from '@/src/constants'

const Filters = ({ filter, setFilter, setSearchValue, lang }) => {
  const dispatch = useDispatch()

  const setFilterHandler = (filter) => {
    setFilter(filter)
    dispatch({ type: constants.users.USERS_SEARCH_RESET })
    setSearchValue('')
  }

  const activeClassHandler = (selector) => {
    return filter === selector ? style.search__filter_active : ''
  }

  return (
    <div
      className={`${style.search__filter} ${
        lang === 'ar' ? style.search__filter_ar : ''
      }`}
    >
      <button
        className={activeClassHandler('username')}
        onClick={() => setFilterHandler('username')}
      >
        <span>{t('username')}</span>
      </button>
      <button
        className={activeClassHandler('mobile')}
        onClick={() => setFilterHandler('mobile')}
      >
        <span>{t('mobile')}</span>
      </button>
      <button
        className={activeClassHandler('code')}
        onClick={() => setFilterHandler('code')}
      >
        <span>{t('user-code')}</span>
      </button>
    </div>
  )
}

export default Filters
