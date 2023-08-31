import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import style from './style.module.scss'
import actions from '../../actions'
import { HeaderAlert, Loader, MemberCard, AltTable } from '../../components'
import Row from './Row'

const Employees = () => {
  const [skipValue, setSkipValue] = useState(0)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.isAuth)
  const { loading, error, employees } = useSelector(
    (state) => state.listEmployees
  )

  useEffect(() => {
    dispatch(actions.employees.listEmployees({ manager: user._id }))
  }, [])

  return (
    <>
      <Button
        variant='success'
        size='lg'
        style={{
          position: 'absolute',
          top: '10rem',
          right: '5rem',
          zIndex: '111',
        }}
        onClick={() => navigate('/employees/new')}
      >
        {t('add-new-employee')}
      </Button>
      <div className={style.employees}>
        <h1 className='main-header'>{t('employees-list')}</h1>
        <div className={style.employees__table}>
          <AltTable>
            <thead>
              <tr>
                <th>#</th>
                <th>{t('code')}</th>
                <th>{t('full-name')}</th>
                <th>{t('photo')}</th>
                <th>{t('registration-date')}</th>
                <th>{t('color-code')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody style={{ position: 'relative' }}>
              {loading ? (
                <Loader
                  size='6'
                  center
                  options={{ animation: 'border' }}
                  custom={{ transform: 'unset' }}
                />
              ) : error ? (
                <HeaderAlert
                  position='relative'
                  type='danger'
                  size='3'
                  text={error}
                />
              ) : (
                employees &&
                employees.map((employee, idx) => (
                  <Row
                    key={employee._id}
                    employee={employee}
                    idx={idx + skipValue}
                  />
                ))
              )}
            </tbody>
          </AltTable>
        </div>
        <div className={style.employees__content}>
          {loading ? (
            <Loader
              size='6'
              center
              options={{ animation: 'border' }}
              custom={{ transform: 'unset' }}
            />
          ) : error ? (
            <HeaderAlert
              position='relative'
              type='danger'
              size='3'
              text={error}
            />
          ) : (
            employees &&
            employees.map((employee, idx) => (
              <MemberCard key={employee._id} user={employee} />
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default Employees
