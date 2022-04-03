import React, {useState, useEffect} from 'react'
import style from './Audio.module.scss'
import {Play, Pause} from '../../icons'
import sample from './sample.mp3'

const AudioFile = ({url}) => {
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [progressWidth, setProgressWidth] = useState(0)

  const controlTheAudioHandler = action => {
    
    if(action === 'play' && !isPlaying) {
        
        audioFile.addEventListener('timeupdate', e => {
            const progress = (audioFile.currentTime  / audioFile.duration) * 100
            
            setProgressWidth(progress)
            if(progress >= 99.95) {
                setIsPlaying(false)
            }
        })
        audioFile.play()
        setIsPlaying(true)

    }
    
    if(action === 'pause' && isPlaying) {
        audioFile.pause()
        setIsPlaying(false)
    }
  }

    useEffect(() => {
        if(url) {
            const file = new Audio(sample) 
            setAudioFile(file)
        }
    },[url]) 
return (
    <div className={style.audio}>
        <div className={style.audio__actions}>
            {
                isPlaying 
                ? <span onClick={() => controlTheAudioHandler('pause')}> <Pause/> </span>
                : <span onClick={() => controlTheAudioHandler('play')}> <Play/> </span>
            }
        </div>
        <div className={style.audio__progress}>
            <span style={{width:`${progressWidth}%`}}>  </span>
           {/* {
               duration ?
               <em> {`0:${Math.round(audioFile.duration)}`} </em>
               : ' '
           }  */}
        </div>
    </div>
  )
}

export default AudioFile
