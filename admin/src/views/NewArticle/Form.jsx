import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHTML from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { useSelector } from 'react-redux'

const ArticleForm = ({ info, setInfo, locale }) => {
  const blocksFromHtml = htmlToDraft(info.body[locale] ? info.body[locale] : '')
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  )
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const { message } = useSelector((state) => state.createArticle)

  const getArticleInfo = (e) => {
    const updatedInfo = { ...info }
    updatedInfo.title[locale] = e.target.value
    setInfo(updatedInfo)
  }

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

  useEffect(() => {
    if (message) {
      setEditorState(() => EditorState.createEmpty())
    }
  }, [message])

  useEffect(() => {
    if (editorState) {
      const updatedInfo = { ...info }
      updatedInfo.body[locale] = draftToHTML(
        convertToRaw(editorState.getCurrentContent())
      )
      setInfo(updatedInfo)
    }
  }, [editorState])

  useEffect(() => {
    if (info.body[locale]) {
      setEditorState(EditorState.createWithContent(contentState))
    } else {
      setEditorState(EditorState.createEmpty())
    }
  }, [locale])

  return (
    <Form>
      <div
        style={{
          border: '1px solid black',
          padding: '1rem',
          minHeight: '400px',
          margin: '1rem 0',
        }}
      >
        <Form.Group
          className='mb-3'
          controlId='formBasicName'
          style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}
        >
          <Form.Label>
            {locale === 'ar' ? 'عنوان المقالة' : 'Article Title'}
            <sup style={{ color: 'red' }} title='required'>
              *
            </sup>
          </Form.Label>
          <Form.Control
            type='text'
            placeholder={locale === 'ar' ? 'عنوان المقالة' : 'Article Title'}
            name='title'
            size='lg'
            value={info.title[locale]}
            style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}
            onChange={(e) => getArticleInfo(e)}
          />
        </Form.Group>

        <p
          style={{
            marginBottom: '1rem',
            direction: locale === 'ar' ? 'rtl' : 'ltr',
          }}
        >
          {' '}
          {locale === 'ar' ? 'محتوى المقالة' : 'Article Content'}
          <sup style={{ color: 'red' }} title='required'>
            *
          </sup>
        </p>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          textAlignment={locale === 'ar' ? 'right' : 'left'}
          toolbar={{
            options: editorToolbarOptions,
          }}
        />
      </div>
    </Form>
  )
}

export default ArticleForm
