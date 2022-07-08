import React, { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../actions'
import { Loader, SideAlert } from '../../components'
import constants from '../../constants'

const AboutItem = ({ show, setIsShow }) => {
  const [isError, setIsError] = useState(null)
  const [data, setData] = useState({})
  const [image, setImage] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const dispatch = useDispatch()

  const {
    loading: createLoading,
    error: createError,
    message,
  } = useSelector((state) => state.createAboutItem)

  const { t } = useTranslation()

  const isFormValid = () => {
    const { englishHeader, arabicHeader, englishBody, arabicBody } = data
    if (!englishHeader || !arabicHeader || !englishBody || !arabicBody) {
      setIsError(t('fill-all-fields'))
      return false
    }

    return true
  }

  const handleInput = (e) => {
    const { name, value } = e.target
    console.log({ [name]: value })
    setData({ ...data, [name]: value })
  }

  const createContentHandler = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      const title = {
        en: data.englishHeader,
        ar: data.arabicHeader,
      }

      const body = {
        en: data.englishBody,
        ar: data.arabicBody,
      }
      console.log({ title, body, image })
      const itemData = new FormData()
      itemData.append('title', JSON.stringify(title))
      itemData.append('body', JSON.stringify(body))
      itemData.append('image', image)
      dispatch(
        actions.about.createAboutItem('62c71c65cd65d5b593072db0', itemData)
      )
    }
  }

  const clearContent = () => {
    dispatch({ type: constants.content.CREATE_ABOUT_ITEM_RESET })
    setIsError(null)
    setSuccessMessage(null)
  }

  useEffect(() => {
    createError && setIsError(createError)
  }, [createError])

  useEffect(() => {
    message && setSuccessMessage(message)
  }, [message])

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
      <Modal show={show} onHide={() => setIsShow(false)}>
        <Modal.Header>
          <Modal.Title>New Paragraph</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='formBasicHeader' className='mb-3'>
              <Form.Label>{t('english-header')}</Form.Label>
              <Form.Control
                size='lg'
                name='englishHeader'
                onChange={(e) => handleInput(e)}
              />
            </Form.Group>
            <Form.Group controlId='formBasicHeader' className='mb-3'>
              <Form.Label>{t('arabic-header')}</Form.Label>
              <Form.Control
                size='lg'
                name='arabicHeader'
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
                onChange={(e) => handleInput(e)}
              />
            </Form.Group>
            <Form.Group controlId='formBasicHeader' className='mb-3'>
              <Form.Label>{t('content-image')}</Form.Label>
              <Form.Control
                size='lg'
                name='image'
                type='file'
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                className='mr-3'
                size='lg'
                variant='success'
                type='submit'
                onClick={createContentHandler}
              >
                {t('save')}
              </Button>
              {createLoading && (
                <Loader size='4' options={{ animation: 'border' }} />
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size='lg'
            variant='secondary'
            onClick={() => setIsShow(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AboutItem
