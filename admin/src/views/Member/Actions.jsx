import React from 'react'
import style from './style.module.scss'
import {ProfileContainer, ProfileSegment} from '../../components'

const Actions = ({data}) => {
  return (
    <div className={style.profile__actions}>
        <ProfileContainer title='Actions'>
            <ProfileSegment
            title='Account State'
            type='toggle'
            isConfirmed={data.isActive}
            memberId={data._id}
            />

            <ProfileSegment
            title='Account Color Code'
            type='color'
            color={data.color}
            memberId={data._id}
            />
        </ProfileContainer>
    </div>
  )
}

export default Actions