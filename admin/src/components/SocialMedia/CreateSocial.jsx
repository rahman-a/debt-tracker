import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import actions from '../../actions'
import { Loader } from '../../components'
import constants from '../../constants'
import { useTranslation } from 'react-i18next'

const CreateSocial = ({ isCreate, setIsCreate }) => {
  const [link, setLink] = useState(null)
  const [platform, setPlatform] = useState(null)
  const dispatch = useDispatch()
  const { loading, message } = useSelector((state) => state.createSocial)

  const { t } = useTranslation()

  const createSocialHandler = () => {
    const data = {
      name: platform,
      link,
    }
    if (link && platform) {
      dispatch(actions.content.createSocial(data))
    }
  }

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setIsCreate(false)
        dispatch({ type: constants.content.CREATE_SOCIAL_RESET })
      }, 250)
    }
  }, [message])

  return (
    <Modal show={isCreate} onHide={setIsCreate}>
      <Modal.Header>
        <Modal.Title>{t('add-new-social')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className={style.social__overlay}>
            <Loader size='5' center options={{ animation: 'border' }} />
          </div>
        )}
        <Form>
          <Form.Group controlId='formBasicLink' className='mb-3'>
            <Form.Label>{t('platform-name')}</Form.Label>
            <Form.Select
              size='lg'
              style={{ direction: 'ltr' }}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value=''>.......</option>
              <option value='facebook'>Facebook</option>
              <option value='twitter'>Twitter</option>
              <option value='instagram'>Instagram</option>
              <option value='youtube'>Youtube</option>
              <option value='linkedin'>Linkedin</option>
              <option value='whatsup'>WhatsUp</option>
            </Form.Select>
          </Form.Group>
          <InputGroup className='mb-3'>
            <InputGroup.Text id='basic-addon1'>
              {t('social-link')}
            </InputGroup.Text>
            <Form.Control
              onChange={(e) => setLink(e.target.value)}
              size='lg'
              placeholder={t('social-link')}
              aria-label='social'
              aria-describedby='basic-addon1'
            />
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button size='lg' variant='success' onClick={createSocialHandler}>
          {t('save')}
        </Button>
        <Button size='lg' variant='danger' onClick={() => setIsCreate(false)}>
          {t('cancel-btn')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateSocial
