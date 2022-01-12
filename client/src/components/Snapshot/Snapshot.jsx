import React, {useState, useCallback, useRef} from 'react'
import style from './style.module.scss'
import Webcam from 'react-webcam'

const VerificationSnapshot = ({setStep}) => {
    const [imgSrc, setImgSrc] = useState('')
    const [isTaken, setIsTaken] = useState(false)
    const [mediaError, setMediaError] = useState(null)
    const webcamRef = useRef(null)
    
    // const accessCameraHandler = _ => {
    //     if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    //         navigator.mediaDevices.getUserMedia({video: true})
    //       }
    // }

    const takeVerificationPhotoHandler = useCallback(
        () => {
            console.log('capture snapshot');
            if(!mediaError){
                const src = webcamRef.current.getScreenshot()
                setImgSrc(src)
                setIsTaken(true)
            }
        },
        [webcamRef, setImgSrc, mediaError],
    )

    const mediaErrorHandler = error => {
        setMediaError(error.message)
    }

    const videoConstraints = {
        width: 415,
        height: 300,
        facingMode: "user"
      };
    
    return (
        <div className={style.snapshot}>
            <h3>Take The Photo of your self with your identity</h3>
            <p>Your Face and Identity must be clear in the photo</p>
            {/* <button onClick={accessCameraHandler}>
                <span></span>
                <p>Click to open the camera</p>
            </button> */}
            <div className={style.snapshot__photo}>
                <Webcam
                audio={false}
                screenshotFormat='image/png'
                videoConstraints={videoConstraints}
                ref={webcamRef}
                imageSmoothing={true}
                minScreenshotHeight={300}
                minScreenshotWidth={415}
                onUserMediaError={(error) => mediaErrorHandler(error)}
                />
                {mediaError 
                && <><h3>{mediaError}</h3> <h3>Please Enable Access to your Webcam</h3> </>}
                <button disabled={mediaError} onClick={takeVerificationPhotoHandler}> {isTaken ? 'take photo again':'take photo'}</button>
                {imgSrc && <img src={imgSrc} alt="verification" />}
                <button disabled={!isTaken} onClick={() => setStep(7)}>Done</button>
            </div>
        </div>
    )
}

export default VerificationSnapshot
