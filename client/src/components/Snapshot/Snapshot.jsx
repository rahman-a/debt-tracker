import React, {useState, useCallback, useRef, useEffect} from 'react'
import style from './style.module.scss'
import Webcam from 'react-webcam'
import {v4 as uuidv4} from 'uuid'
import { useSelector, useDispatch } from 'react-redux'
import {Alert} from 'react-bootstrap'
import actions from '../../actions'
import {Loader} from '../../components'

const VerificationSnapshot = ({setStep, documents}) => {
    const [imgSrc, setImgSrc] = useState('')
    const [isTaken, setIsTaken] = useState(false)
    const [snapshot, setSnapshot] =useState(null)
    const [mediaError, setMediaError] = useState(null)
    const webcamRef = useRef(null)
    const dispatch = useDispatch()
    const {loading, error, isDone} = useSelector(state => state.registerDocuments)
    const {userId} = useSelector(state => state.registerCredential)

    const takeVerificationPhotoHandler = useCallback(
        () => {
            if(!mediaError){
                const src = webcamRef.current.getScreenshot()
                fetch(src)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'verificationImage.png', {type:'image/png'})
                    setSnapshot(file)
                    setImgSrc(src)
                    setIsTaken(true)
                })
            }
        },
        [webcamRef, setImgSrc, mediaError],
    )

    const uploadDocumentsHandler = _ => {
        const allDocuments = {...documents,verificationImage:snapshot}
        const data = new FormData()
        for(let doc in allDocuments) {
            if(doc === 'expireAt') {
                const expiry = JSON.stringify(allDocuments[doc])
                data.append('expireAt', expiry)
            }else {
                data.append(doc, allDocuments[doc])
            }
        }
        dispatch(actions.users.registerDocuments(userId, data))
    }
    
    const mediaErrorHandler = error => {
        setMediaError(error.message)
    }

    const getVideoConstraints = constraints => {
        return {
            width: 415,
            height: 300,
            facingMode: "user",
            ...constraints
          };
    }
    
    useEffect(() => {
        error && window.scrollTo(0,0)
        isDone && setStep(7)
    },[error, isDone])
    
    return (
        <div className={style.snapshot}>
           {error && <Alert variant='danger'>{error}</Alert> }
            <h3>Take The Photo of your self with your identity</h3>
            <p>Your Face and Identity must be clear in the photo</p>
            {/* <button onClick={accessCameraHandler}>
                <span></span>
                <p>Click to open the camera</p>
            </button> */}
            <div className={style.snapshot__photo}>
                <Webcam
                    key={uuidv4()}
                    audio={false}
                    screenshotFormat='image/png'
                    videoConstraints={() => getVideoConstraints({})}
                    ref={webcamRef}
                    imageSmoothing={true}
                    minScreenshotHeight={300}
                    minScreenshotWidth={415}
                    onUserMediaError={(error) => mediaErrorHandler(error)}
                />
                {mediaError &&
                <>
                    <h3>{mediaError}</h3> 
                    <h3>Please Enable Access to your Webcam</h3> 
                </>}
                <button disabled={mediaError} onClick={takeVerificationPhotoHandler}> 
                    {isTaken ? 'take photo again':'take photo'}
                </button>
                {imgSrc && <img src={imgSrc} alt="verification" />}
                <button 
                disabled={!isTaken} 
                onClick={uploadDocumentsHandler}
                style={{
                    position:'relative', 
                    padding:loading ? '1.2rem 2rem' : '0.1rem 2rem', 
                    color:'#1A374D'
                }}>
                    {loading 
                    ? <Loader size='4' center options={{animation:'border'}}/>
                    : 'Done'}
                </button>
            </div>

        </div>
    )
}

export default VerificationSnapshot
