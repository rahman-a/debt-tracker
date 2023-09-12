import React from 'react'
import style from './style.module.scss'
import { useSelector } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import Scrollbar from 'simplebar-react'
import { useTranslation } from 'react-i18next'
import SearchInput from './searchInput'
import User from './User'
import Loader from '@/src/components/Loader/Loader'
import { BrokenHeart } from '@/src/icons'

const NewChat = ({ isNewChat, setIsNewChat }) => {
  const { loading, error, users } = useSelector((state) => state.createNewChat)
  const { t } = useTranslation()
  let Component = null
  if (loading) {
    Component = (
      <div className={style.sidebar__loading}>
        <Loader size='4' center options={{ animation: 'border' }} />
      </div>
    )
  } else if (error) {
    Component = (
      <div className={style.sidebar__fallback}>
        <span>
          <BrokenHeart />
        </span>
        <p>{error}</p>
        <p>{t('no-result')}</p>
      </div>
    )
  } else if (users && users.length > 0) {
    Component = users.map((user) => (
      <User key={user._id} user={user} onClick={() => setIsNewChat(false)} />
    ))
  }
  return (
    <Modal show={isNewChat} onHide={() => setIsNewChat(false)} centered>
      <Modal.Header>
        <Modal.Title>{t('new-chat')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchInput newChat={true} placeholder={t('create-new-chat')} />
        <div className={style.sidebar__body}>
          <Scrollbar style={{ maxHeight: 'calc(100vh - 25.2rem)' }}>
            {Component}
          </Scrollbar>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size='lg'
          variant='secondary'
          onClick={() => setIsNewChat(false)}
        >
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewChat
