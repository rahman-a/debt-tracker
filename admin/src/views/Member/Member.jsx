import React, {useEffect, useState} from 'react'
import style from './style.module.scss'
import {useParams} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {Loader, HeaderAlert, BackButton} from '../../components'
import actions from '../../actions'
import Personal from './Personal'
import Address from './Address'
import Phone from './Phone'
import Documents from './Documents'
import Company from './Company'
import Actions from './Actions'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const Profile = () => {
    const {loading, error, member} = useSelector(state => state.member)
    const {staff} = useSelector(state => state.login)
    const dispatch = useDispatch()
    const {id} = useParams()
    const {t} = useTranslation()
    const lang = i18next.language
    useEffect(() => {
        id && dispatch(actions.admin.member(id))
    },[id])
    return (
        <div className={style.profile}>
            
           {
               !(staff.roles.includes('cs')) &&
                
                <BackButton
                page='members'
                text={t('back-to', {page:lang === 'ar' ? 'صفحة الأعضاء' :'Members'})}
                />    
           } 
            <div className="container">
                {
                    loading
                    ? <Loader size='25' center options={{animation:'border'}}/>
                    : error 
                    ? <HeaderAlert type='danger' text={error}/>
                    : member
                    && <div className={style.profile__wrapper}>
                        <Personal data={{
                            code:member.code,
                            color:member.colorCode,
                            avatar:member.avatar,
                            fullName: lang === 'ar' ? member.fullNameInArabic : member.fullNameInEnglish,
                            username:member.username,
                            isProvider:member.isProvider,
                            emails:member.emails
                        }}/>
                        <Phone data={{
                            insidePhones:member.insidePhones,
                            outsidePhones:member.outsidePhones
                        }}/>
                        <Address data={{
                            insideAddress:member.insideAddress,
                            outsideAddress:member.outsideAddress,
                            country:member.country
                        }}/>
                        <Documents data={{
                            identity:member.identity,
                            passport:member.passport,
                            residential:member.residential,
                            snapshot:member.verificationImage
                        }}/>
                        <Company company={member.company}/>
                        {
                            !(staff.roles.includes('cs')) && 
                                <Actions
                                data = {{
                                    _id:member._id,
                                    color:member.colorCode.code, 
                                    isActive:member.isAccountConfirmed
                                }}
                                />
                        }       
                    </div>   
                } 
            </div>
            
        </div>
    )
}

export default Profile
