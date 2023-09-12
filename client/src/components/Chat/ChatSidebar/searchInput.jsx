import { useState, useRef } from 'react'
import style from './style.module.scss'
import { useDispatch } from 'react-redux'
import i18next from 'i18next'
import classnames from 'classnames'
import actions from '@/src/actions'
import constants from '@/src/constants'
import { Close, ArrowLeft, Magnify } from '@/src/icons'

const SearchInput = ({ placeholder, newChat, onClick, reset }) => {
  const [isFocus, setIsFocus] = useState(false)
  const [closeBtn, setCloseBtn] = useState(false)
  const inputRef = useRef(null)
  const lang = i18next.language

  const dispatch = useDispatch()

  const searchClassNames = classnames(style.sidebar__search, {
    [style.sidebar__search_focus]: isFocus,
    [style.sidebar__search_ar]: lang === 'ar',
  })

  const handleInputFocus = () => {
    setIsFocus(true)
    const timeout = setTimeout(() => {
      setCloseBtn(true)
      clearTimeout(timeout)
    }, 100)
  }
  const searchHandler = (e) => {
    e.preventDefault()
    const name = inputRef.current.value
    if (name.trim() === '') return
    onClick && onClick(name)
    newChat && dispatch(actions.chat.createNewChat(name))
  }
  const onBlurInputHandler = () => {
    const timeout = setTimeout(() => {
      setIsFocus(false)
      setCloseBtn(false)
      clearTimeout(timeout)
    }, 100)
  }

  const resetSearchHandler = () => {
    inputRef.current.value = ''
    reset && reset()
    newChat && dispatch({ type: constants.chat.CREATE_NEW_CHAT_RESET })
  }
  return (
    <div className={searchClassNames}>
      <form onSubmit={searchHandler}>
        {closeBtn && (
          <span
            onClick={() => resetSearchHandler()}
            style={{
              right: '1rem',
              left: 'unset',
              cursor: 'pointer',
            }}
          >
            <Close />
          </span>
        )}

        <input
          type='text'
          name='search'
          placeholder={placeholder}
          autoComplete='off'
          ref={inputRef}
          onFocus={handleInputFocus}
          onBlur={onBlurInputHandler}
        />

        {isFocus ? (
          <button
            type='submit'
            style={{
              color: 'green',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft />
          </button>
        ) : (
          <span style={{ color: '#9e9e9e' }}>
            <Magnify />
          </span>
        )}
      </form>
    </div>
  )
}

export default SearchInput
