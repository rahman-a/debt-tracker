import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import actions from '../../actions'
import style from './style.module.scss'

const TrackCode = ({ userId }) => {
  const [codeTime, setCodeTime] = useState(119)
  const [timeFormat, setTimeFormat] = useState('01:59')
  const timeInterval = useRef()
  const [sendCodeAgain, setCodeAgain] = useState(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { loading, message } = useSelector((state) => state.sendLoginCode)

  const sendCodeAgainHandler = () => {
    dispatch(actions.users.sendLoginCode(userId))
  }
  useEffect(() => {
    if (codeTime >= 0) {
      timeInterval.current = setTimeout(() => {
        setCodeTime(codeTime - 1)
        const minute = Math.floor(codeTime / 60)
        const second =
          Math.floor(codeTime % 60).toString().length > 1
            ? Math.floor(codeTime % 60)
            : `0${Math.floor(codeTime % 60)}`
        setTimeFormat(`0${minute}:${second}`)
      }, 1000)
    }
    if (codeTime < 0) {
      clearTimeout(timeInterval.current)
      setCodeAgain(true)
    }
  }, [codeTime])
  useEffect(() => {
    if (message) {
      codeTime <= 0 ? setCodeTime(119) : setCodeTime(codeTime - 1)
      setCodeAgain(false)
    }
  }, [message])
  return (
    <div className={style.loginCode__track}>
      {sendCodeAgain && !loading ? (
        <Button onClick={sendCodeAgainHandler} variant='light'>
          {t('send-code-again')}
        </Button>
      ) : (
        !loading && <p>{t('code-send-in-time', { time: timeFormat })}</p>
      )}
    </div>
  )
}

export default TrackCode
