import React, {useState} from 'react'
import style from './style.module.scss'
import {Loader} from '../../components'
import { Edit, ArrowRight, Plus} from '../../icons'

const ProfileSegment = ({title, text, type, placeholder}) => {
    const [isEdit, setIsEdit] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    
    const submitDataHandler = _ => {
        setIsSubmit(true)
        setTimeout(() => {
            setIsSubmit(false)
        },1000)
    }
    
    return (
        <div className={style.segment}>
            <h3>
                {title}
                {
                    type === 'password' && 
                    <span onClick={() => setIsEdit(prev => !prev)}><Edit/></span>
                }
                {
                    type && type !== 'password' && 
                    <span onClick={() => setIsEdit(prev => !prev)}><Plus/></span>
                }
            </h3>
            <p>{text}</p>
            {isEdit && <div className={style.segment__edit}>
                <input type={type} placeholder={placeholder}/>
                {isSubmit ? <Loader size='4' options={{animation:'border'}}/>
                : <button onClick={submitDataHandler}> <ArrowRight/> </button> }
                {/* <span>Password has changed successfully</span> */}
            </div>}
        </div>
    )
}

export default ProfileSegment
