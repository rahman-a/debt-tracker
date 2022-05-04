import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import actions from '../../actions'
import constants from '../../constants'
import { Loader } from '..'

const Input = ({ filter, setPeerInfo, searchValue, setSearchValue, lang }) => {
  const [isError, setIsError] = useState(null)
  const { loading, error, users } = useSelector((state) => state.searchUsers)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const placeholder = {
    username: t('search-username'),
    mobile: t('search-mobile'),
    code: t('search-user-code'),
  }

  const searchPeersHandler = (_) => {
    setIsError(null)
    dispatch(actions.users.SearchForUsers({ [filter]: searchValue }))
    setSearchValue('')
  }

  const initiateOperation = (user) => {
    if (user.color.toLocaleLowerCase() !== '#ec4a0d') {
      setPeerInfo(user)
      return
    } else setIsError(t('no-operation-with-red'))
  }

  useEffect(() => {
    return () => {
      dispatch({ type: constants.users.USERS_SEARCH_RESET })
    }
  }, [])

  useEffect(() => {
    error && setIsError(error)
  }, [error])

  return (
    <div
      className={`${style.search__input} ${
        lang === 'ar' ? style.search__input_ar : ''
      }`}
    >
      <input
        type='text'
        placeholder={placeholder[filter]}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <button onClick={searchPeersHandler}>{t('search')}</button>

      {loading || isError ? (
        <ul className={style.search__data} style={{ overflow: 'unset' }}>
          <li style={{ border: 0 }}>
            {loading ? (
              <Loader center size='4' options={{ animation: 'grow' }} />
            ) : (
              isError && (
                <p style={{ color: 'red', fontSize: '1.4rem' }}>{isError}</p>
              )
            )}
          </li>
        </ul>
      ) : (
        users &&
        users && (
          <ul className={style.search__data}>
            {users.map((user) => (
              <li key={user._id} onClick={() => initiateOperation(user)}>
                <img src={`/api/files/${user.image}`} alt='second peer' />
                <p>{lang === 'ar' ? user.arabicName : user.name}</p>
                <span style={{ backgroundColor: user.color }}></span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}

export default Input
