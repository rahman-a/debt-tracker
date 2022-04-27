import React, { useEffect } from 'react'
import style from './style.module.scss'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import parser from 'html-react-parser'
import { Loader, HeaderAlert } from '../../components'
import actions from '../../actions'
import { increaseViews } from '../../actions/content.actions'

const Article = () => {
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
              <h1>{article.title}</h1>
              <figure>
                <img src={`/api/files/${article.image}`} alt={article.title} />
              </figure>
              <p className={style.article__content}>
                {renderContent(article.body)}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Article
