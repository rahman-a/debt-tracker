import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Form, Button } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import classnames from 'classnames'
import { ArrowRight, ArrowLeft } from '../../icons'
import { SideAlert, Loader } from '../../components'
import actions from '../../actions'
import constants from '../../constants'
import Documents from './Documents'
import Phones from './Phones'
import Address from './Address'
import Personal from './Personal'
import Credential from './Credential'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Employee = () => {
  const { user } = useSelector((state) => state.isAuth)
  const lang = i18next.language
  const navigate = useNavigate()

  const backButtonClassNames = classnames(style.employee__back, {
    [style.employee__back_ar]: lang === 'ar',
  })

  const [info, setInfo] = useState({
    username: '',
    password: '',
    fullNameInArabic: '',
    fullNameInEnglish: '',
    avatar: '',
    company: {
      data: user?.company.data._id,
      isManager: false,
    },
    insideAddress: '',
    outsideAddress: '',
    accountType: 'business',
    isEmployee: true,
    isProvider: false,
    isPhoneConfirmed: true,
    isEmailConfirmed: true,
    isAccountConfirmed: true,
  })

  const [insidePhones, setInsidePhones] = useState([
    { id: uuidv4(), isPrimary: '', phone: null },
  ])

  const [outsidePhones, setOutsidePhones] = useState([
    { id: uuidv4(), phone: null },
  ])

  const [emailValues, setEmailValues] = useState([
    { id: uuidv4(), isPrimary: '', email: null },
  ])

  const [country, setCountry] = useState(null)
  const [identity, setIdentity] = useState({})
  const [passport, setPassport] = useState({})

  const [errors, setErrors] = useState(null)

  const dispatch = useDispatch()
  const { loading, error, message } = useSelector(
    (state) => state.createEmployee
  )
  const { t } = useTranslation()

  const getInfoValues = (e) => {
    let value = null
    if (e.target.name === 'avatar') {
      value = { [e.target.name]: e.target.files[0] }
    } else {
      value = { [e.target.name]: e.target.value }
    }
    setInfo({ ...info, ...value })
  }

  const checkFormValidation = (_) => {
    const infoValues = {
      username: t('username'),
      password: t('password'),
      fullNameInArabic: t('full-name-in-arabic'),
      fullNameInEnglish: t('full-name-in-english'),
      company: t('company-name'),
      insideAddress: t('uae-addresses'),
      outsideAddress: t('outside-uae-addresses'),
      avatar: t('personal-image'),
    }

    for (let key in info) {
      if (!info[key] && key !== 'isProvider') {
        setErrors(t('provide-data', { data: infoValues[key] }))
        return false
      }
    }

    if (!country) {
      setErrors(t('choose-employee-country'))
      return false
    }

    for (let key in emailValues) {
      if (!emailValues[key].email) {
        setErrors(t('enter-employee-email'))
        return false
      }
    }

    for (let key in insidePhones) {
      if (!insidePhones[key].phone) {
        setErrors(t('enter-employee-phone-uae'))
        return false
      }
    }

    if (Object.keys(identity).length === 0) {
      setErrors(t('upload-employee-identity'))
      return false
    }

    if (!identity.image) {
      setErrors(t('upload-employee-identity-front'))
      return false
    }

    if (!identity.back) {
      setErrors(t('upload-employee-identity-back'))
      return false
    }

    if (!identity.expireAt) {
      setErrors(t('select-employee-identity-expiry'))
      return false
    }

    if (!passport.image) {
      setErrors(t('upload-employee-passport'))
      return false
    }

    if (!passport.expireAt) {
      setErrors(t('select-employee-passport-expiry'))
      return false
    }

    return true
  }

  const createEmployeeAccount = (e) => {
    e.preventDefault()

    if (checkFormValidation()) {
      const emails = emailValues.map((email) => {
        return { email: email.email, isPrimary: email.isPrimary }
      })

      const insidePhonesValues = insidePhones.map((phone) => {
        return { phone: phone.phone, isPrimary: phone.isPrimary }
      })

      const outsidePhonesValues = []
      outsidePhones.forEach((phone) => {
        if (phone.phone) {
          outsidePhonesValues.push(phone.phone)
        }
      })

      let data = {
        ...info,
        emails,
        country,
        insidePhones: insidePhonesValues,
        'identity-front': identity.image,
        'identity-back': identity.back,
        expiryAt: { identity: identity.expireAt },
      }

      if (outsidePhonesValues.length) {
        data['outsidePhones'] = outsidePhonesValues
      }

      if (passport.image) {
        data['passport'] = passport.image
        data['expiryAt'] = { ...data['expiryAt'], passport: passport.expireAt }
      }

      const employeeData = new FormData()
      for (let key in data) {
        if (
          key === 'expiryAt' ||
          key === 'emails' ||
          key === 'insidePhones' ||
          key === 'country' ||
          key === 'company'
        ) {
          employeeData.append(key, JSON.stringify(data[key]))
        } else {
          employeeData.append(key, data[key])
        }
      }
      console.log('final data: ', data)
      dispatch(actions.employees.createEmployee(employeeData))
    }
  }

  useEffect(() => {
    if (error) {
      setErrors(error)
      setTimeout(() => {
        dispatch({ type: constants.employees.CREATE_EMPLOYEE_RESET })
      }, 10500)
    }
  }, [error])

  useEffect(() => {
    return () => dispatch({ type: constants.employees.CREATE_EMPLOYEE_RESET })
  }, [])

  return (
    <>
      <Button
        onClick={() => navigate('/employees')}
        variant='black'
        size='lg'
        style={{}}
        className={backButtonClassNames}
      >
        {lang === 'en' ? <ArrowLeft /> : <ArrowRight />} &nbsp;
        {t('back')}
      </Button>
      <div className={style.employee}>
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
        <h1 className='main-header'> {t('create-employee-account')} </h1>
        <div className='container'>
          <div className={style.employee__wrapper}>
            <Form>
              <div className={style.employee__container}>
                <div className={style.employee__info}>
                  <Credential
                    getInfoValues={getInfoValues}
                    emailValues={emailValues}
                    setEmailValues={setEmailValues}
                  />

                  <Personal
                    getInfoValues={getInfoValues}
                    setCountry={setCountry}
                  />

                  <Address getInfoValues={getInfoValues} />

                  <Phones
                    insidePhones={insidePhones}
                    setInsidePhones={setInsidePhones}
                    outsidePhones={outsidePhones}
                    setOutsidePhones={setOutsidePhones}
                  />
                </div>

                <div className={style.employee__info}>
                  <Documents
                    setIdentity={setIdentity}
                    identity={identity}
                    setPassport={setPassport}
                    passport={passport}
                    getInfoValues={getInfoValues}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      variant='success'
                      size='lg'
                      onClick={createEmployeeAccount}
                    >
                      {t('save')}
                    </Button>
                    {loading && (
                      <Loader size='4' options={{ animation: 'border' }} />
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Employee
