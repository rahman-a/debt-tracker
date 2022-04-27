import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Form, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../actions'
import constants from '../../constants'
import { Loader, SideAlert } from '../../components'
import { useTranslation } from 'react-i18next'

const FormText = () => {
  const [data, setData] = useState({})
  const [isError, setIsError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const { loading, error, content } = useSelector((state) => state.getContent)

  const {
    loading: createLoading,
    error: createError,
    message,
  } = useSelector((state) => state.createContent)

  const {
    loading: updateLoading,
    error: updateError,
    message: updateMessage,
  } = useSelector((state) => state.updateContent)

  const location = useLocation()
  const type = new URLSearchParams(location.search).get('type')
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const handleInput = (e) => {
    const { name, value } = e.target
    console.log({ [name]: value })
    setData({ ...data, [name]: value })
  }

  const isFormValid = () => {
    const { englishHeader, arabicHeader, englishBody, arabicBody } = data
    if (!englishHeader || !arabicHeader || !englishBody || !arabicBody) {
      setIsError(t('fill-all-fields'))
      return false
    }

    return true
  }

  const createContentHandler = (e) => {
    e.preventDefault()

    if (isFormValid()) {
      const header = {
        en: data.englishHeader,
        ar: data.arabicHeader,
      }

      const body = {
        en: data.englishBody,
        ar: data.arabicBody,
      }
      dispatch(actions.content.createContent({ header, body, type }))
    }
  }

  const updateContentHandler = (e) => {
    e.preventDefault()
    const header = {
      en: data.englishHeader ? data.englishHeader : content.header.en,
      ar: data.arabicHeader ? data.arabicHeader : content.header.ar,
    }

    const body = {
      en: data.englishBody ? data.englishBody : content.body.en,
      ar: data.arabicBody ? data.arabicBody : content.body.ar,
    }
    dispatch(
      actions.content.updateContent(type, content._id, { header, body, type })
    )
  }

  const clearContent = () => {
    dispatch({ type: constants.content.CREATE_CONTENT_RESET })
    dispatch({ type: constants.content.UPDATE_CONTENT_RESET })
  }

  useEffect(() => {
    dispatch(actions.content.getContent(type))
    return () => {
      clearContent()
    }
  }, [])

  useEffect(() => {
    error && setIsError(error)
    createError && setIsError(createError)
    updateError && setIsError(updateError)
  }, [error, createError, updateError])

  useEffect(() => {
    message && setSuccessMessage(message)
    updateMessage && setSuccessMessage(updateMessage)
  }, [message, updateMessage])

  if (loading) {
    return <Loader size='5' center options={{ animation: 'border' }} />
  }

  return (
    <>
      <SideAlert
        isOn={isError ? true : false}
        text={isError}
        type='danger'
        reset={() => clearContent()}
      />

      <SideAlert
        isOn={successMessage ? true : false}
        text={successMessage}
        type='success'
        reset={() => clearContent()}
      />

      <div className={style.contact}>
        <Form>
          <Form.Group controlId='formBasicHeader' className='mb-3'>
            <Form.Label>{t('english-header')}</Form.Label>
            <Form.Control
              size='lg'
              placeholder={
                content ? content.header['en'] : 'Enter header in English'
              }
              name='englishHeader'
              onChange={(e) => handleInput(e)}
            />
          </Form.Group>
          <Form.Group controlId='formBasicHeader' className='mb-3'>
            <Form.Label>{t('arabic-header')}</Form.Label>
            <Form.Control
              size='lg'
              name='arabicHeader'
              placeholder={
                content ? content.header['ar'] : 'Enter header in Arabic'
              }
              onChange={(e) => handleInput(e)}
            />
          </Form.Group>
          <Form.Group controlId='formBasicHeader' className='mb-3'>
            <Form.Label>{t('english-body')}</Form.Label>
            <Form.Control
              size='lg'
              as='textarea'
              row={5}
              name='englishBody'
              placeholder={
                content ? content.body['en'] : 'Enter body in English'
              }
              onChange={(e) => handleInput(e)}
            />
          </Form.Group>
          <Form.Group controlId='formBasicHeader' className='mb-3'>
            <Form.Label>{t('arabic-body')}</Form.Label>
            <Form.Control
              size='lg'
              as='textarea'
              row={5}
              name='arabicBody'
              placeholder={
                content ? content.body['ar'] : 'Enter body in Arabic'
              }
              onChange={(e) => handleInput(e)}
            />
          </Form.Group>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {content ? (
              <Button
                className='mr-3'
                size='lg'
                variant='primary'
                type='submit'
                onClick={updateContentHandler}
              >
                {t('update')}
              </Button>
            ) : (
              <Button
                className='mr-3'
                size='lg'
                variant='success'
                type='submit'
                onClick={createContentHandler}
              >
                {t('save')}
              </Button>
            )}
            {(createLoading || updateLoading) && (
              <Loader size='4' options={{ animation: 'border' }} />
            )}
          </div>
        </Form>
      </div>
    </>
  )
}

export default FormText
