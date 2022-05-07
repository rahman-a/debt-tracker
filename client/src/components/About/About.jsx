import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Placeholder } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import i18next from 'i18next'
import actions from '../../actions'

const About = () => {
  const [lang, setLang] = useState(i18next.language)
  const { isLoading, aboutUs } = useSelector((state) => state.getAboutUs)
  const dispatch = useDispatch()

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
      setLang(lng)
    })
  }, [lang])

  useEffect(() => {
    !aboutUs && dispatch(actions.content.getAboutUs())
  }, [])

  return (
    <div className={style.about}>
      <div className='container'>
        {isLoading ? (
          <>
            <Placeholder xs={6} />
            <Placeholder className='w-75' />
            <Placeholder style={{ width: '25%' }} />
          </>
        ) : (
          aboutUs && (
            <>
              <h1>{aboutUs.header[lang]}</h1>
              <p>{aboutUs.body[lang]}</p>
            </>
          )
        )}
      </div>
    </div>
  )
}

export default About
