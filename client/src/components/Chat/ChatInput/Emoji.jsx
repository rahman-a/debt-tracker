/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import style from './style.module.scss'
import { v4 } from 'uuid'
import Scrollbar from 'simplebar-react'
import { FaceSmile } from '@/src/icons'
import emojiData from './emojiData.json'

const Emoji = ({ isEmoji, setIsEmoji, addEmojiHandler }) => {
  const emojiRef = useRef(null)
  const emojiListRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target) &&
        emojiListRef.current &&
        !emojiListRef.current.contains(event.target)
      ) {
        setIsEmoji(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={style.input__emoji}>
      <span ref={emojiRef} onClick={() => setIsEmoji((prev) => !prev)}>
        <FaceSmile />
      </span>
      {isEmoji && (
        <ul ref={emojiListRef} className={style.input__emoji_list}>
          <Scrollbar
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            {emojiData.map((em) => (
              <li onClick={() => addEmojiHandler(em.char)} key={v4()}>
                {em.char}
              </li>
            ))}
          </Scrollbar>
        </ul>
      )}
    </div>
  )
}

export default Emoji
