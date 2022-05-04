import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Modal, Alert, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import actions from '../../actions'
import { Times, Plus } from '../../icons'
import { DateInput } from '../../components'
import constants from '../../constants'
import UploadFile from './UploadFile'

const UpdateDocument = ({ isEdit, setIsEdit, setLoadingState, document }) => {
  const [errors, setErrors] = useState(null)
  const [expiryDate, setExpiryDate] = useState(null)
  const [doc, setDoc] = useState(null)
  const [backDoc, setBackDoc] = useState(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.userProfile)
  const { loading, error, isDone } = useSelector(
    (state) => state.updateDocuments
  )
  const { t } = useTranslation()

  const uploadDocHandler = (e) => {
    if (!expiryDate) {
      setErrors(t('provide-expiry-date'))
      return
    }

    if (!doc) {
      setErrors(t('provide-document', { document: t(document) }))
      return
    }
    if (!backDoc && document === 'identity-front') {
      setErrors(t('provide-document', { document: t('identity-back') }))
      return
    }
    const docType = document === 'passport' ? 'passport' : 'identity'
    const dateObj = { [docType]: expiryDate.toISOString() }
    const JSONDate = JSON.stringify(dateObj)

    const data = new FormData()
    data.append([document], doc)
    document === 'identity-front' && data.append('identity-back', backDoc)
    data.append('expireAt', JSONDate)
    dispatch(actions.users.updateDocuments(user._id, data, docType))
    setTimeout(() => {
      setLoadingState(true)
      setIsEdit(false)
    }, 100)
  }

  useEffect(() => {
    error && setErrors(error)
    isDone && dispatch({ type: constants.users.DOCUMENT_UPDATE_RESET })
  }, [error, isDone])

  return (
    <>
      <Modal show={isEdit} onHide={() => setIsEdit(false)}>
        <div className={style.doc__upload}>
          <span className={style.doc__close} onClick={() => setIsEdit(false)}>
            <Times />
          </span>

          <div style={{ width: '30rem' }}>
            {isDone && (
              <Alert variant='success'>
                {t('success-upload', { document: t(document) })}
              </Alert>
            )}

            {errors && (
              <Alert
                variant='danger'
                className='text-center'
                onClose={() => setErrors(null)}
                dismissible
              >
                {errors}
              </Alert>
            )}

            <h3 style={{ fontWeight: '300' }}>
              {expiryDate
                ? t('expiry-date', { date: expiryDate.toDateString() })
                : t('choose-expiry-date')}
            </h3>

            <DateInput
              name={document}
              disabled={loading}
              getExpiryDate={(date) => setExpiryDate(date)}
            />
            <div className={style.doc__files}>
              <UploadFile
                setDoc={setDoc}
                setExpiryDate={setExpiryDate}
                document={document}
                loading={loading}
              />
              {document === 'identity-front' && (
                <UploadFile
                  setBackDoc={setBackDoc}
                  setExpiryDate={setExpiryDate}
                  document='identity-back'
                  loading={loading}
                />
              )}
            </div>

            <Button
              variant='warning'
              size='lg'
              className='mt-4'
              onClick={uploadDocHandler}
            >
              {t('upload-document-btn')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default UpdateDocument
