import React, {useState} from 'react'
import style from './style.module.scss'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {ProfileContainer, ProfileSegment} from '../../components'
import {Copy, Check, Wrench} from '../../icons'

const Personal = ({data}) => {
    const [isCopied, setIsCopied] = useState(false)

    const copyIdHandler = _ => {
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        },1000)
    }
    return (
        <div className={style.profile__personal}>
            <ProfileContainer title='personal info' 
            ribbon={{color:data.color.code, states:data.color.state}}>
                
                <div className={style.profile__personal_info}>
                    {
                        data.isProvider && 
                        <div className={style.profile__personal_provider}>
                          <span> <Wrench/> </span>
                          <p> Provider </p>
                        </div>
                    }
                    <img src={
                        `api/files/${data.avatar}`
                    } alt="" />
                    <h2>{data.fullName}</h2>
                    <p>
                        <span>username</span>: <span>{data.username}</span>
                    </p>
                    <p>
                        <span>Id</span>: <span>{data.code}</span> 
                        &nbsp;
                        <CopyToClipboard text={data.code} onCopy={copyIdHandler}>
                            <span> {isCopied ? <Check/> : <Copy/>} </span> 
                        </CopyToClipboard>
                    </p>
                </div>
                   
                <ProfileSegment 
                title='e-mail address'
                type='email'
                text={data.emails}/>

            </ProfileContainer>
        </div>
    )
}

export default Personal
