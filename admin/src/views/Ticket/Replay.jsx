import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import RichTextEditor from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { PaperPlane } from '@/src/icons'
import { Loader, SideAlert } from '@/src/components'
import actions from '@/src/actions'
import constants from '@/src/constants'

const Replay = ({ setIsEditor, id }) => {
  const editorRef = useRef()
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState(null)
  const attachRef = useRef()
  const dispatch = useDispatch()
  const { loading, error, message } = useSelector(
    (state) => state.addTicketReplay
  )
  const { t } = useTranslation()
  const lang = i18next.language

  const editor = editorRef.current?.getEditor()
  const moduleConfig = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }],
      ['link'],
      [{ color: [] }],
      [{ direction: 'rtl' }],
    ],
  }

  const discardEditorHandler = (_) => {
    setIsEditor(false)
    editor.setContents('')
    attachRef.current.value = null
    setTitle('')
  }

  const sendResponseHandler = (_) => {
    if (!title) {
      setErrors(t('title-required'))
      return
    }
    const value = editor.container.firstChild.innerHTML
    if (value.toString('html').length < 50) {
      setErrors(t('minimum-length'))
      return
    }
    const data = new FormData()
    data.append('title', title)
    data.append('body', value.toString('html'))
    data.append('sender', 'cs')
    if (file) {
      data.append('file', file)
    }

    dispatch(actions.tickets.addResponseToTickets(id, data))
  }
  useEffect(() => {
    if (message) {
      setTitle('')
      editor.setContents('')
    }
  }, [message])
  useEffect(() => {
    error && setErrors(error)
  }, [error])
  useEffect(() => {
    editorRef.current
      ?.getEditor()
      .format('direction', lang === 'ar' ? 'rtl' : 'ltr')
  }, [lang])
  return (
    <>
      <SideAlert
        isOn={errors ? true : false}
        type='danger'
        text={errors}
        reset={() => setErrors(null)}
      />

      <SideAlert
        isOn={message ? true : false}
        type='success'
        text={message}
        reset={() =>
          dispatch({ type: constants.tickets.ADD_TICKET_REPLAY_RESET })
        }
      />

      <div className={style.ticket__edit}>
        <Form.Group controlId='formFile' className='m-2'>
          <Form.Control
            type='text'
            className='mb-3'
            size='lg'
            style={{ margin: '1rem 0' }}
            placeholder={t('enter-ticket-title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <div className={style.ticket__edit_area}>
          <RichTextEditor
            placeholder={t('enter-ticket-body')}
            modules={moduleConfig}
            ref={editorRef}
          />
        </div>

        <div className={style.ticket__edit_footer}>
          <Button variant='dark' onClick={discardEditorHandler}>
            {' '}
            {t('ticket-discard')}{' '}
          </Button>

          <Form.Group controlId='formFile'>
            <Form.Control
              type='file'
              ref={attachRef}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>

          <Button variant='success' onClick={sendResponseHandler}>
            <span>
              {' '}
              <PaperPlane />{' '}
            </span>
            {t('ticket-send')}
          </Button>
          {loading && <Loader size='4' options={{ animation: 'border' }} />}
        </div>
      </div>
    </>
  )
}

export default Replay
