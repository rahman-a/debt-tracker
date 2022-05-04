import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Carousel } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AngleLeft, AngleRight } from '../../icons'
import actions from '../../actions'
import i18next from 'i18next'

const QuickNews = () => {
  const [lang, setLang] = useState(i18next.language)
  const { news } = useSelector((state) => state.listNews)
  const dispatch = useDispatch()

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
      setLang(lng)
    })
  }, [lang])

  useEffect(() => {
    dispatch(actions.content.listNews())
  }, [])

  return (
    <div className={style.news}>
      <button className='carousel-control-prev' tabIndex={0}>
        <span>
          {' '}
          <AngleLeft />{' '}
        </span>
      </button>
      <button className='carousel-control-next' tabIndex={0}>
        <span>
          {' '}
          <AngleRight />{' '}
        </span>
      </button>
      <Carousel>
        {news &&
          news.map((item) => (
            <Carousel.Item key={item._id}>
              <div className={style.news__block}>
                {item.image && (
                  <figure>
                    <img src={`/api/files/${item.image}`} alt='personal' />
                  </figure>
                )}
                <p> {item.body[lang]} </p>
                {item.name && <span>{item.name[lang]} </span>}
              </div>
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  )
}

export default QuickNews
