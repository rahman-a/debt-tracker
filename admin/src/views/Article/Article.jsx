import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Copy, Check, Upload } from '../../icons'
import { Loader, SideAlert, BackButton } from '../../components'
import actions from '../../actions'
import constants from '../../constants'
import ArticleData from './ArticleData'

const Article = () => {
  const [isCopied, setIsCopied] = useState(false)
  const [locale, setLocale] = useState('en')
  const dispatch = useDispatch()
  const { isLoading, error, article } = useSelector((state) => state.getArticle)
  const { isLoading: img_loading } = useSelector((state) => state.updateArticle)
  const { t } = useTranslation()
  const { id } = useParams()

  const dateOptions = {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  }

  const changeImageHandler = (e) => {
    if (e.target.files[0]) {
      const data = new FormData()
      data.append('image', e.target.files[0])
      dispatch(actions.article.updateArticle(article._id, data))
    }
  }

  const onCopyHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 500)
  }

  const clearAlert = () => {
    dispatch({ type: constants.article.UPDATE_ARTICLE_RESET })
  }

  useEffect(() => {
    id && dispatch(actions.article.getArticle(id))
  }, [id])

  useEffect(() => {
    return () => clearAlert()
  }, [])

  return (
    <div className={style.article}>
      <BackButton page='articles' text={t('back-to-articles')} />

      <SideAlert type='danger' text={error} isOn={error ? true : false} />

      <div className='container'>
        <div className={style.article__wrapper}>
          {isLoading ? (
            <Loader size='8' center options={{ animation: 'border' }} />
          ) : (
            article && (
              <>
                <div className={style.article__header}>
                  <h1 className='main-header'> {article.title[locale]} </h1>
                  <p>
                    {' '}
                    <strong> {t('article-id')} </strong>
                    {article._id}
                    <CopyToClipboard text={article._id} onCopy={onCopyHandler}>
                      <span className={style.article__header_copy}>
                        {isCopied ? <Check /> : <Copy />}
                      </span>
                    </CopyToClipboard>
                  </p>
                  <span className={style.article__header_date}>
                    {t('createdAt')}:{' '}
                    {new Date(article.createdAt).toLocaleDateString(
                      'en-US',
                      dateOptions
                    )}
                  </span>
                </div>

                <div className={style.article__body}>
                  <div className={style.article__content}>
                    <ArticleData
                      data={article}
                      locale={locale}
                      setLocale={setLocale}
                    />
                  </div>
                  <figure className={style.article__image}>
                    {img_loading && (
                      <Loader
                        size='4'
                        center
                        options={{ animation: 'border' }}
                        custom={{ color: '#fff' }}
                      />
                    )}
                    <div
                      className={style.article__image_backdrop}
                      style={{ display: img_loading && 'block' }}
                    >
                      <label htmlFor='article-image'>
                        {img_loading ? (
                          <Loader
                            size='5'
                            center
                            options={{ animation: 'border' }}
                          />
                        ) : (
                          <>
                            <span>
                              {' '}
                              <Upload />{' '}
                            </span>
                            <span>{t('update-article-image')}</span>
                          </>
                        )}
                      </label>

                      <input
                        type='file'
                        id='article-image'
                        onChange={changeImageHandler}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <img
                      src={`/api/files/${article.image}`}
                      alt={article.title}
                    />
                  </figure>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Article
