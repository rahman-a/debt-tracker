import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, Form, InputGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Loader, SideAlert } from '../../components'
import actions from '../../actions'
import constants from '../../constants'

const CreateSlider = ({ isCreateSlide, setIsCreateSlide }) => {
  const [data, setData] = useState({})
  const [isError, setIsError] = useState(null)
  const dispatch = useDispatch()
  const { loading, message } = useSelector((state) => state.addSlider)
  const { t } = useTranslation()

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'slider') {
      setData({ ...data, [name]: files[0] })
      return
    }
    setData({ ...data, [name]: value })
  }

  const isFormValid = () => {
    const {
      englishTitle,
      arabicTitle,
      englishText,
      arabicText,
      slider,
      arabicKeyword,
      englishKeyword,
    } = data
    if (!englishTitle) {
      setIsError(t('english-title-required'))
      return false
    }
    if (!arabicTitle) {
      setIsError(t('arabic-title-required'))
      return false
    }
    if (!englishText) {
      setIsError(t('english-text-required'))
      return false
    }
    if (!arabicText) {
      setIsError(t('arabic-text-required'))
      return false
    }
    if (!slider) {
      setIsError(t('image-required'))
      return false
    }
    if (!arabicKeyword) {
      setIsError(t('arabic-keyword-required'))
      return false
    }

    if (!englishKeyword) {
      setIsError(t('english-keyword-required'))
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid()) {
      const formData = new FormData()
      formData.append('englishTitle', data.englishTitle)
      formData.append('arabicTitle', data.arabicTitle)
      formData.append('englishText', data.englishText)
      formData.append('arabicText', data.arabicText)
      formData.append('slider', data.slider)
      formData.append('arabicKeyword', data.arabicKeyword)
      formData.append('englishKeyword', data.englishKeyword)
      data.article && formData.append('article', data.article)
      dispatch(actions.content.addSlider(formData))
    }
  }

  const clearAlert = () => {
    dispatch({ type: constants.content.ADD_SLIDER_RESET })
    setIsError(null)
  }

  useEffect(() => {
    if (message) {
      setIsCreateSlide(false)
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
      <Modal show={isCreateSlide} onHide={() => setIsCreateSlide(false)}>
        <Modal.Header>
          <Modal.Title>{t('add-new-slider')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={style.slider__slider}>
            {loading && (
              <div className={style.slider__overlay}>
                <Loader size='5' center options={{ animation: 'border' }} />
              </div>
            )}
            <Form>
              {/* Slider Header */}
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('english-title')} </InputGroup.Text>
                <Form.Control
                  name='englishTitle'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              {/* Slider Header */}
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('arabic-title')}</InputGroup.Text>
                <Form.Control
                  name='arabicTitle'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              {/* Slider Sub Header */}
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('english-text')} </InputGroup.Text>
                <Form.Control
                  name='englishText'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('arabic-text')} </InputGroup.Text>
                <Form.Control
                  name='arabicText'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              {/* Slider Image */}
              <InputGroup>
                <InputGroup.Text> {t('image')} </InputGroup.Text>
                <Form.Control
                  type='file'
                  name='slider'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>
              <Form.Text className='d-block text-muted fs-5 mb-3'>
                {t('max-size-1000')}
              </Form.Text>
              {/* /////////////// */}
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('arabic-keyword')} </InputGroup.Text>
                <Form.Control
                  name='arabicKeyword'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>
              {/* /////////////// */}
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('english-keyword')} </InputGroup.Text>
                <Form.Control
                  name='englishKeyword'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>
              {/* Link to article */}
              <InputGroup>
                <InputGroup.Text> {t('link-to')} </InputGroup.Text>
                <Form.Control
                  name='article'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>
              <Form.Text className='d-block text-muted fs-5 mb-3'>
                {t('optional')}
              </Form.Text>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size='lg'
            variant='secondary'
            onClick={() => setIsCreateSlide(false)}
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

export default CreateSlider
