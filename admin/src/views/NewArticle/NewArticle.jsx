import React, { useEffect, useState, useRef } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { SideAlert, BackButton } from '../../components'
import actions from '../../actions'
import constants from '../../constants'
import ArticleData from './ArticleData'
import { useTranslation } from 'react-i18next'

const Article = () => {
  const [info, setInfo] = useState({
    title: {
      en: '',
      ar: '',
    },
    body: {
      ar: '',
      en: '',
    },
    image: '',
  })
  const imageRef = useRef()
  const dispatch = useDispatch()
  const { isLoading, error, message } = useSelector(
    (state) => state.createArticle
  )

  const { t } = useTranslation()

  const dateOptions = {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  }

  const saveArticleInfo = (article) => {
    const data = new FormData()

    for (let key in article) {
      if (article[key]) {
        key === 'image'
          ? data.append(key, article[key])
          : data.append(key, JSON.stringify(article[key]))
      }
    }
    dispatch(actions.article.createArticle(data))
  }

  useEffect(() => {
    if (message) {
      setInfo({
        title: { ar: '', en: '' },
        body: { ar: '', en: '' },
        image: '',
      })

      imageRef.current.value = null
    }
  }, [message])

  useEffect(() => {
    return () => {
      dispatch({ type: constants.article.CREATE_ARTICLE_RESET })
    }
  }, [])

  return (
    <div className={style.article}>
      <BackButton page='articles' text={t('back-to-articles')} />

      <SideAlert
        position='left'
        type='danger'
        isOn={error ? true : false}
        text={error}
      />

      <SideAlert
        position='left'
        type='success'
        isOn={message ? true : false}
        text={message}
        reset={() => dispatch({ type: constants.article.CREATE_ARTICLE_RESET })}
      />

      <div className='container'>
        <div className={style.article__wrapper}>
          <div className={style.article__header}>
            <h1 className='main-header'> {t('create-article')} </h1>
            <span className={style.article__header_date}>
              {t('createdAt')}:{' '}
              {new Date().toLocaleDateString('en-US', dateOptions)}
            </span>
          </div>

          <div className={style.article__body}>
            <ArticleData
              info={info}
              setInfo={setInfo}
              saveArticleInfo={saveArticleInfo}
              imageRef={imageRef}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article
