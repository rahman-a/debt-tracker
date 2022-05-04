import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, Form, InputGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Loader, SideAlert } from '..'
import actions from '../../actions'
import constants from '../../constants'

const CreateNews = ({ isCreateNews, setIsCreateNews }) => {
  const [data, setData] = useState({})
  const [isError, setIsError] = useState(null)
  const dispatch = useDispatch()
  const { loading, message } = useSelector((state) => state.createContent)
  const { t } = useTranslation()
  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setData({ ...data, [name]: files[0] })
      return
    }
    setData({ ...data, [name]: value })
  }

  const isFormValid = () => {
    const { englishBody, arabicBody } = data
    if (!englishBody) {
      setIsError(t('english-body-required'))
      return false
    }
    if (!arabicBody) {
      setIsError(t('arabic-body-required'))
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      const body = {}
      if (data.englishBody) body.en = data.englishBody
      if (data.arabicBody) body.ar = data.arabicBody

      const name = {}
      if (data.englishName) name.en = data.englishName
      if (data.arabicName) name.ar = data.arabicName

      const formData = new FormData()
      formData.append('body', JSON.stringify(body))
      formData.append('type', 'news')
      data.image && formData.append('image', data.image)
      Object.keys(name).length && formData.append('name', JSON.stringify(name))

      dispatch(actions.content.createContent(formData, 'news'))
    }
  }

  const clearAlert = () => {
    dispatch({ type: constants.content.CREATE_CONTENT_RESET })
    setIsError(null)
  }

  useEffect(() => {
    if (message) {
      setIsCreateNews(false)
      clearAlert()
    }
  }, [message])

  return (
    <>
      <SideAlert
        isOn={isError ? true : false}
        text={isError}
        type='danger'
        time={5000}
        reset={() => clearAlert()}
      />
      <Modal show={isCreateNews} onHide={() => setIsCreateNews(false)}>
        <Modal.Header>
          <Modal.Title> {t('add-news')} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className={`${style.slider__slider} font-size-input font-size-span`}
          >
            {loading && (
              <div className={style.slider__overlay}>
                <Loader size='5' center options={{ animation: 'border' }} />
              </div>
            )}
            <Form>
              {/* News Sub Header */}
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('english-body')} </InputGroup.Text>
                <Form.Control
                  name='englishBody'
                  as='textarea'
                  row={3}
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('arabic-body')} </InputGroup.Text>
                <Form.Control
                  name='arabicBody'
                  as='textarea'
                  row={3}
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              {/* News Image */}
              <InputGroup>
                <InputGroup.Text> {t('image')} </InputGroup.Text>
                <Form.Control
                  type='file'
                  name='image'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>
              <Form.Text className='d-block text-muted fs-5 mb-3'>
                {t('max-size-1000')}
              </Form.Text>

              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('english-name')} </InputGroup.Text>
                <Form.Control
                  name='englishName'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>
              <InputGroup className='mb-3'>
                <InputGroup.Text>{t('arabic-name')} </InputGroup.Text>
                <Form.Control
                  name='arabicName'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size='lg'
            variant='secondary'
            onClick={() => setIsCreateNews(false)}
          >
            {t('close')}
          </Button>
          <Button size='lg' variant='success' onClick={handleSubmit}>
            {t('save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreateNews
