import React from 'react'
import style from './style.module.scss'
import {Paperclip, ImagePlaceholder, FilePlaceholder} from '../../icons'

const Upload = ({isFile, setIsFile}) => {
  

  return (
    <div style={{position:'relative'}}>
        <span onClick={() => setIsFile(prev => !prev)}> <Paperclip/> </span>
        {
            isFile && 
            <div className={style.chat__messages_upload}>
                <label htmlFor='image-upload' title='upload image'>
                    <ImagePlaceholder/>
                </label>
                <label htmlFor='document-upload' title='upload file'>
                    <FilePlaceholder/>
                </label>
            </div>
        }
    </div>
  )
}

export default Upload