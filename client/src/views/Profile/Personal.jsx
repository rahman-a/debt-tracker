import React, {useState} from 'react'
import style from './style.module.scss'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {ProfileContainer, ProfileSegment} from '../../components'
import {Copy, Check} from '../../icons'

const Personal = () => {
    const [isCopied, setIsCopied] = useState(false)

    const copyIdHandler = _ => {
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        },1000)
    }
    return (
        <div className={style.profile__personal}>
            <ProfileContainer title='personal info' ribbon='#037A12'>
                    <div className={style.profile__personal_info}>
                        <img src="images/photos/photo-1.png" alt="" />
                        <h2>Samantha Abraham John Jackson</h2>
                        <p>
                            <span>username</span>: <span>samaj-50</span>
                        </p>
                        <p>
                            <span>Id</span>: <span>61abb6ef141f48d63e4a6be3</span> 
                            &nbsp;
                            <CopyToClipboard text='61abb6ef141f48d63e4a6be3' onCopy={copyIdHandler}>
                                <span> {isCopied ? <Check/> : <Copy/>} </span> 
                            </CopyToClipboard>
                        </p>
                    </div>
                   
                   <ProfileSegment 
                   title='e-mail address' 
                   text='sam.2010@test.com'/>
                   
                   <ProfileSegment 
                   title='password' 
                   text='*************' 
                   type='password'
                   placeholder='type the new password'/>

            </ProfileContainer>
        </div>
    )
}

export default Personal
