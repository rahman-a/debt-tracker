import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../../components'
import { Edit, Trash, Wrench } from '../../icons'
import actions from '../../actions'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Row = ({ user, idx }) => {
  const [toggleDelete, setToggleDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { message, error } = useSelector((state) => state.deleteUser)
  const { t } = useTranslation()
  const lang = i18next.language
  const variant = {
    '#037A12': { color: 'success', text: lang === 'ar' ? 'مؤهل' : 'OK' },
    '#fffb00': { color: 'warning', text: lang === 'ar' ? 'تحذير' : 'WARNING' },
    '#ec4a0d': { color: 'danger', text: lang === 'ar' ? 'خطر' : 'DANGER' },
  }

  const dateFormat = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  const confirmDeleteUser = (_) => {
    setToggleDelete(false)
    setIsDeleting(true)
    setTimeout(() => {
      dispatch(actions.admin.deleteUser(user._id))
    }, 500)
  }

  const initiateUserDelete = () => {
    setToggleDelete(true)
  }

  useEffect(() => {
    ;(message || error) && setIsDeleting(false)
  }, [message, error])

  return (
    <>
      <Modal show={toggleDelete} onHide={() => setToggleDelete(false)}>
        <Modal.Body>
          <div className={style.members__delete}>
            <h2>{t('are-you-sure')}</h2>
            <p>
              {t('confirm-delete-notice', {
                asset: lang === 'ar' ? 'العضو' : 'member',
              })}
            </p>
            <p>{t('undone-process')}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setToggleDelete(false)}
            variant='success'
            size='lg'
          >
            {t('cancel-btn')}
          </Button>
          <Button variant='danger' size='lg' onClick={confirmDeleteUser}>
            {t('confirm-btn', { asset: lang === 'ar' ? 'العضو' : 'member' })}
          </Button>
        </Modal.Footer>
      </Modal>
      <tr>
        <td> {idx + 1} </td>

        <td
          style={{
            backgroundColor: user.isAccountConfirmed ? '#fff' : '#dc3545',
            color: user.isAccountConfirmed ? '#1A374D' : '#fff',
          }}
        >
          {user.code}
        </td>

        <td style={{ position: 'relative' }}>
          <div className={style.members__provider}>
            {user.isProvider && (
              <span>
                <Wrench />
              </span>
            )}
            <p>
              {lang === 'ar' ? user.fullNameInArabic : user.fullNameInEnglish}
            </p>
          </div>
        </td>

        <td style={{ padding: '0' }}>
          <div className={style.members__photo}>
            <img
              src={`/api/files/${user.avatar}`}
              alt={user.fullNameInEnglish}
            />
          </div>
        </td>

        <td>
          {new Date(user.createdAt).toLocaleDateString('en-US', dateFormat)}
        </td>

        <td style={{ padding: '0' }}>
          <div className={style.members__code}>
            <Badge bg={variant[user.colorCode.code]?.color}>
              {variant[user.colorCode.code]?.text}
            </Badge>
          </div>
        </td>

        <td style={{ padding: 0 }}>
          <div className={style.members__actions}>
            <span onClick={() => navigate(`/member/${user._id}`)}>
              <Edit />
            </span>
            {isDeleting ? (
              <Loader size='4' options={{ animation: 'border' }} />
            ) : (
              <span onClick={() => initiateUserDelete(user._id)}>
                <Trash />
              </span>
            )}
          </div>
        </td>
      </tr>
    </>
  )
}

export default Row
