import React, {useEffect, useState} from 'react'
import style from './style.module.scss'
import {Button} from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import {ProfileContainer, ProfileSegment, Loader, SideAlert} from '../../components'
import actions from '../../actions'
import constants from '../../constants'

const Actions = ({data}) => {
  const [userRole, setUserRole] = useState(null)
  const {staff} = useSelector(state => state.login)
  const {member} = useSelector(state => state.member)
  const {loading, error, message} = useSelector(state => state.changeUserRole)
  const dispatch = useDispatch()

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

            {
              staff.roles.includes('manager') && 
                <div className={style.profile__role}
                style={{marginTop:'1rem'}}>
                    
                    Set Member As 
                    
                    <select 
                    name="role" 
                    id="role" 
                    style={{margin:'0 1rem'}}
                    onChange={(e) => setUserRole(e.target.value)}>
                      <option value="">......</option>
                      <option value="user">Member</option>
                      <option value="manager">Admin</option>
                      <option value="hr">Members Administrator</option>
                      <option value="cs">Complains Administrator</option>
                    </select>
                   
                   {
                     
                     loading 
                     ? <Loader 
                        size='4' 
                        options={{animation:'border'}} 
                        custom={{display:'inline-block'}}/>
                     :  <Button variant='dark' onClick={changeUserRoleHandler}>
                          Set
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