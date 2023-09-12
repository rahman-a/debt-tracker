import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Modal, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import InsideAddress from './InsideAddress'
import OutsideAddress from './OutsideAddress'
import OutsidePhones from './OutsidePhones'
import Company from './Company'
import FullName from './FullName'
import Country from './Country'
import actions from '@/src/actions'
import { User, Times } from '@/src/icons'
import { Loader } from '@/src/components'
import constants from '@/src/constants'

const EditMember = ({ isEdit, setIsEdit, type }) => {
  const [info, setInfo] = useState({})
  const [errors, setErrors] = useState(null)
  const dispatch = useDispatch()
  const { loading, error, message } = useSelector((state) => state.memberUpdate)
  const { member } = useSelector((state) => state.member)
  const { t } = useTranslation()

  const components = {
    name: <FullName setInfo={setInfo} info={info} />,
    country: <Country setInfo={setInfo} />,
    insideAddress: <InsideAddress setInfo={setInfo} />,
    outAddress: <OutsideAddress setInfo={setInfo} />,
    outPhones: <OutsidePhones setInfo={setInfo} info={info} />,
    company: <Company setInfo={setInfo} />,
  }

  const isPhonesValid = () => {
    setErrors(null)
    const phones = []

    for (let phone of info.phones) {
      if (phone.value) phones.push(phone.value)
    }

    if (!phones.length) {
      setErrors(t('provide-out-phone'))
      return false
    }
    for (let phone of phones) {
      if (!phone || phone === ' ') {
        setErrors(t('provide-out-phone'))
        return false
      }

      if (!/^\d+$/.test(phone)) {
        setErrors(t('provide-valid-tel'))
        return false
      }

      if (phone.replace(/\D/g, '').startsWith('971')) {
        setErrors(t('remove-dialing-code'))
        return false
      }
    }
    return true
  }

  const submitData = () => {
    let data = info
    if (info.phones && isPhonesValid()) {
      const phones = info.phones.map((phone) => phone.value)
      data.phones = phones
    } else return

    if (info.country) {
      data.country = JSON.stringify(info.country)
    }

    dispatch(actions.admin.memberUpdate(member._id, data))
  }

  const clearError = () => {
    setErrors(null)
    dispatch({ type: constants.admin.MEMBERS_UPDATE_RESET })
  }

  const closeModal = () => {
    clearError()
    setIsEdit(false)
  }

  useEffect(() => {
    if (message) {
      setIsEdit(false)
    }
  }, [message])

  useEffect(() => {
    error && setErrors(error)
  }, [error])

  return (
    <Modal show={isEdit} onHide={closeModal} centered>
      {/* Modal Header */}
      <Modal.Header>
        <Modal.Title>
          <p style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>
              <User />
            </span>
            <span> Edit Member Data </span>
          </p>
        </Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body>
        {errors && (
          <div className={style.edit__error}>
            <span onClick={clearError}>
              <Times />
            </span>
            {errors}
          </div>
        )}
        {loading && (
          <div className={style.edit__overflow}>
            <Loader size='6' options={{ animation: 'border' }} />
          </div>
        )}
        {components[type]}
      </Modal.Body>

      {/* Modal Footer */}
      <Modal.Footer>
        <Button
          disabled={loading ? true : false}
          size='lg'
          variant='primary'
          onClick={submitData}
        >
          Save
        </Button>
        <Button
          disabled={loading ? true : false}
          size='lg'
          variant='secondary'
          onClick={closeModal}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditMember
