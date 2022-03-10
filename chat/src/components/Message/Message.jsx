import React, {useEffect, useState} from 'react'
import style from './Message.module.scss'
import {AudioFile} from '../../components'
import {Check, DoubleCheck} from '../../icons'


const Message = ({
    custom, 
    isSent, 
    isDelivered, 
    content, 
    chatRef, 
    type, 
    fileType,
    fileName
}) => {
  
  const [isMessageSent, setIsMessageSent] = useState(false)
  const [isMessageDelivered, setIsMessageDelivered] = useState(false)

    
  const errorStyle = _ => {
      if(type === 'error') {
          return {
            maxWidth:'unset',
            width: '100%',
            backgroundColor:'unset',
            margin: 0,
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
      } else return {}
  }

  const errorParagraphStyle =  _ =>{
      if(type === 'error') {
            return {
                color: 'rgb(255 33 33)',
                backgroundColor: '#ffeeee',
                padding: '0.3rem',
                borderRadius: '0.2rem'
            }
      } else return {}
  }


  const textMessage = (
    <p> {content} </p>
  )

  const errorMessage = (
    <p style={errorParagraphStyle()}> {content} </p>
  )

  const imageMessage = (
    <figure style={{width:'10rem'}}> 
        <img src={content} alt="avatar"  style={{width:'100%', objectFit:'cover'}}/>
        <p style={{overflow:'hidden'}}>
            {fileName}
        </p> 
    </figure>
  )

  const fileMessage = (
    <figure style={{width:'10rem'}}> 
        <img src={`/placeholder/${fileType}`} alt="placeholder"  style={{width:'100%', objectFit:'cover'}}/> 
        <p style={{overflow:'hidden'}}> {fileName} </p>
    </figure>
  )

  const downloadAsset = _ => {
    if(type === 'image' || type === 'file') {

        const anchor = document.createElement('a')
        anchor.href = content 
        anchor.target = '_blank'
        anchor.click()
    }
}
  
  useEffect(() => {
        setTimeout(() => {
        setIsMessageSent(true)
        },2500)

        setTimeout(() => {
            setIsMessageDelivered(true)
        },5000)
    },[])


return (
    <div 
    className={style.message} 
    style={{...custom, ...errorStyle()}} 
    ref={chatRef}
    onClick={downloadAsset}>
        {
            type === 'error'
            ? errorMessage
            : type === 'text'
            ? textMessage
            : type === 'image'
            ?  imageMessage
            : type === 'file' 
            ? fileMessage
            : type === 'audio' 
            && <AudioFile url={content}/>
        }
        {
            type !== 'error'
            && 
            <p style={{color:'#8f8f8f'}}>
                <span> 6:13 pm </span>
                <span style={{color:isMessageDelivered && 'green'}}>
                    {
                        isMessageSent || isMessageDelivered
                        ? <DoubleCheck/> 
                        : <Check/>
                    }
                    
                </span>
            </p>
        }
    </div>
  )
}

export default Message