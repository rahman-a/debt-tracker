import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {v4 as uuidv4} from 'uuid'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'

import {Loader} from '../../components'
import { Edit, ArrowRight, Plus, ArrowLeft} from '../../icons'
import actions from '../../actions'
import i18next from 'i18next'



const Country = ({country}) => {
    return (
        <span style={{flexDirection:'row'}}>
            <img 
            src={country.image} 
            alt={country.name} 
            width='25'
            style={{marginRight:'1rem'}}/>
            {`${country.abbr} ${country.name}`}
        </span>
    )
}

const ProfileSegment = ({title, text, type, placeholder}) => {
    const [info, setInfo] = useState(null)
    const [updatedAsset, setUpdatedAsset] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editError, setEditError] = useState(null)
    const [passSuccess, setPassSuccess] = useState(null)
    const [addressSuccess, setAddressSuccess] = useState(null)
    const [phoneSuccess, setPhoneSuccess] = useState(null)
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const lang = i18next.language

    const {loading, error, message} = useSelector(state => state.updatePassword)
    const {user} = useSelector(state => state.userProfile)
    
    const {
        loading:info_loading, 
        error:info_error, 
        isDone
    } = useSelector(state => state.updateAddressAndPhone)

    const submitDataHandler = _ => {
       setUpdatedAsset(type)
       type === 'password' 
       ? dispatch(actions.users.updatePassword({password:info}))
       : type === 'outAddress'
       ? dispatch(actions.users.updateAddressAndPhone(
           user._id, {outsideAddress:info}
        ))
       : type === 'outPhones'
       && dispatch(actions.users.updateAddressAndPhone(
           user._id, {outsidePhones:[...user.outsidePhones, info]}
        ))
    }

    useEffect(() => {
        if(loading || info_loading ) {
            setIsSubmitting(loading || info_loading)
        }
    },[loading, info_loading])

    useEffect(() => {
        if(error || info_error) {
            setEditError(error || info_error)
        }
    },[error, info_error])

    useEffect(() => {
        message && setPassSuccess(t('pass-updated'))
    },[message])

    useEffect(() => {
        if(isDone) {
            updatedAsset === 'outAddress' 
            ? setAddressSuccess(t('address-added', {title:t(title)}))
            : updatedAsset === 'outPhones' 
            && setPhoneSuccess(t('phone-added', {title:t(title)}))
            setIsSubmitting(false)
            setEditError(null)
        }
    },[isDone, updatedAsset])
        
    return (
        <div className={`${style.segment} ${lang === 'ar' ? style.segment_ar :''}`}>
            <h3>
                {t(title)}
                {
                    type === 'password' && 
                    <span onClick={() => setIsEdit(prev => !prev)}><Edit/></span>
                }
                {
                    type && (type === 'outPhones' || type !== 'password') && placeholder &&
                    <span onClick={() => setIsEdit(prev => !prev)}><Plus/></span>
                }
            </h3>
            
            <p>
                {
                  (type === 'email' || type === 'phones')
                  ? text.map(t => <span key={t._id}>{t.email || t.phone}</span>)
                  : type === 'outPhones' && text
                  ? text.map(t => <span key={uuidv4()}>{t}</span>)
                  : type === 'country'
                  ? <Country country={text}/>
                  : text
                }
            </p>
            
            {isEdit 
            && <div className={`${style.segment__edit} ${lang === 'ar' ? style.segment__edit_ar :''}`}>
                
                <input 
                type={type} 
                placeholder={t(placeholder)}
                onChange={(e) => setInfo(e.target.value)}/>
                
                {
                    isSubmitting && updatedAsset === type
                    ? <Loader size='4' options={{animation:'border'}}/>
                    : <button onClick={submitDataHandler}>
                        {lang === 'ar' ? <ArrowLeft/> : <ArrowRight/> } 
                     </button> 
                }
                
                { 
                 passSuccess && type === 'password'
                 ? <span>{passSuccess}</span>
                 : addressSuccess && type === 'outAddress'
                 ? <span>{addressSuccess}</span>
                 : phoneSuccess && type === 'outPhones'
                 && <span>{phoneSuccess}</span>
                
                }
                
                { editError && <span style={{color:'#f93d3d'}}> {editError} </span> }

            </div>}
        </div>
    )
}

export default ProfileSegment
