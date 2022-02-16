import React, {useState, useEffect} from 'react'
import style from './style.module.scss'
import {Form, Button} from 'react-bootstrap'
import {v4 as uuidv4} from 'uuid'
import {useSelector, useDispatch} from 'react-redux'
import {SideAlert, Loader} from '../../components'
import actions from '../../actions'
import constants from '../../constants'
import Documents from './Documents'
import Phones from './Phones'
import Address from './Address'
import Personal from './Personal'
import Credential from './Credential'

const Provider = () => {
    const [info, setInfo] = useState({
        username:'',
        password:'',
        fullNameInArabic:'',
        fullNameInEnglish:'',
        company:'',
        avatar:'',
        insideAddress:'',
        outsideAddress:'',
        isProvider:true,
        isPhoneConfirmed:true,
        isEmailConfirmed:true,
        isAccountConfirmed:true
    })

    const [insidePhones, setInsidePhones] = useState([
        {id:uuidv4(), isPrimary:'', phone:null}
    ])
  
    const [outsidePhones, setOutsidePhones] = useState([
          {id:uuidv4(), phone:null}
    ])

    const [emailValues, setEmailValues] = useState([
        {id:uuidv4(), isPrimary:'', email:null}
    ])
    
    const [country, setCountry] = useState(null)
    const [identity, setIdentity] = useState({})
    const [passport, setPassport] = useState({})
    const [residential, setResidential] = useState({})

    const [errors, setErrors] = useState(null) 

    const dispatch = useDispatch()
    const {loading, error, message} = useSelector(state => state.createProvider)
  
    const getInfoValues = e => {
        let value = null 
        if(e.target.name === 'avatar') {
            value = {[e.target.name]: e.target.files[0]}
        } else {
            value = {[e.target.name]: e.target.value}
        }
        setInfo({...info, ...value})
    }
  
    const checkFormValidation = _ => {
        
        const infoValues = {
            username:'user name',
            password:'password',
            fullNameInArabic:'full name in arabic',
            fullNameInEnglish:'full name in english',
            company:'company',
            insideAddress:'address inside UAE',
            outsideAddress:'address outside UAE',
            avatar:'personal image'
        }
        
        for(let key in info) {
            if(!info[key]) {
                setErrors(`${infoValues[key]} is required, please provide it`)
                return false
            }
        }

        if(!country) {
            setErrors('please choose your country')
            return false
        }

        for(let key in emailValues) {
            if(!(emailValues[key].email)) {
                setErrors('Done\'t leave email input empty')
                return false
            }
        }

        for(let key in insidePhones) {
            if(!(insidePhones[key].phone)) {
                setErrors('Done\'t leave phone inside UAE input empty')
                return false
            }
        }

        if(Object.keys(identity).length === 0) {
            setErrors('please upload identity document')
            return false
        }

        if(identity.image && !identity.expireAt) {
            setErrors('please select expiry date of identity')
            return false
        }

        if(passport.image && !passport.expireAt) {
            setErrors('please select expiry date of passport')
            return false
        }

        if(residential.image && !residential.expireAt) {
            setErrors('please select expiry date of residential')
            return false
        }
        
        return true
  }
  
    const createProviderAccount = e => {
      e.preventDefault()
      
      if(checkFormValidation()) {
        
            
          const emails = emailValues.map(email => {
              return {email:email.email, isPrimary:email.isPrimary}
            })
            
            const insidePhonesValues = insidePhones.map(phone => {
                return {phone: phone.phone, isPrimary:phone.isPrimary}
            })
            
            const outsidePhonesValues  = []
            outsidePhones.forEach(phone => {
                if(phone.phone) {
                    outsidePhonesValues.push(phone.phone)
                }
            })
            
            let data = {
                ...info,
                emails,
                country,
                insidePhones:insidePhonesValues,
                identity:identity.image,
                expiryAt:{identity:identity.expireAt}
            }
            
            if(outsidePhonesValues.length) {
                data['outsidePhones'] = outsidePhonesValues 
            }

            if(passport.image) {
                data['passport'] = passport.image 
                data['expiryAt'] = {...data['expiryAt'], passport:passport.expireAt}
            }
            if(residential.image) {
                data['residential'] = residential.image 
                data['expiryAt'] = {...data['expiryAt'], residential:residential.expireAt}
            }
            const providerData = new FormData()
            for(let key in data) {
                if(key === 'expiryAt' 
                || key === 'emails' 
                || key === 'insidePhones'
                || key === 'country') {
                    providerData.append(key, JSON.stringify(data[key]))
                } else {
                    providerData.append(key, data[key])
                }
            }

            console.log(data);
            console.log(providerData);
            dispatch(actions.admin.createProvider(providerData))
      
        }
    }
  
  useEffect(() => {
    if(error) {
        setErrors(error)
        setTimeout(() => {
            dispatch({type: constants.admin.CREATE_PROVIDER_RESET})
        }, 10500);
    } 
  },[error])

  useEffect(() => {
    return () => dispatch({type:constants.admin.CREATE_PROVIDER_RESET})
  },[])

return (
    <div className={style.provider}>
        <SideAlert
          text={errors}
          isOn={errors ? true : false}
          reset={() => setErrors(null)}
          type='danger'
        />
        <SideAlert
          text={message}
          isOn={message ? true : false}
          type='success'
        />
        <h1 className='main-header'> Create Provider Account </h1>
        <div className="container">
            <div className={style.provider__wrapper}>
                <Form>
                    <div className={style.provider__container}>
                        <div className={style.provider__info}>
                            
                            <Credential
                                getInfoValues={getInfoValues}
                                emailValues={emailValues}
                                setEmailValues={setEmailValues}
                            />
                           
                           <Personal
                                getInfoValues={getInfoValues}
                                setCountry={setCountry}
                           />
                            
                            <Address
                                getInfoValues={getInfoValues}
                            />

                            <Phones
                                insidePhones={insidePhones}
                                setInsidePhones={setInsidePhones}
                                outsidePhones={outsidePhones}
                                setOutsidePhones={setOutsidePhones}
                            />

                        </div>
                        
                        <div className={style.provider__info}>
                            
                            <Documents
                                setIdentity={setIdentity}
                                identity={identity}
                                setPassport={setPassport}
                                passport={passport}
                                setResidential={setResidential}
                                residential={residential}
                                getInfoValues={getInfoValues}
                            />
                           <div style={{display:'flex', alignItems:'center'}}>
                                <Button 
                                    variant='success' 
                                    size='lg'
                                    onClick={createProviderAccount}> 
                                    Save 
                                </Button>
                              {loading && <Loader size='4' options={{animation:'border'}}/> }  
                           </div>

                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </div>
  )
}

export default Provider