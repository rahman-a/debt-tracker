import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import draftToHTML from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Loader, SideAlert } from '../../components'
import actions from '../../actions'
import constants from '../../constants'

const ArticleData = ({ data }) => {
  const blocksFromHtml = htmlToDraft(data.body)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  )

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  )

  const [info, setInfo] = useState({
    title: '',
    body: '',
  })

  const { isLoading, error, message } = useSelector(
    (state) => state.updateArticle
  )

  const dispatch = useDispatch()

  const { t } = useTranslation()

  const lang = i18next.language

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

  const updateTheArticleInfo = (e) => {
    e.preventDefault()

    let articleData = {}

    for (let key in info) {
      if (info[key]) {
        articleData[key] = info[key]
      }
    }
    dispatch(actions.article.updateArticle(data._id, articleData))
  }

  const clearAlert = () => {
    dispatch({ type: constants.article.UPDATE_ARTICLE_RESET })
  }

  useEffect(() => {
    message &&
      setInfo({
        title: '',
        body: '',
      })
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
      <SideAlert
        type='danger'
        position='left'
        isOn={error ? true : false}
        text={error}
        reset={() => clearAlert()}
      />

      <SideAlert
        type='success'
        position='left'
        isOn={message ? true : false}
        text={message}
        reset={() => clearAlert()}
      />

      <Form>
        <div
          style={{
            border: '1px solid black',
            padding: '2px',
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
              placeholder={data.title}
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
        <div className={style.article__submit}>
          <Button
            variant='primary'
            type='submit'
            size='lg'
            disabled={isLoading ? true : false}
            onClick={updateTheArticleInfo}
          >
            {t('update')}
          </Button>
          {isLoading && <Loader size='4' options={{ animation: 'border' }} />}
        </div>
      </Form>
    </>
  )
}

export default ArticleData
