import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Form, Button, Card, InputGroup, FormControl } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import actions from '../../actions'
import constants from '../../constants'
import { Loader, SideAlert } from '../../components'
import AboutItem from './AboutItem'
import UpdateItem from './UpdateItem'
import i18next from 'i18next'

const AboutCompany = () => {
  const [headline, setHeadline] = useState({})
  const [link, setLink] = useState('')
  const [isShow, setIsShow] = useState(false)
  const [isError, setIsError] = useState(null)
  const [itemId, setItemId] = useState(null)
  const [isItemUpdate, setIsItemUpdate] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = i18next.language

  const { loading, error, message } = useSelector(
    (state) => state.createHeadline
  )

  const { content, loading: get_loading } = useSelector(
    (state) => state.getAboutContent
  )

  const {
    message: updateMessage,
    loading: updateLoading,
    error: updateError,
  } = useSelector((state) => state.updateHeadline)

  const { loading: deleteLoading, error: deleteError } = useSelector(
    (state) => state.deleteAboutItem
  )

  const clearContent = () => {
    dispatch({ type: constants.content.CREATE_ABOUT_RESET })
    dispatch({ type: constants.content.UPDATE_ABOUT_HEADLINE_RESET })
    setIsError(null)
    setSuccessMessage(null)
  }

  const createHeadlineHandler = (e) => {
    e.preventDefault()
    dispatch(
      actions.about.createContent({ headline: JSON.stringify(headline), link })
    )
  }

  const deleteAboutItem = (id) => {
    dispatch(actions.about.deleteAboutItem(id))
  }

  const updateContentHandler = (e) => {
    e.preventDefault()

    const header = {
      en: headline['en'] ? headline['en'] : content.header.en,
      ar: headline['ar'] ? headline['ar'] : content.header.ar,
    }

    const targetLink = link ? link : content.link

    dispatch(
      actions.about.updateHeadline(content._id, {
        headline: JSON.stringify(header),
        link: targetLink,
      })
    )
  }

  const initiateItemUpdate = (id) => {
    setItemId(id)
    setIsItemUpdate(true)
  }

  useEffect(() => {
    error && setIsError(error)
    updateError && setIsError(updateError)
  }, [error, updateError])

  useEffect(() => {
    message && setSuccessMessage(message)
    updateMessage && setSuccessMessage(updateMessage)
  }, [message, updateMessage])

  useEffect(() => {
    dispatch(actions.about.getAboutContent())
  }, [])
  return (
    <>
      <AboutItem show={isShow} setIsShow={setIsShow} id={content?._id} />
      {itemId && (
        <UpdateItem
          id={itemId}
          setIsShow={setIsItemUpdate}
          show={isItemUpdate}
        />
      )}
      <SideAlert
        isOn={successMessage ? true : false}
        text={successMessage}
        type='success'
        reset={() => clearContent()}
      />
      <SideAlert
        isOn={isError ? true : false}
        text={isError}
        type='danger'
        reset={() => clearContent()}
      />
      <div className={style.about}>
        <Button
          className='mb-3'
          size='lg'
          variant='dark'
          disabled={content ? false : true}
          onClick={() => setIsShow(true)}
        >
          New Item
        </Button>
        <Form>
          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label>English Headline</Form.Label>
            <Form.Control
              name='en'
              as='textarea'
              placeholder={
                content ? content.header['en'] : 'Enter headline in English'
              }
              rows={3}
              onChange={(e) =>
                setHeadline({ ...headline, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea2'>
            <Form.Label>Arabic Headline</Form.Label>
            <Form.Control
              name='ar'
              as='textarea'
              placeholder={
                content ? content.header['ar'] : 'Enter headline in Arabic'
              }
              rows={3}
              onChange={(e) =>
                setHeadline({ ...headline, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <InputGroup className='mb-3'>
            <InputGroup.Text id='basic-addon1'>Link to </InputGroup.Text>
            <FormControl
              size='lg'
              placeholder={content ? content.link : 'Enter article link'}
              aria-label='learn more'
              name='link'
              aria-describedby='basic-addon1'
              onChange={(e) => setLink(e.target.value)}
            />
          </InputGroup>
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
                onClick={createHeadlineHandler}
              >
                {t('save')}
              </Button>
            )}
            {(loading || updateLoading) && (
              <Loader size='4' options={{ animation: 'border' }} />
            )}
          </div>
        </Form>
        <div className={style.about__items}>
          {content &&
            content.items.map((item, index) => (
              <Card
                style={{ width: '25rem', cursor: 'pointer' }}
                key={item._id}
              >
                <Card.Body>
                  <Card.Title>{item.title[lang]}</Card.Title>
                  <Card.Text style={{ fontSize: '1.4rem' }}>
                    {item.body[lang]}
                  </Card.Text>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      variant='primary'
                      style={{ margin: '1rem' }}
                      onClick={() => initiateItemUpdate(item._id)}
                    >
                      Edit
                    </Button>
                    {deleteLoading ? (
                      <Loader size='4' options={{ animation: 'border' }} />
                    ) : (
                      <Button
                        variant='danger'
                        onClick={() => deleteAboutItem(item._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))}
        </div>
      </div>
    </>
  )
}

export default AboutCompany
