import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {v4 as uuidv4} from 'uuid'
import {ProfileContainer, DocumentSegment} from '../../components'

const Documents = ({data}) => {
    const [documents, setDocuments] = useState([])
    
    const createDocuments = _ => {
        const allDocuments = []
        for(let d in data) {
            data[d]?.image
           ? allDocuments.push(
                <DocumentSegment 
                key={uuidv4()} 
                img={`api/files/${data[d].image}`}
                isExpired={data[d].isExpired ? data[d].isExpired :''}
                document={d}/>
            )
           : allDocuments.push(
                <DocumentSegment 
                key={uuidv4()}
                document={d}/>
            )

        }
        setDocuments(allDocuments)
    }


    useEffect(() => {
      createDocuments()
    },[data])
    
    return (
        <div className={style.profile__documents}>
            <ProfileContainer title='verification-document'>
                <div className={style.profile__documents_wrapper}>
                    {documents}
                </div>
            </ProfileContainer>
        </div>
    )
}

export default Documents
