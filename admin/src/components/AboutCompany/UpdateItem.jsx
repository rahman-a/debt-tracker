import React, { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../actions'
import { Loader, SideAlert } from '..'
import constants from '../../constants'

const AboutItem = ({ show, setIsShow, id }) => {
  const [isError, setIsError] = useState(null)
  const [data, setData] = useState({
    englishHeader: '',
    arabicHeader: '',
    englishBody: '',
    arabicBody: '',
  })
  const [image, setImage] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const dispatch = useDispatch()
  const { content } = useSelector((state) => state.getAboutContent)

  const {
    loading: updateLoading,
    error: updateError,
    message: updateMessage,
  } = useSelector((state) => state.updateAboutItem)

  const { t } = useTranslation()

  const handleInput = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const updateContentHandler = (e) => {
    e.preventDefault()
    const title = {
      en: data.englishHeader,
      ar: data.arabicHeader,
    }

    const body = {
      en: data.englishBody,
      ar: data.arabicBody,
    }

    const itemData = new FormData()
    itemData.append('title', JSON.stringify(title))

    itemData.append('body', JSON.stringify(body))
    image && itemData.append('image', image)
    console.log('id: ', id)
    dispatch(actions.about.updateAboutItem(id, itemData))
  }

  const clearContent = () => {
    dispatch({ type: constants.content.UPDATE_ABOUT_ITEM_RESET })
    setIsError(null)
    setSuccessMessage(null)
  }

  const getItem = () => {
    if (content) {
      const item = content.items.find((item) => item._id.toString() === id)
      console.log('item: ', item)
      if (item) {
        setData({
          englishHeader: item.title.en,
          arabicHeader: item.title.ar,
          englishBody: item.body.en,
          arabicBody: item.body.ar,
        })
      }
    }
  }

  useEffect(() => {
    updateError && setIsError(updateError)
  }, [updateError])

  useEffect(() => {
    updateMessage && setSuccessMessage(updateMessage)
  }, [updateMessage])

  useEffect(() => {
    content && show && getItem()
  }, [content, show])

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
                value={data['englishHeader']}
                name='englishHeader'
                onChange={(e) => handleInput(e)}
              />
            </Form.Group>
            <Form.Group controlId='formBasicHeader' className='mb-3'>
              <Form.Label>{t('arabic-header')}</Form.Label>
              <Form.Control
                size='lg'
                name='arabicHeader'
                value={data['arabicHeader']}
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
                value={data['englishBody']}
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
                value={data['arabicBody']}
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
                variant='primary'
                type='submit'
                onClick={updateContentHandler}
              >
                {t('update')}
              </Button>

              {updateLoading && (
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
