import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { ProfileContainer, DocumentSegment } from '../../components'
import i18next from 'i18next'

const Documents = ({ data }) => {
  const [documents, setDocuments] = useState([])
  const lang = i18next.language

  const createDocuments = (_) => {
    const allDocuments = []
    for (let d in data) {
      data[d]?.image
        ? allDocuments.push(
            <DocumentSegment
              key={data[d]._id}
              img={`api/files/${data[d].image}`}
              isExpired={data[d].isExpired ? data[d].isExpired : ''}
              document={d}
            />
          )
        : allDocuments.push(<DocumentSegment key={data[d]._id} document={d} />)
    }
    setDocuments(allDocuments)
  }

  useEffect(() => {
    createDocuments()
  }, [data])

  return (
    <div
      className={`${style.profile__documents} ${
        lang === 'ar' ? style.profile__documents_ar : ''
      }`}
    >
      <ProfileContainer title='verification-document'>
        <div className={style.profile__documents_wrapper}>{documents}</div>
      </ProfileContainer>
    </div>
  )
}

export default Documents
