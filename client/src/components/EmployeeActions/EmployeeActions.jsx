// @ts-nocheck
import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
  MenuDots,
  UserBlock,
  UserChecked,
  AddressCard,
  CashRegister,
  HandshakeSlash,
  Cogs,
  Trash,
  SettingPanel,
} from '@/src/icons'
import actions from '@/src/actions'
import Loading from '../Loader/Loader'
import SideAlert from '../SideAlert/SideAlert'
import DeleteEmployee from './DeleteEmployee'

const EmployeeActions = ({ employee, isPanel }) => {
  const [isDisabled, setIsDisabled] = useState(false)
  const [toggleDelete, setToggleDelete] = useState(false)
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.toggleBlockEmployee)
  const { loading: delete_loading, error: delete_error } = useSelector(
    (state) => state.deleteEmployee
  )
  const dispatch = useDispatch()
  const handleBlock = () => {
    dispatch(actions.employees.toggleBlockEmployee(employee._id))
  }
  const employeeName = `arName=${employee.fullNameInArabic}&enName=${employee.fullNameInEnglish}`
  const redirectUrl = `${employee._id}?${employeeName}&avatar=${employee.avatar}&type=employee`

  useEffect(() => {
    if (loading || delete_loading) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [loading, delete_loading])
  return (
    <div className={style.actions}>
      {error && <SideAlert type='danger' text={error} />}
      {delete_error && <SideAlert type='danger' text={delete_error} />}
      <DeleteEmployee
        id={employee._id}
        toggleDelete={toggleDelete}
        setToggleDelete={setToggleDelete}
      />
      <Dropdown autoClose={delete_loading ? false : 'outside'}>
        <Dropdown.Toggle size='sm' variant='light' id='dropdown-basic'>
          {isPanel ? (
            <SettingPanel />
          ) : (
            <MenuDots width='0.5em' height='0.5em' />
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {/********* ENTRIES ************/}
          <Dropdown.Item
            as='button'
            style={{ fontSize: '1.3rem' }}
            disabled={isDisabled}
            className='d-flex align-items-center gap-3 mb-1'
            onClick={() => navigate(`/operation/${redirectUrl}`)}
          >
            <Cogs />
            Entries
          </Dropdown.Item>
          {/********* ACTIVE TRANSACTIONS ************/}
          <Dropdown.Item
            as='button'
            style={{ fontSize: '1.3rem' }}
            disabled={isDisabled}
            className='d-flex align-items-center gap-3 mb-1'
            onClick={() => navigate(`/reports/active/${redirectUrl}`)}
          >
            <CashRegister />
            Active Transactions
          </Dropdown.Item>
          {/********* CLOSED TRANSACTIONS ************/}
          <Dropdown.Item
            as='button'
            style={{ fontSize: '1.3rem' }}
            disabled={isDisabled}
            className='d-flex align-items-center gap-3 mb-1'
            onClick={() => navigate(`/reports/closed/${redirectUrl}`)}
          >
            <HandshakeSlash />
            Closed Transactions
          </Dropdown.Item>
          {/********* PROFILE ************/}
          <Dropdown.Item
            as='button'
            style={{ fontSize: '1.3rem' }}
            disabled={isDisabled}
            className='d-flex align-items-center gap-3 mb-1'
            onClick={() => navigate(`/profile/${employee._id}`)}
          >
            <AddressCard />
            Profile
          </Dropdown.Item>
          {/********* TOGGLE BLOCK USER ************/}
          <Dropdown.Item
            as='button'
            style={{ fontSize: '1.3rem' }}
            disabled={isDisabled}
            className='d-flex align-items-center gap-3 mb-1'
            onClick={handleBlock}
          >
            {loading && <Loading size={1.5} custom={{ padding: 0 }} />}
            {employee.isBlocked && !loading ? (
              <UserChecked className={!isDisabled && 'text-success'} />
            ) : (
              !loading && (
                <UserBlock className={!isDisabled && 'text-warning'} />
              )
            )}
            {employee.isBlocked ? 'Unblock' : 'Block'}
          </Dropdown.Item>
          {/********* REMOVE USER ************/}
          <Dropdown.Item
            as='button'
            style={{ fontSize: '1.3rem' }}
            disabled={isDisabled}
            className='d-flex align-items-center gap-3 mb-1'
            onClick={() => setToggleDelete(true)}
          >
            {delete_loading ? (
              <Loading size={1.5} custom={{ padding: 0 }} />
            ) : (
              <Trash className={!isDisabled && 'text-danger'} />
            )}
            Remove
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default EmployeeActions
