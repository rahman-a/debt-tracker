import React, {useEffect} from 'react'
import style from './style.module.scss'

import Personal from './Personal'
import Address from './Address'
import Phone from './Phone'
import Documents from './Documents'
import Company from './Company'
import Social from './social'

import {Loader, HeaderAlert} from '../../components'

import {useSelector, useDispatch} from 'react-redux'
import actions from '../../actions'


const Profile = () => {
    const {loading, error, user} = useSelector(state => state.userProfile)
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(actions.users.getUserProfile())
    },[])
    return (
        <div className={style.profile}>
            <div className="container">
                {
                    loading
                    ? <Loader size='25' center options={{animation:'border'}}/>
                    : error 
                    ? <HeaderAlert type='danger' text={error}/>
                    : user
                    && <div className={style.profile__wrapper}>
                        <Personal data={{
                            code:user.code,
                            color:user.colorCode,
                            avatar:user.avatar,
                            fullName:user.fullName,
                            username:user.username,
                            emails:user.emails
                        }}/>
                        <Phone data={{
                            insidePhones:user.insidePhones,
                            outsidePhones:user.outsidePhones
                        }}/>
                        <Address data={{
                            insideAddress:user.insideAddress,
                            outsideAddress:user.outsideAddress,
                            country:user.country
                        }}/>
                        <Documents data={{
                            identity:user.identity,
                            passport:user.passport,
                            residential:user.residential
                        }}/>
                        <Company company={user.company}/>
                        <Social/>
                    </div>   
                } 
            </div>
            
        </div>
    )
}

export default Profile
