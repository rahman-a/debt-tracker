import React, {useEffect, useState} from 'react'
import style from './style.module.scss'
import {Button} from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import {ProfileContainer, ProfileSegment, Loader, SideAlert} from '../../components'
import actions from '../../actions'
import constants from '../../constants'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Actions = ({data}) => {
  const [userRole, setUserRole] = useState(null)
  const {staff} = useSelector(state => state.login)
  const {member} = useSelector(state => state.member)
  const {loading, error, message} = useSelector(state => state.changeUserRole)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const lang = i18next.language

  const changeUserRoleHandler = _ => {
      dispatch(actions.admin.changeUserRole(member._id, userRole))
  }

  useEffect(() => {
    return () => dispatch({type: constants.admin.USER_ROLE_CHANGE_RESET})
  },[])
  
  return (
    <>
    
    <SideAlert
    text={message}
    isOn={message ? true : false}
    type='success'
    />

    <SideAlert
    text={error}
    isOn={error ? true : false}
    type='danger'
    />

      <div className={style.profile__actions}>
          <ProfileContainer title='profile-setting'>
              <ProfileSegment
              title='account-state'
              type='toggle'
              isConfirmed={data.isActive}
              memberId={data._id}
              />

              <ProfileSegment
              title='account-color-code'
              type='color'
              color={data.color}
              memberId={data._id}
              />

            {
              staff.roles.includes('manager') && 
                <div className={style.profile__role}
                style={{marginTop:'1rem'}}>
                    
                    {t('set-member-as')}
                    
                    <select 
                    name="role" 
                    id="role" 
                    style={{margin:'0 1rem'}}
                    onChange={(e) => setUserRole(e.target.value)}>
                      <option value="">......</option>
                      <option value="user">{t('member')}</option>
                      <option value="manager">{t('admin')}</option>
                      <option value="hr">{t('members-admin')}</option>
                      <option value="cs">{t('complains-admin')}</option>
                    </select>
                   
                   {
                     
                     loading 
                     ? <Loader 
                        size='4' 
                        options={{animation:'border'}} 
                        custom={{display:'inline-block'}}/>
                     :  <Button variant='dark' onClick={changeUserRoleHandler}>
                          {t('set')}
                        </Button>
                   }
                    
                </div>
            } 
          </ProfileContainer>
      </div>
    </>
  )
}

export default Actions