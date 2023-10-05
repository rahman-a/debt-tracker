// @ts-nocheck
import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import constants from '@/src/constants'
import { Plus } from '@/src/icons'
import { UpdateDocument, Loader } from '@/src/components'
import ImageContainer from './ImageContainer'

const DocumentSegment = ({ img, document, isExpired, isEmployee }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [isImage, setIsImage] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const { isDone } = useSelector((state) => state.updateDocuments)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    if (isDone) {
      setLoadingState(false)
      setTimeout(() => {
        dispatch({ type: constants.users.DOCUMENT_UPDATE_RESET })
      }, 250)
    }
  }, [isDone])

  return (
    <>
      <UpdateDocument
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setLoadingState={setLoadingState}
        document={document}
      />

      <ImageContainer
        img={img}
        document={document}
        isImage={isImage}
        setIsImage={setIsImage}
      />
      <div className={style.segment}>
        {img && !isExpired ? (
          <div className={style.segment__doc} onClick={() => setIsImage(true)}>
            <img src={img} alt={document} />
            <p>{t(document)}</p>
          </div>
        ) : (
          <div
            className={style.segment__block}
            onClick={() =>
              !loadingState && document !== 'identity-back' && setIsEdit(true)
            }
          >
            <div className={style.segment__block_action}>
              {loadingState ? (
                <Loader size='5' center options={{ animation: 'border' }} />
              ) : (
                <>
                  <span>{document !== 'identity-back' && <Plus />}</span>
                  <span>
                    {document !== 'identity-back'
                      ? t('upload') +
                        ' ' +
                        t(document === 'identity-front' ? 'identity' : document)
                      : t(document)}
                  </span>
                </>
              )}
            </div>
            <p>{t(document)}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default DocumentSegment
