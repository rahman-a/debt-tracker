import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Row from './Row'
import {
  Table,
  Pagination,
  HeaderAlert,
  Loader,
  ReportFilter,
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
    paymentDate: '',
    isActive: false,
  })

  const dispatch = useDispatch()

  const { t } = useTranslation()

  const { loading, error, count, reports } = useSelector(
    (state) => state.listAllReports
  )

  const initiateReportsFiltration = (skip) => {
    let query = { ...filter }

    if (skip?.skip || skip?.skip === 0) {
      setSkipValue(skip.skip)
      query = { ...filter, ...skip }
    }
    dispatch(actions.reports.listAllReports(query))
  }

  const resetFilterReports = (_) => {
    setSkipValue(0)
    dispatch(actions.reports.listAllReports({ isActive: false }))
  }

  useEffect(() => {
    dispatch(actions.reports.listAllReports({ isActive: false }))
  }, [])

  return (
    <>
      <div className={style.reports}>
        <h1 className='main-header'>{t('closed-reports')}</h1>

        <FilterModal
          isFilter={isFilterModal}
          setIsFilter={setIsFilterModal}
          type='report'
          options={{
            closed: true,
            searchFilter: filter,
            setSearchFilter: setFilter,
            resetFilterOperations: resetFilterReports,
            filterOperationHandler: initiateReportsFiltration,
          }}
        />

        <ReportFilter
          hidden
          closed
          searchFilter={filter}
          setSearchFilter={setFilter}
          resetFilterOperations={resetFilterReports}
          filterOperationHandler={initiateReportsFiltration}
        />

        <FilterButton onClick={() => setIsFilterModal(true)} />

        <Table>
          <thead>
            <th>#</th>
            <th>{t('report-code')}</th>
            <th>{t('first-party')}</th>
            <th>{t('second-party')}</th>
            <th>{t('operation-value')}</th>
            <th>{t('note')}</th>
            <th>{t('currency')}</th>
            <th>{t('payment-date')}</th>
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
              reports &&
              reports.map((report, idx) => (
                <Row
                  due={true}
                  key={report._id}
                  idx={idx + skipValue}
                  report={report}
                />
              ))
            )}
          </tbody>
        </Table>
        <div className={style.reports__content}>
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
            reports &&
            reports.map((report, idx) => (
              <Panel due={true} key={report._id} record={report} />
            ))
          )}
        </div>
        {count > 0 && (
          <Pagination
            count={Math.ceil(count / 5)}
            moveToPageHandler={(skip) => initiateReportsFiltration(skip)}
          />
        )}
      </div>
    </>
  )
}

export default Operations
