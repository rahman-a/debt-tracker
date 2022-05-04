import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, Form, InputGroup } from 'react-bootstrap'
import { Loader, SideAlert } from '../../components'
import actions from '../../actions'
import constants from '../../constants'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const UpdateSlider = ({ isUpdateSlide, setIsUpdateSlide, slide }) => {
  const [data, setData] = useState({})
  const [isError, setIsError] = useState(null)
  const dispatch = useDispatch()
  const lang = i18next.language
  const { t } = useTranslation()
  const { loading, message } = useSelector((state) => state.editSlider)

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'slider') {
      setData({ ...data, [name]: files[0] })
      return
    }
    setData({ ...data, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const title = {
      en: slide.title.en,
      ar: slide.title.ar,
    }

    const text = {
      en: slide.text.en,
      ar: slide.text.ar,
    }
    data.englishTitle && (title.en = data.englishTitle)
    data.arabicTitle && (title.ar = data.arabicTitle)
    data.englishText && (text.en = data.englishText)
    data.arabicText && (text.ar = data.arabicText)

    const formData = new FormData()
    formData.append('title', JSON.stringify(title))
    formData.append('text', JSON.stringify(text))
    data.slider && formData.append('slider', data.slider)
    data.article && formData.append('article', data.article)
    if (Object.values(data).length > 0) {
      dispatch(actions.content.updateSliders(slide._id, formData))
    } else {
      setIsError(t('no-data-provided'))
    }
  }

  const clearAlert = () => {
    dispatch({ type: constants.content.EDIT_SLIDER_RESET })
    setIsError(null)
  }

  useEffect(() => {
    if (message) {
      setIsUpdateSlide(false)
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
      <Modal show={isUpdateSlide} onHide={() => setIsUpdateSlide(false)}>
        <Modal.Header>
          <Modal.Title>{t('update-slider')}</Modal.Title>
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
              {/* Slider Header */}
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('english-title')} </InputGroup.Text>
                <Form.Control
                  name='englishTitle'
                  placeholder={slide.title['en']}
                  value={data.englishTitle}
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              {/* Slider Header */}
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('arabic-title')} </InputGroup.Text>
                <Form.Control
                  placeholder={slide.title['ar']}
                  value={data.arabicTitle}
                  name='arabicTitle'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              {/* Slider Sub Header */}
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('english-text')} </InputGroup.Text>
                <Form.Control
                  placeholder={slide.text['en']}
                  value={data.englishText}
                  name='englishText'
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('arabic-text')} </InputGroup.Text>
                <Form.Control
                  placeholder={slide.text['ar']}
                  value={data.arabicText}
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

              {/* Link to article */}
              <InputGroup>
                <InputGroup.Text>{t('link-to')} </InputGroup.Text>
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
            onClick={() => setIsUpdateSlide(false)}
          >
            {t('close')}
          </Button>
          <Button size='lg' variant='success' onClick={handleSubmit}>
            {t('update')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UpdateSlider
