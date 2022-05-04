import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-bootstrap'
import style from './style.module.scss'
import { Plus } from '../../icons'

const UploadFile = ({
  setDoc,
  setBackDoc,
  setExpiryDate,
  loading,
  document,
}) => {
  const [imgSrc, setImgSrc] = useState('')
  const [docName, setDocName] = useState(null)

  const { t } = useTranslation()

  const chooseAnotherImageHandler = (_) => {
    setImgSrc(null)
    setBackDoc ? setBackDoc(null) : setDoc(null)
    setExpiryDate(null)
    setDocName(null)
  }

  const getImageFile = (e) => {
    const image = e.target.files[0]
    // CREATE IMAGE URL SRC
    const imgURL = URL.createObjectURL(image)
    setImgSrc(imgURL)
    // GET THE IMAGE NAME
    let name = image.name
    if (image.name.length > 30) {
      name = image.name.substring(0, 30) + '....'
    }
    setBackDoc ? setBackDoc(image) : setDoc(image)

    setDocName(name)
  }
  return (
    <div className={style.doc__files_upload}>
      <h3 style={{ marginTop: '3rem', fontWeight: '300' }}>
        {docName ? docName : t('upload-document', { document: t(document) })}
      </h3>

      {imgSrc ? (
        <img src={imgSrc} alt={document} width='200' />
      ) : (
        <>
          <label htmlFor={`doc-${document}`}>
            <span>
              <Plus />
            </span>
            <span>{t('click-upload-document', { document: t(document) })}</span>
          </label>

          <input
            className={style.doc__upload_input}
            type='file'
            name={document}
            id={`doc-${document}`}
            disabled={loading}
            onChange={(e) => getImageFile(e)}
          />
        </>
      )}

      {imgSrc && (
        <Button
          className='mt-2'
          variant='dark'
          onClick={chooseAnotherImageHandler}
        >
          {t('choose-another-image')}
        </Button>
      )}
    </div>
  )
}

export default UploadFile
