import React, { useState } from 'react'
import style from './style.module.scss'
import { Form, Button, Alert } from 'react-bootstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Loader } from '../../components'
import { useTranslation } from 'react-i18next'
import ArticleForm from './Form'

const ArticleData = ({ saveArticleInfo, loading, info, setInfo, imageRef }) => {
  const [locale, setLocale] = useState('en')

  const [errors, setErrors] = useState(null)

  const { t } = useTranslation()

  const isFormValid = (_) => {
    const values = []
    for (let key in info) {
      if (info[key]) {
        values.push(info[key])
      }
    }
    if (!values.length) {
      setErrors(t('provide-required-data'))
      return false
    }
    if (!info.title['en'] || !info.title['ar']) {
      setErrors(t('article-title-required'))
      return false
    }
    if (info.body['ar'].length < 200 || info.body['en'].length < 200) {
      setErrors(t('minimum-content-length'))
      return false
    }
    if (!info.image) {
      setErrors(t('article-image-required'))
      return false
    }

    return true
  }

  const saveTheArticleInfo = (e) => {
    e.preventDefault()

    if (isFormValid()) {
      let articleData = {}

      for (let key in info) {
        if (info[key]) {
          articleData[key] = info[key]
        }
      }
      saveArticleInfo(articleData)
    }
  }

  return (
    <>
      <div className={style.article__form}>
        {errors && (
          <Alert variant='danger' className='text-center'>
            {errors}
            <Button variant='outline-danger' onClick={() => setErrors(null)}>
              {t('close')}
            </Button>
          </Alert>
        )}

        <div className={style.article__language}>
          <Button
            variant={locale === 'ar' ? 'light' : 'dark'}
            onClick={() => setLocale('en')}
          >
            English
          </Button>
          <Button
            variant={locale === 'ar' ? 'dark' : 'light'}
            onClick={() => setLocale('ar')}
          >
            Arabic
          </Button>
        </div>
        <Form>
          {locale === 'ar' ? (
            <ArticleForm info={info} setInfo={setInfo} locale='ar' />
          ) : (
            <ArticleForm info={info} setInfo={setInfo} locale='en' />
          )}
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label>
              {t('upload-new-image')}
              <sup style={{ color: 'red' }} title='required'>
                *
              </sup>
            </Form.Label>
            <Form.Control
              ref={imageRef}
              type='file'
              size='lg'
              onChange={(e) => setInfo({ ...info, image: e.target.files[0] })}
            />
          </Form.Group>
          <div className={style.article__submit}>
            <Button
              variant='primary'
              type='submit'
              size='lg'
              disabled={loading ? true : false}
              onClick={saveTheArticleInfo}
            >
              {t('save')}
            </Button>
            {loading && <Loader size='4' options={{ animation: 'border' }} />}
          </div>
        </Form>
      </div>
    </>
  )
}

export default ArticleData
