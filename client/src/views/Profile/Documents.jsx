import React from 'react'
import style from './style.module.scss'
import {ProfileContainer, DocumentSegment} from '../../components'

const Documents = () => {
    return (
        <div className={style.profile__documents}>
            <ProfileContainer title='verification documents'>
                <div className={style.profile__documents_wrapper}>
                    <DocumentSegment img='/images/identity.png' document='identity'/>
                    <DocumentSegment document='passport'/>
                    <DocumentSegment img='/images/identity.png' document='residential'/>
                </div>
            </ProfileContainer>
        </div>
    )
}

export default Documents
