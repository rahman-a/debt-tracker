import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, Form, InputGroup } from 'react-bootstrap'
import { Loader, SideAlert } from '..'
import actions from '../../actions'
import constants from '../../constants'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const UpdateNews = ({ isUpdateNews, setIsUpdateNews, news }) => {
  const [data, setData] = useState({})
  const [isError, setIsError] = useState(null)
  const dispatch = useDispatch()
  const lang = i18next.language
  const { t } = useTranslation()
  const { loading, message } = useSelector((state) => state.updateContent)

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setData({ ...data, [name]: files[0] })
      return
    }
    setData({ ...data, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = {
      en: news.body.en,
      ar: news.body.ar,
    }
    const name = {
      en: news.name?.en,
      ar: news.name?.ar,
    }
    data.englishBody && (body.en = data.englishBody)
    data.arabicBody && (body.ar = data.arabicBody)
    data.englishName && (name.en = data.englishName)
    data.arabicName && (name.ar = data.arabicName)

    const formData = new FormData()
    formData.append('body', JSON.stringify(body))
    formData.append('name', JSON.stringify(name))
    formData.append('type', 'news')
    data.image && formData.append('image', data.image)
    if (Object.values(data).length > 0) {
      dispatch(actions.content.updateContent(news.type, news._id, formData))
    } else {
      setIsError(t('no-data-provided'))
    }
  }

  const clearAlert = () => {
    dispatch({ type: constants.content.UPDATE_CONTENT_RESET })
    setIsError(null)
  }

  useEffect(() => {
    if (message) {
      setIsUpdateNews(false)
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
      <Modal show={isUpdateNews} onHide={() => setIsUpdateNews(false)}>
        <Modal.Header>
          <Modal.Title>{t('update-news')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={style.news__one}>
            {loading && (
              <div className={style.news__overlay}>
                <Loader size='5' center options={{ animation: 'border' }} />
              </div>
            )}
            <Form>
              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('english-body')} </InputGroup.Text>
                <Form.Control
                  placeholder={news?.body['en']}
                  value={data.englishBody}
                  name='englishBody'
                  as='textarea'
                  row={3}
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

              <InputGroup className='mb-3'>
                <InputGroup.Text> {t('arabic-body')} </InputGroup.Text>
                <Form.Control
                  placeholder={news?.body['ar']}
                  value={data.arabicBody}
                  name='arabicBody'
                  as='textarea'
                  row={3}
                  onChange={(e) => handleInputChange(e)}
                />
              </InputGroup>

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
            </Form>

            <InputGroup className='mb-3'>
              <InputGroup.Text> {t('english-name')} </InputGroup.Text>
              <Form.Control
                name='englishName'
                placeholder={news?.name?.en}
                onChange={(e) => handleInputChange(e)}
              />
            </InputGroup>
            <InputGroup className='mb-3'>
              <InputGroup.Text> {t('arabic-name')} </InputGroup.Text>
              <Form.Control
                name='arabicName'
                placeholder={news?.name?.ar}
                onChange={(e) => handleInputChange(e)}
              />
            </InputGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size='lg'
            variant='secondary'
            onClick={() => setIsUpdateNews(false)}
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

export default UpdateNews
