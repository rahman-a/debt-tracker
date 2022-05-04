import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.scss'
import { Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import actions from '../../actions'
import constants from '../../constants'
import { Input, Table, Loader, HeaderAlert, SideAlert } from '../../components'
import Row from './Row'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Articles = () => {
  const [title, setTitle] = useState('')
  const navigate = useNavigate()
  const { isLoading, error, articles } = useSelector(
    (state) => state.listArticles
  )
  const { message, error: delete_error } = useSelector(
    (state) => state.deleteArticle
  )

  const dispatch = useDispatch()

  const { t } = useTranslation()

  const lang = i18next.language

  const searchArticleHandler = (_) => {
    dispatch(actions.article.listArticles(title))
  }

  useEffect(() => {
    return () => dispatch({ type: constants.article.DELETE_ARTICLE_RESET })
  }, [])

  useEffect(() => {
    dispatch(actions.article.listArticles())
  }, [message])

  return (
    <div className={style.articles}>
      <SideAlert
        type='danger'
        text={delete_error}
        isOn={delete_error ? true : false}
      />

      <SideAlert type='success' text={message} isOn={message ? true : false} />

      <h1 className='main-header'>{t('articles-list')}</h1>

      <Button
        className={style.articles__new}
        variant='warning'
        size='lg'
        onClick={() => navigate('/articles/new')}
      >
        {t('new-article')}
      </Button>

      <div className={style.articles__filter}>
        <Input
          type='text'
          name='title'
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('search-by-article-title')}
          className={style.articles__search}
        />

        <Button
          variant='dark'
          size='lg'
          onClick={searchArticleHandler}
          style={{
            marginleft: lang === 'en' ? '1rem' : 'unset',
            marginRight: lang == 'ar' ? '1rem' : 'unset',
          }}
        >
          {t('search')}
        </Button>
      </div>

      {isLoading ? (
        <Loader size='10' options={{ animation: 'border' }} />
      ) : error ? (
        <HeaderAlert type='danger' size='3' text={error} />
      ) : (
        <>
          <Table>
            <thead>
              <th>#</th>
              <th>{t('id')}</th>
              <th>{t('title')}</th>
              <th>{t('image')}</th>
              <th>{t('views')}</th>
              <th>{t('createdAt')}</th>
              <th></th>
            </thead>
            <tbody>
              {articles &&
                articles.map((article, idx) => (
                  <tr key={article._id}>
                    <Row article={article} idx={idx} />
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  )
}

export default Articles
