import React, {useState, useEffect} from 'react';
import style from './style.module.scss'
import {Modal, Alert, Button} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../actions';
import {Times, Plus} from '../../icons'
import {DateInput} from '../../components'
import constants from '../../constants'

const UpdateDocument = ({isEdit, setIsEdit, setLoadingState, document}) => {
    const [errors, setErrors] = useState(null)
    const [expiryDate, setExpiryDate] = useState(null)
    const [doc, setDoc] = useState(null)
    const [imgSrc, setImgSrc] = useState(null) 
    const [docName, setDocName] = useState(null)
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.userProfile)
    const {loading, error, isDone} = useSelector(state => state.updateDocuments)
    
    const chooseAnotherImageHandler = _ => {
        setImgSrc(null)
        setDocName(null)
        setExpiryDate(null)
    }
  
  
    const getImageFile = e => {
        const image = e.target.files[0] 
        // CREATE IMAGE URL SRC
        const imgURL = URL.createObjectURL(image)
        setImgSrc(imgURL)
        // GET THE IMAGE NAME
        let name = image.name
        if(image.name.length > 30) {
            name = image.name.substring(0,30) + '....'
        }
        setDocName(name)
        setDoc(image)
    }

    const uploadDocHandler = (e) => {

        if(!expiryDate) {
            setErrors('Please Provide the Expiry Date')
            return
        }

        if(!doc) {
            setErrors(`Please Provide The ${document} Document`)
            return
        }
        
        setLoadingState(true)
        setIsEdit(false)
        const dateObj = {[document]:expiryDate.toISOString()} 
        const JSONDate = JSON.stringify(dateObj)
        
        const data = new FormData()
        data.append([document], doc)
        data.append('expireAt', JSONDate)
        setTimeout(() => {
            dispatch(actions.users.updateDocuments(user._id, data))
        }, 100);
    }

    useEffect(() => {
        error && setErrors(error)
        isDone && dispatch({type:constants.users.DOCUMENT_UPDATE_RESET})
    },[error, isDone])

  return<> 
  <Modal show={isEdit} onHide={() => setIsEdit(false)}>
      <div className={style.doc__upload}>
          <span className={style.doc__close}
          onClick={() => setIsEdit(false)}>
            <Times/>
          </span>
          
          <div style={{ width: '30rem' }}>
            {
                isDone && 
                <Alert variant='success'>
                    {`${[document]} has been uploaded`}
                </Alert>
            }
            
            {
                errors && 
                <Alert 
                variant='danger'
                className='text-center' 
                onClose={() => setErrors(null)} dismissible>
                        {errors}
                </Alert> 
            }
            
            {/* {
                loading && 
                <Loader
                size='15'
                center
                options={{ animation: 'border' }}
                custom={{ zIndex: '9999' }}
                /> 
            } */}
            
            <h3 style={{fontWeight:'300'}}>
               {
                    expiryDate 
                    ? `Expiry Date: ${expiryDate.toDateString()}` 
                    : 'Choose The Expiry Date'
               } 
            </h3>
            
            <DateInput
              name={document}
              disabled={loading}
              getExpiryDate={(date) => setExpiryDate(date)}
            />
            
            <h3 
                style={{ marginTop: '3rem', fontWeight:'300' }}>
                { docName ? docName :`Upload the ${document}`}
            </h3>

           
            {
                imgSrc 
                ?  <img 
                    src={imgSrc} 
                    alt={document}
                    width='200'
                    />
                : <> 
                    <label 
                        htmlFor='doc'>
                        <span>
                        {' '}
                        <Plus />{' '}
                        </span>
                        <span>{`click to upload the ${document}`}</span>
                    </label>
                
                    <input
                        className={style.doc__upload_input}
                        type='file'
                        name={document}
                        id='doc'
                        disabled={loading}
                        onChange={(e) => getImageFile(e)}
                    />
                </>
            }
            
            {
            imgSrc && 
                <Button 
                className='mt-2' 
                variant='dark' 
                onClick={chooseAnotherImageHandler}>
                choose another image
                </Button>
            }
           
            
            <Button 
                variant='warning' 
                size='lg'
                className='mt-4'
                onClick={uploadDocHandler}>
                Upload the Document
            </Button>
          </div>
        </div>
  </Modal></>
};

export default UpdateDocument;
