import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Form, Button, Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHTML from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Loader } from '../../components'
import { useTranslation } from 'react-i18next'

const ArticleData = ({ saveArticleInfo, loading, info, setInfo, imageRef }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )

  const [errors, setErrors] = useState(null)

  const { message } = useSelector((state) => state.createArticle)

  const { t } = useTranslation()

  const editorToolbarOptions = [
    'inline',
    'blockType',
    'fontSize',
    'fontFamily',
    'textAlign',
    'colorPicker',
    'link',
    'emoji',
  ]

  const getArticleInfo = (e) => {
    const value = { [e.target.name]: e.target.value }
    setInfo({ ...info, ...value })
  }

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
    if (!info.title) {
      setErrors(t('article-title-required'))
      return false
    }
    if (info.body.length < 200) {
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

  useEffect(() => {
    if (message) {
      setEditorState(() => EditorState.createEmpty())
    }
  }, [message])

  useEffect(() => {
    if (editorState) {
      setInfo({
        ...info,
        body: draftToHTML(convertToRaw(editorState.getCurrentContent())),
      })
    }
  }, [editorState])

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

        <Form>
          <div
            style={{
              border: '1px solid black',
              padding: '1rem',
              minHeight: '400px',
              margin: '1rem 0',
            }}
          >
            <Form.Group className='mb-3' controlId='formBasicName'>
              <Form.Label>
                {t('article-title')}
                <sup style={{ color: 'red' }} title='required'>
                  *
                </sup>
              </Form.Label>
              <Form.Control
                type='text'
                placeholder={t('add-article-title')}
                name='title'
                size='lg'
                value={info.title}
                onChange={(e) => getArticleInfo(e)}
              />
            </Form.Group>

            <p style={{ marginBottom: '1rem' }}>
              {' '}
              {t('article-body')}
              <sup style={{ color: 'red' }} title='required'>
                *
              </sup>
            </p>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbar={{
                options: editorToolbarOptions,
              }}
            />
          </div>
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
