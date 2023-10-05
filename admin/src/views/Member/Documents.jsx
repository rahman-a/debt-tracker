import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import i18next from 'i18next'
import classnames from 'classnames'
import { ProfileContainer, DocumentSegment } from '@/src/components'

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
              img={`/api/files/${data[d].image}`}
              isExpired={data[d].isExpired ? data[d].isExpired : ''}
              document={d}
            />
          )
        : allDocuments.push(<DocumentSegment key={data[d]._id} document={d} />)
    }
    setDocuments(allDocuments)
  }

  const profileDocumentsClasses = classnames(style.profile__documents, {
    [style.profile__documents_ar]: lang === 'ar',
  })

  useEffect(() => {
    createDocuments()
  }, [data])

  return (
    <div className={profileDocumentsClasses}>
      <ProfileContainer title='verification-document'>
        <div className={style.profile__documents_wrapper}>{documents}</div>
      </ProfileContainer>
    </div>
  )
}

export default Documents
