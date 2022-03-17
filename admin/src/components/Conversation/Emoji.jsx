import React from 'react'
import style from './style.module.scss'
import {v4} from 'uuid'
import Scrollbar from 'simplebar-react'
import {FaceSmile} from '../../icons'
import emojiData from './emojiData.json'

const Emoji = ({isEmoji, setIsEmoji, addEmojiHandler}) => {

    return (
        <div className={style.chat__emoji}>
            <span onClick={() => setIsEmoji(prev => !prev)}> <FaceSmile/> </span>
            {
              isEmoji && 
              <ul className={style.chat__emoji_list}>
                    <Scrollbar style={{
                        width:'100%',
                        height:'100%',
                      }}>
                          {
                            emojiData.map(em => (
                              <li onClick={() => addEmojiHandler(em.char)} key={v4()}> {em.char} </li>
                            ))
                          }
                    </Scrollbar>
              </ul>
            }
        </div>
    )
}

export default Emoji