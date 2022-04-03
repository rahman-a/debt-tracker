import React from 'react'
import style from './style.module.scss'
import {v4 as uuidv4} from 'uuid'
import {ProfileContainer, DocumentSegment} from '../../components'

const Documents = ({data}) => { 
    return (
        <div className={style.profile__documents}>
            <ProfileContainer title='verification-document'>
                <div className={style.profile__documents_wrapper}>
                    {data && data.map(doc => (
                        doc.file.image 
                        ? (
                            <DocumentSegment 
                                key={uuidv4()}
                                img={`api/files/${doc.file.image}`}
                                isExpired={doc.file.isExpired ? doc.file.isExpired :''}
                                document={doc.type}/>
                        )
                        : (
                            <DocumentSegment 
                                key={uuidv4()}
                                document={doc.type}/> 
                        )
                    ))}
                </div>
            </ProfileContainer>
        </div>
    )
}

export default Documents
