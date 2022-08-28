import React, { useEffect, useState, useRef } from 'react'
import style from './style.module.scss'
import { Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

const mode = localStorage.getItem('mode')
  ? localStorage.getItem('mode')
  : 'night'

const AppearanceModeSwitch = () => {
  const [isNightMode, setIsNightMode] = useState(mode === 'night')
  const checkInputRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (checkInputRef.current) {
      checkInputRef.current.classList.add(style.mode__switch)
    }
    isNightMode
      ? dispatch({ type: 'SET_NIGHT_MODE' })
      : dispatch({ type: 'SET_DAY_MODE' })
  }, [isNightMode, dispatch])

  return (
    <div className={style.mode}>
      <Form>
        <Form.Check
          ref={checkInputRef}
          type='switch'
          checked={isNightMode}
          onChange={() => setIsNightMode(!isNightMode)}
          id='custom-switch'
          size='lg'
          label={isNightMode ? '🌜' : '🌞'}
        />
      </Form>
    </div>
  )
}

export default AppearanceModeSwitch
