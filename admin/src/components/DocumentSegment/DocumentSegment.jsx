import React, {useState} from 'react'
import style from './style.module.scss'
import {Badge} from 'react-bootstrap'
import ExpiredImageContainer from './ExpiredImageContainer'
import ImageContainer from './ImageContainer'
import {useTranslation } from 'react-i18next'
import i18next from 'i18next'

const DocumentSegment = ({ img, document, isExpired }) => {
  const [imageContainer, setImageContainer] = useState(false)
  const {t} = useTranslation()
  const lang = i18next.language
  return (
    <>
     {
       imageContainer && 
        <ImageContainer
        img={img}
        document={document}
        imageContainer={imageContainer}
        setImageContainer={setImageContainer}
        />
     } 

      <div className={style.segment}>
        {img && !isExpired ? (
          <div className={style.segment__doc}
          onClick={() => setImageContainer(true)}>
            <img src={img} alt={document} />
            <p>{
            lang === 'ar'
            ? `${t('document')} ${t(document)}`
            : `${t(document)} ${t('document')}`  
            }</p>
          </div>
        ) : (
          <div className={style.segment__block} >
           
            {
              isExpired 
              ?  <ExpiredImageContainer img={img} document={document}/>
              :  <Badge bg='danger'> {t('not-provided')} </Badge>
            }
           
            <p>{
               lang === 'ar'
               ? `${t('document')} ${t(document)}`
               : `${t(document)} ${t('document')}`
              }</p>
          </div>
        )}
      </div>
    </>
  )
}

export default DocumentSegment
