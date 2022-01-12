import React, {useState} from 'react'
import style from './style.module.scss'
import {Input, Button} from '../../components'
import {Calendar, AddressCard} from '../../icons'

const Documents = ({setStep}) => {
    const [document, setDocuments] = useState({
        avatar:'Personal Photo',
        identity:'Identity Document',
        passport:'Passport Document',
        residential:'Residential Document'
    })
    
    const uploadFileHandler = e => {        
        let fileName = e.target.files[0].name
        if(fileName.length > 20) {
            fileName = fileName.substr(0,20) + '...'
        }
        setDocuments({...document, [e.target.name]: fileName})
    }

    const moveNextHandler = _ => {
        setStep(6)
    }
    
    
    return (
        <>
        {/* UPLOAD PERSONAL PHOTO */}
          <Input
            name='avatar'
            label={document.avatar}
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
                label={document.identity}
                placeholder='Identity Document'
                type='file'
                onChange={(e) => uploadFileHandler(e)}
                icon={<AddressCard/>}
            />
            <Input
                name='identityExpire'
                placeholder='mm/dd/yyyy'
                label='Date of Expiry'
                type='date'
                icon={<Calendar/>}
                custom={{marginLeft:'5rem'}}
            />
            <hr/>
        </div>

        {/* UPLOAD PASSPORT DOCUMENT */}
        <div className={style.document}>
            <Input
                name='passport'
                label={document.passport}
                placeholder='Passport Document'
                type='file'
                onChange={(e) => uploadFileHandler(e)}
                icon={<AddressCard/>}
            />
            <Input
                name='passportExpire'
                placeholder='mm/dd/yyyy'
                label='Date of Expiry'
                type='date'
                icon={<Calendar/>}
                custom={{marginLeft:'5rem'}}
            />

            <hr/>
        </div>

        {/* UPLOAD RESIDENTIAL DOCUMENT */}
        <div className={style.document}>
            <Input
                name='residential'
                label={document.residential}
                placeholder='Residential Document'
                type='file'
                onChange={(e) => uploadFileHandler(e)}
                icon={<AddressCard/>}
            />
            <Input
                name='residentialExpire'
                placeholder='mm/dd/yyyy'
                label='Date of Expiry'
                type='date'
                icon={<Calendar/>}
                custom={{marginLeft:'5rem'}}
            />
            <hr/>
        </div>

        <Button value='next' handler={moveNextHandler}/> 

        </>
    )
}

export default Documents