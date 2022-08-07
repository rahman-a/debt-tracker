import React, { useState, useEffect } from 'react'
import style from './Audio.module.scss'
import { Spinner } from 'react-bootstrap'
import getBlobDuration from 'get-blob-duration'
import { Play, Pause } from '../../icons'
import i18next from 'i18next'

const AudioFile = ({
  url,
  loading,
  trackRunningAudio,
  setTrackRunningAudio,
}) => {
  const [audioFile, setAudioFile] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progressWidth, setProgressWidth] = useState(0)
  const [duration, setDuration] = useState(null)
  const [audioTrack, setAudioTrack] = useState(null)
  const lang = i18next.language

  const controlAudioHandler = (action) => {
    if (action === 'play') {
      setTrackRunningAudio(url)
    } else if (action === 'pause') {
      pauseAudioHandler()
    }
  }

  const pauseAudioHandler = () => {
    audioFile.pause()
    setIsPlaying(false)
    setTrackRunningAudio('')
  }

  const playAudioHandler = () => {
    audioFile.play()
    setIsPlaying(true)
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

  const getFileDuration = async (_) => {
    const duration =
      !isNaN(audioFile.duration) && audioFile.duration !== Infinity
        ? audioFile.duration
        : await getBlobDuration(url)
    setDuration(Math.round(duration))
  }

  const trackAudioTime = () => {
    audioFile.addEventListener('timeupdate', async (e) => {
      const currentTime = Math.round(audioFile.currentTime)
      const progress = Math.ceil((currentTime / duration) * 100)
      setAudioTrack(duration - currentTime)
      setProgressWidth(progress)
      if (currentTime >= duration) {
        setTrackRunningAudio('')
        setIsPlaying(false)
        setAudioTrack(Math.round(audioFile.duration))
      }
    })
  }

  useEffect(() => {
    if (url) {
      createAudioFile()
    }
  }, [url])

  useEffect(() => {
    if (audioFile) {
      !duration && getFileDuration()
    }
  }, [audioFile])

  useEffect(() => {
    if (trackRunningAudio && trackRunningAudio === url && !isPlaying) {
      playAudioHandler()
      trackAudioTime()
    }
    if (trackRunningAudio && trackRunningAudio !== url && isPlaying) {
      pauseAudioHandler()
    }
  }, [trackRunningAudio, isPlaying])

  useEffect(() => {
    duration && setAudioTrack(duration)
  }, [duration])

  return (
    <div className={`${style.audio} ${lang === 'ar' ? style.audio_ar : ''}`}>
      <div className={style.audio__actions}>
        {loading ? (
          <div style={{ marginRight: '1rem' }}>
            <Spinner size='md' animation='border' />
          </div>
        ) : isPlaying ? (
          <span onClick={() => controlAudioHandler('pause')}>
            <Pause />
          </span>
        ) : (
          <span onClick={() => controlAudioHandler('play')}>
            <Play />
          </span>
        )}
      </div>
      <div className={style.audio__progress}>
        <span style={{ width: `${progressWidth}%` }}> </span>
        {audioTrack ? <em> {`0:${audioTrack}`} </em> : ' '}
      </div>
    </div>
  )
}

export default AudioFile
