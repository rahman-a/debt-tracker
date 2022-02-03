import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {Alert} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import actions from '../../actions'
import constants from '../../constants'
import {Input, Button, DateInput} from '../../components'
import {AddressCard} from '../../icons'

const Documents = ({setStep}) => {
    const [errors, setErrors] = useState(null)
    const [images, setImages] = useState({
        avatar:null,
        identity:null,
        passport:null,
        residential:null
    })
    
    const [files, setFiles] = useState({
        avatar:'Personal Photo',
        identity:'Identity Document',
        passport:'Passport Document',
        residential:'Residential Document'
    })
    
    const dispatch = useDispatch()
    const {loading, error, isDone} = useSelector(state => state.registerDocuments)
    const {userId} = useSelector(state => state.registerCredential)

    const [expireAt, setExpiryAt] = useState({})

    const uploadFileHandler = e => {        
        let fileName = e.target.files[0].name
        if(fileName.length > 20) {
            fileName = fileName.substr(0,20) + '...'
        }
        setFiles({...files, [e.target.name]: fileName})
        setImages({...images, [e.target.name]: e.target.files[0]})
    }

    const getExpiryDate = (name, value) => {
        setExpiryAt({...expireAt, [name]: value})
    }

    const moveNextHandler = _ => {
      if(!images.avatar) {
          setErrors('Please upload Your Personal Image')
          return
      }
      if(!images.identity) {
          setErrors('Please upload Your Identity')
          return
      }
      if(images.identity) {
        if(!expireAt.identity) {
            setErrors('Please choose your identity expiry date')
            return
        }
      }
      if(images.passport) {
        if(!expireAt.passport) {
            setErrors('Please choose your passport expiry date')
            return
        }
      }
      if(images.residential) {
        if(!expireAt.residential) {
            setErrors('Please choose your residential expiry date')
            return
        }
      }
      const allDocuments = {...images, expireAt}
       const data = new FormData()
        for(let doc in allDocuments) {
            if(doc === 'expireAt') {
                const expiry = JSON.stringify(allDocuments[doc])
                data.append('expireAt', expiry)
            }else {
                data.append(doc, allDocuments[doc])
            }
        }
        dispatch(actions.users.registerDocuments(userId, data, 'not_taken'))
    }
    
    useEffect(() => {
     error && setErrors(error)
    },[error])

    useEffect(() => {
        errors && window.scrollTo(0,0)
        if(isDone) {
            dispatch({type:constants.users.REGISTER_DOCUMENTS_RESET})
            setStep(6)
        } 
    },[errors, isDone])
    
    return (
        <>
        {errors && <Alert 
        variant='danger' onClose={() => setErrors(null)} dismissible>
            {errors}
        </Alert> }

        {/* UPLOAD PERSONAL PHOTO */}
          <Input
            name='avatar'
            label={files.avatar}
            placeholder='Personal Photo'
            type='file'
            icon={<AddressCard/>}
            onChange={(e) => uploadFileHandler(e)}
            custom={{marginBottom:'3rem'}}
        />
        <hr style={{marginTop:'-2rem', backgroundColor:'#fff'}}/>
        
        {/* UPLOAD IDENTITY DOCUMENT */}
        <div className={style.document}>
            <Input
                name='identity'
                label={files.identity}
                placeholder='Identity Document'
                type='file'
                onChange={(e) => uploadFileHandler(e)}
                icon={<AddressCard/>}
            />
            <DateInput 
            getExpiryDate={(value) => getExpiryDate('identity', value)}
            name='identity'/>
            <hr/>
        </div>

        {/* UPLOAD PASSPORT DOCUMENT */}
        <div className={style.document}>
            <Input
                name='passport'
                label={files.passport}
                placeholder='Passport Document'
                type='file'
                onChange={(e) => uploadFileHandler(e)}
                icon={<AddressCard/>}
            />
            <DateInput
            getExpiryDate={(value) => getExpiryDate('passport', value)}
            name='passport'/>

            <hr/>
        </div>

        {/* UPLOAD RESIDENTIAL DOCUMENT */}
        <div className={style.document}>
            <Input
                name='residential'
                label={files.residential}
                placeholder='Residential Document'
                type='file'
                onChange={(e) => uploadFileHandler(e)}
                icon={<AddressCard/>}
            />
            <DateInput
            getExpiryDate={(value) => getExpiryDate('residential', value)}
            name='residential'/>
            <hr/>
        </div>

        <Button value='next' handler={moveNextHandler} loading={loading && loading}/> 

        </>
    )
}

export default Documents