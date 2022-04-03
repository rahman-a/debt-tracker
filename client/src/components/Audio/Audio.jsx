import React, {useState, useEffect} from 'react'
import style from './Audio.module.scss'
import {Spinner} from 'react-bootstrap'
import getBlobDuration from 'get-blob-duration'
import {Play, Pause} from '../../icons'
import i18next from 'i18next'

const AudioFile = ({url,loading}) => {
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [progressWidth, setProgressWidth] = useState(0)
  const [duration, setDuration] = useState(null)
  const lang = i18next.language

  const controlTheAudioHandler = action => {
    
    if(action === 'play' && !isPlaying) {
        audioFile.play()
        setIsPlaying(true)
        audioFile.addEventListener('timeupdate',async e => {
            const currentTime = Math.round(audioFile.currentTime)
            const progress = Math.ceil((currentTime  / duration) * 100)
            // 
            // 
            setDuration(duration -currentTime)
            setProgressWidth(progress)
            if(currentTime >= duration) {
                setIsPlaying(false)
                setDuration(Math.round(audioFile.duration))
            }
        })
    }else if(action === 'pause' && isPlaying) {
        audioFile.pause()
        setIsPlaying(false)
    }
  }

  const createAudioFile = () => {
    const audio = new Audio()
    audio.setAttribute('controls', true)
    audio.setAttribute('preload', 'metadata')
    const source = document.createElement('source')
    source.setAttribute('src', url)
    source.setAttribute('type', 'audio/mp3')
    audio.appendChild(source)
    setAudioFile(audio)
  }

    const getFileDuration = async _ => {
        const duration = !isNaN(audioFile.duration) && audioFile.duration !== Infinity
        ? audioFile.duration 
        : await getBlobDuration(url)
        
        setDuration(Math.round(duration))
    }  

    useEffect(() => {
        if(url) {
            
           createAudioFile()
        }
    },[url]) 


    useEffect(() => {
        if(audioFile) {
            getFileDuration()
        } 
    },[audioFile])
return (
    <div className={`${style.audio} ${lang === 'ar' ? style.audio_ar :''}`}>
        <div className={style.audio__actions}>
            {
                loading ? <div style={{marginRight:'1rem'}}> <Spinner size='md' animation='border'/> </div>
                : isPlaying 
                ? <span onClick={() => controlTheAudioHandler('pause')}> <Pause/> </span>
                : <span onClick={() => controlTheAudioHandler('play')}> <Play/> </span>
            }
        </div>
        <div className={style.audio__progress}>
            <span style={{width:`${progressWidth}%`}}>  </span>
           {
               duration ?
               <em> {`0:${duration}`} </em>
               : ' '
           } 
        </div>
    </div>
  )
}

export default AudioFile
