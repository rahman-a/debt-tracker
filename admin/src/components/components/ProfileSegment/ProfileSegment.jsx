import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {v4 as uuidv4} from 'uuid'
import {useSelector, useDispatch} from 'react-redux'

import {Loader} from '../../components'
import { Edit, ArrowRight, Plus} from '../../icons'
import actions from '../../actions'



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
    const [isPhoneEdit, setIsPhoneEdit]  = useState(false)
    const [isAddressEdit, setIsAddressEdit] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editError, setEditError] = useState(null)
    const [passSuccess, setPassSuccess] = useState(null)
    const [addressSuccess, setAddressSuccess] = useState(null)
    const [phoneSuccess, setPhoneSuccess] = useState(null)
    const dispatch = useDispatch()
    
    const {loading, error, message} = useSelector(state => state.updatePassword)
    const {user} = useSelector(state => state.userProfile)
    
    const {
        loading:info_loading, 
        error:info_error, 
        isDone
    } = useSelector(state => state.registerInfo)

    const submitDataHandler = _ => {
       type === 'outPhones' && setIsPhoneEdit(true)
       type === 'outAddress' && setIsAddressEdit(true)
       type === 'password' 
       ? dispatch(actions.users.updatePassword({password:info}))
       : type === 'outAddress'
       ? dispatch(actions.users.registerInfo(
           user._id, {outsideAddress:info}
        ))
       : type === 'outPhones'
       && dispatch(actions.users.registerInfo(
           user._id, {outsidePhones:[...user.outsidePhones, info]}
        ))
    }

    useEffect(() => {
        if(loading || info_loading ) {
            setIsSubmitting(loading || info_loading)
        }
        if(error || info_error) {
            setEditError(error || info_error)
        }
        if(message ||isDone) {
            message 
            ? setPassSuccess(message)
            : isDone && isAddressEdit
            ? setAddressSuccess(`${title} has been added`)
            : isDone && isPhoneEdit
            && setPhoneSuccess(`${title} has been added`)
            
            setIsSubmitting(false)
            setEditError(null)
        }
    },[loading, error,message, info_loading,info_error, isDone])
    
    return (
        <div className={style.segment}>
            <h3>
                {title}
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
            && <div className={style.segment__edit}>
                
                <input 
                type={type} 
                placeholder={placeholder}
                onChange={(e) => setInfo(e.target.value)}/>
                
                {
                    isSubmitting 
                    ? <Loader size='4' options={{animation:'border'}}/>
                    : <button onClick={submitDataHandler}> <ArrowRight/> </button> 
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
