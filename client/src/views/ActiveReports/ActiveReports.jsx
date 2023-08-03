import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { Button, Modal } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Pagination,
  Table,
  Filter,
  Loader,
  HeaderAlert,
  ReportPrinting,
} from '../../components'
import { FilterSearch, Times, Printer } from '../../icons'
import actions from '../../actions'
import constants from '../../constants'

const Reports = () => {
  const [isFilter, setIsFilter] = useState(false)
  const [isDueDate, setIsDueDate] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const [searchFilter, setSearchFilter] = useState({
    code: null,
    type: null,
    name: null,
    currency: null,
    dueDate: null,
    paymentDate: null,
    state: null,
  })

  const dispatch = useDispatch()

  const { loading, error, count, reports } = useSelector(
    (state) => state.listAllReports
  )

  const { t } = useTranslation()

  const { id } = useParams()

  const listReportsWithDueDate = (_) => {
    dispatch(actions.reports.listAllReports())
    setIsDueDate(true)
  }

  const listReportsWithoutDueDate = (_) => {
    dispatch(actions.reports.listAllReports({ notDue: false }))
    setIsDueDate(false)
  }

  const filterOperationHandler = (skip) => {
    let query = { ...searchFilter }
    if (skip) query.skip = skip.skip
    dispatch(actions.reports.listAllReports(query))
  }

  const resetFilterOperations = (_) => {
    dispatch(actions.reports.listAllReports())
  }

  useEffect(() => {
    loading && setIsFilter(false)
  }, [loading])

  useEffect(() => {
    id && dispatch(actions.reports.listAllReports({ code: id }))
  }, [id, dispatch])

  useEffect(() => {
    !id && dispatch(actions.reports.listAllReports())
    return () => dispatch({ type: constants.reports.REPORTS_ALL_RESET })
  }, [])

  // for only test
  useEffect(() => {
    console.log('Reports: ', reports)
  }, [reports])

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
          isDueDate={!isDueDate}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          filterOperationHandler={filterOperationHandler}
          resetFilterOperations={resetFilterOperations}
        />
      </Modal>
      <ReportPrinting
        show={isPrinting}
        hideHandler={() => setIsPrinting(false)}
      />
      <div className={style.reports}>
        {/* <button className={style.reports__end}>
                close report
            </button> */}
        <Button
          variant='success'
          className={style.reports__print}
          onClick={() => setIsPrinting(true)}
        >
          <Printer />
          <span>{t('print')}</span>
        </Button>
        <h1>{t('active-reports-records')}</h1>
        <div
          className={style.reports__wrapper}
          style={{ textAlign: !isDueDate ? '-webkit-center' : 'unset' }}
        >
          <div className={style.reports__actions}>
            <button
              className={isDueDate ? style.reports__actions_active : ''}
              onClick={listReportsWithDueDate}
            >
              {t('reports-due-date')}
            </button>

            <button
              className={!isDueDate ? style.reports__actions_active : ''}
              onClick={listReportsWithoutDueDate}
            >
              {t('reports-no-due-date')}
            </button>

            <button
              className={style.reports__filter}
              onClick={() => setIsFilter(true)}
            >
              <span>
                <FilterSearch />
              </span>
              <span> {t('filter')} </span>
            </button>
          </div>

          <Filter
            hidden
            isDueDate={!isDueDate}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            filterOperationHandler={filterOperationHandler}
            resetFilterOperations={resetFilterOperations}
          />

          {loading && <Loader size='8' options={{ animation: 'border' }} />}
          {error && <HeaderAlert size='2' text={error} type='danger' />}

          {reports && (
            <>
              <Table records={reports} due={isDueDate} reports />
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
