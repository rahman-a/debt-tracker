import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Form, Button, Row, Col, InputGroup, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../actions'
import constants from '../../constants'
import { Loader, SideAlert } from '../../components'
import { useTranslation } from 'react-i18next'
import CreateSocial from './CreateSocial'

const SocialMedia = () => {
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [isCreate, setIsCreate] = useState(false)
  const { loading, socials } = useSelector((state) => state.listSocials)
  const { error: createError } = useSelector((state) => state.createSocial)

  const { error: deleteError, message } = useSelector(
    (state) => state.deleteSocial
  )

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const deleteContentHandler = (e, id) => {
    e.preventDefault()
    setDeleteLoading(id)
    dispatch(actions.content.deleteSocial(id))
  }

  const clearContent = () => {
    dispatch({ type: constants.content.DELETE_SOCIAL_RESET })
  }

  useEffect(() => {
    dispatch(actions.content.listSocial())
    return () => {
      clearContent()
    }
  }, [])

  useEffect(() => {
    message && setDeleteLoading(null)
  }, [message])

  if (loading) {
    return <Loader size='5' center options={{ animation: 'border' }} />
  }

  return (
    <>
      <SideAlert
        isOn={deleteError ? true : false}
        text={deleteError}
        type='danger'
        reset={() => clearContent()}
      />

      <SideAlert
        isOn={createError ? true : false}
        text={createError}
        type='danger'
      />

      <CreateSocial isCreate={isCreate} setIsCreate={setIsCreate} />

      <div className={style.social}>
        <Button
          variant='dark'
          size='lg'
          className='mb-3'
          onClick={() => setIsCreate(true)}
        >
          {' '}
          {t('add-new-social')}{' '}
        </Button>
        <Form>
          {socials?.length > 0 &&
            socials.map((social) => (
              <Row key={social._id}>
                <Col xs={11}>
                  <InputGroup className='mb-3'>
                    <InputGroup.Text id={social.name}>
                      {social.name.toLocaleUpperCase()}
                    </InputGroup.Text>
                    <Form.Control
                      size='lg'
                      disabled
                      placeholder={social.link}
                      aria-label={social.name}
                      aria-describedby={social.name}
                    />
                  </InputGroup>
                </Col>
                <Col xs={1}>
                  {deleteLoading === social._id ? (
                    <Loader size='4' options={{ animation: 'border' }} />
                  ) : (
                    <Button
                      size='lg'
                      variant='danger'
                      onClick={(e) => deleteContentHandler(e, social._id)}
                    >
                      {t('delete')}
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
        </Form>
      </div>
    </>
  )
}

export default SocialMedia
