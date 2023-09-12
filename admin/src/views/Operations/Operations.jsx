import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Row from './Row'
import {
  Table,
  Pagination,
  HeaderAlert,
  Loader,
  OperationFilter,
  FilterModal,
  FilterButton,
  Panel,
} from '@/src/components'
import actions from '@/src/actions'

const Operations = () => {
  const [isFilterModal, setIsFilterModal] = useState(false)
  const [skipValue, setSkipValue] = useState(0)
  const [filter, setFilter] = useState({
    arabicName: '',
    englishName: '',
    code: '',
    value: '',
    currency: '',
    state: '',
    dueDate: '',
  })
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const location = useLocation()
  const state = new URLSearchParams(location.search).get('state')
  const { loading, error, count, operations } = useSelector(
    (state) => state.listAllOperations
  )

  const initiateOperationFiltration = (skip) => {
    let query = { ...filter }

    if (skip?.skip || skip?.skip === 0) {
      setSkipValue(skip.skip)
      query = { ...filter, ...skip }
    }

    dispatch(actions.operations.listAllOperations(query))
  }

  const resetFilterOperation = (_) => {
    setSkipValue(0)
    dispatch(actions.operations.listAllOperations())
  }

  useEffect(() => {
    state && dispatch(actions.operations.listAllOperations({ state }))
  }, [state])

  useEffect(() => {
    !state && dispatch(actions.operations.listAllOperations())
  }, [])

  return (
    <>
      <div className={style.operations}>
        <h1 className='main-header'>{t('operations-records')}</h1>

        <FilterModal
          isFilter={isFilterModal}
          setIsFilter={setIsFilterModal}
          type='operation'
          options={{
            searchFilter: filter,
            setSearchFilter: setFilter,
            resetFilterOperations: resetFilterOperation,
            filterOperationHandler: initiateOperationFiltration,
          }}
        />

        <OperationFilter
          hidden
          op
          searchFilter={filter}
          setSearchFilter={setFilter}
          resetFilterOperations={resetFilterOperation}
          filterOperationHandler={initiateOperationFiltration}
        />

        <FilterButton onClick={() => setIsFilterModal(true)} />

        <Table>
          <thead>
            <th>#</th>
            <th>{t('operation-code')}</th>
            <th>{t('first-party')}</th>
            <th>{t('second-party')}</th>
            <th>{t('operation-value')}</th>
            <th>{t('note')}</th>
            <th>{t('operation-currency')}</th>
            <th>{t('status')}</th>
            <th>{t('due-date')}</th>
            <th>{t('createdAt')}</th>
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
              operations &&
              operations.map((operation, idx) => (
                <Row
                  key={operation._id}
                  idx={idx + skipValue}
                  operation={operation}
                />
              ))
            )}
          </tbody>
        </Table>
        <div className={style.operations__content}>
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
            operations &&
            operations.map((operation) => (
              <Panel key={operation._id} record={operation} />
            ))
          )}
        </div>
        {count > 0 && (
          <Pagination
            count={Math.ceil(count / 5)}
            moveToPageHandler={(skip) => initiateOperationFiltration(skip)}
          />
        )}
      </div>
    </>
  )
}

export default Operations
