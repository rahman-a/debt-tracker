import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Pagination,
  Table,
  Filter,
  Loader,
  HeaderAlert,
  ReportPrinting,
} from '@/src/components'
import { FilterSearch, Printer, Times } from '@/src/icons'
import actions from '@/src/actions'
import constants from '@/src/constants'

/**
 * NOTE ==> show only closed operation and sort them according to date of payment
 */

const Reports = () => {
  const [isFilter, setIsFilter] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [searchFilter, setSearchFilter] = useState({
    code: null,
    type: null,
    name: null,
    currency: null,
    dueDate: null,
    paymentDate: null,
    state: null,
    isActive: false,
  })
  const dispatch = useDispatch()

  const { loading, error, count, reports } = useSelector(
    (state) => state.listAllReports
  )

  const { t } = useTranslation()

  const filterOperationHandler = (skip) => {
    let query = { ...searchFilter }
    if (skip) query.skip = skip.skip
    dispatch(actions.reports.listAllReports(query))
  }

  const resetFilterOperations = (_) => {
    dispatch(actions.reports.listAllReports({ isActive: false }))
  }

  useEffect(() => {
    loading && setIsFilter(false)
  }, [loading])

  useEffect(() => {
    dispatch(actions.reports.listAllReports({ isActive: false }))
    return () => dispatch({ type: constants.reports.REPORTS_ALL_RESET })
  }, [])

  return (
    <>
      <Modal show={isFilter} onHide={() => setIsFilter(false)}>
        <span
          className={style.reports__close}
          onClick={() => setIsFilter(false)}
        >
          <Times />
        </span>
        <Filter
          closed
          setSearchFilter={setSearchFilter}
          searchFilter={searchFilter}
          filterOperationHandler={filterOperationHandler}
          resetFilterOperations={resetFilterOperations}
        />
      </Modal>
      <ReportPrinting
        show={isPrinting}
        hideHandler={() => setIsPrinting(false)}
      />
      <div className={style.reports}>
        <Button
          variant='light'
          className={style.reports__print}
          onClick={() => setIsPrinting(true)}
        >
          <Printer />
          <span>{t('print')}</span>
        </Button>
        <h1>{t('closed-reports-records')}</h1>
        <div className={style.reports__wrapper}>
          <div className={style.reports__actions}>
            <button
              className={style.reports__filter}
              onClick={() => setIsFilter(true)}
            >
              <span>
                {' '}
                <FilterSearch />{' '}
              </span>
              <span> {t('filter')} </span>
            </button>
          </div>

          <Filter
            hidden
            closed
            setSearchFilter={setSearchFilter}
            searchFilter={searchFilter}
            filterOperationHandler={filterOperationHandler}
            resetFilterOperations={resetFilterOperations}
          />

          {loading && <Loader size='8' options={{ animation: 'border' }} />}
          {error && (
            <HeaderAlert
              position='relative'
              size='2'
              text={error}
              type='danger'
            />
          )}

          {reports && (
            <>
              <Table records={reports} closed={true} />
              <Pagination
                count={Math.ceil(count / 5)}
                moveToPageHandler={(skip) => filterOperationHandler(skip)}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Reports
