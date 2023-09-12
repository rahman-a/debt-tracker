import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Row from './Row'
import {
  Table,
  Loader,
  HeaderAlert,
  SideAlert,
  Pagination,
  UserFilter,
  FilterButton,
  FilterModal,
  MemberCard,
} from '@/src/components'
import actions from '@/src/actions'
import constants from '@/src/constants'

const Members = () => {
  const [isFilterModal, setIsFilterModal] = useState(false)
  const [skipValue, setSkipValue] = useState(0)
  const [filter, setFilter] = useState({
    arabicName: '',
    englishName: '',
    code: '',
    username: '',
    color: '',
    isProvider: '',
    email: '',
    phone: '',
    country: '',
  })

  const dispatch = useDispatch()
  const { loading, error, members, count } = useSelector(
    (state) => state.members
  )
  const { error: delete_error, message } = useSelector(
    (state) => state.deleteUser
  )
  const { t } = useTranslation()

  const initiateUsersFiltration = (skip) => {
    let query = { ...filter }

    if (skip?.skip || skip?.skip === 0) {
      setSkipValue(skip.skip)
      query = { ...filter, ...skip }
    }

    dispatch(actions.admin.members(query))
  }

  const resetFilterOperation = (_) => {
    dispatch(actions.admin.members())
  }

  useEffect(() => {
    loading && setIsFilterModal(false)
  }, [loading])

  useEffect(() => {
    dispatch(actions.admin.members())
  }, [message])

  useEffect(() => {
    return () => dispatch({ type: constants.admin.USER_DELETE_RESET })
  }, [])

  useEffect(() => {
    console.log('Members: ', members)
  }, [members])

  return (
    <>
      <SideAlert
        type='danger'
        text={delete_error}
        isOn={delete_error ? true : false}
      />

      <SideAlert type='success' text={message} isOn={message ? true : false} />

      <div className={style.members}>
        <h1 className='main-header'>{t('member-list')}</h1>

        <FilterModal
          isFilter={isFilterModal}
          setIsFilter={setIsFilterModal}
          type='user'
          options={{
            searchFilter: filter,
            setSearchFilter: setFilter,
            resetFilterOperations: resetFilterOperation,
            filterOperationHandler: initiateUsersFiltration,
          }}
        />

        <UserFilter
          hidden
          searchFilter={filter}
          setSearchFilter={setFilter}
          resetFilterOperations={resetFilterOperation}
          filterOperationHandler={initiateUsersFiltration}
        />

        <FilterButton onClick={() => setIsFilterModal(true)} />

        <Table>
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
              <HeaderAlert type='danger' size='3' text={error} />
            ) : (
              members &&
              members.map((user, idx) => (
                <Row key={user._id} user={user} idx={idx + skipValue} />
              ))
            )}
          </tbody>
        </Table>
        <div className={style.members__content}>
          {loading ? (
            <Loader
              size='6'
              center
              options={{ animation: 'border' }}
              custom={{ transform: 'unset' }}
            />
          ) : error ? (
            <HeaderAlert type='danger' size='3' text={error} />
          ) : (
            members &&
            members.map((user, idx) => (
              <MemberCard key={user._id} user={user} />
            ))
          )}
        </div>
        {count > 0 && (
          <Pagination
            count={Math.ceil(count / 10)}
            moveToPageHandler={(skip) => initiateUsersFiltration(skip)}
          />
        )}
      </div>
    </>
  )
}

export default Members
