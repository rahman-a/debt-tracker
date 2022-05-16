import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import parser from 'html-react-parser'
import { Loader, HeaderAlert } from '../../components'
import actions from '../../actions'
import { increaseViews } from '../../actions/content.actions'
import i18next from 'i18next'

const Article = () => {
  const [lang, setLang] = useState(i18next.language)
  const { id } = useParams()
  const dispatch = useDispatch()
  const { isLoading, error, article } = useSelector(
    (state) => state.getArticleData
  )

  const renderContent = (content) => {
    const text = parser(content)
    return text
  }

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
      setLang(lng)
    })
  }, [lang])

  useEffect(() => {
    dispatch(actions.content.getArticleData(id))
    increaseViews(id)
  }, [id, dispatch])
  return (
    <div className={style.article} style={{ height: isLoading && '100vh' }}>
      <div
        className='container'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: isLoading || error ? '35rem' : 'auto',
        }}
      >
        {isLoading ? (
          <Loader size='10' options={{ animation: 'border' }} />
        ) : error ? (
          <HeaderAlert type='danger' size='2' text={error} />
        ) : (
          article && (
            <div className={style.article__wrapper}>
              <h1>{article.title[lang]}</h1>
              <figure>
                <img src={`/api/files/${article.image}`} alt={article.title} />
              </figure>
              <p className={style.article__content}>
                {renderContent(article.body[lang])}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Article
