import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Row from './Row'
import {
  AltTable,
  Pagination,
  Loader,
  HeaderAlert,
  FilterButton,
  FilterModal,
  TicketsFilter,
  Replay,
  TicketCard,
} from '@/src/components'
import actions from '@/src/actions'

const Tickets = () => {
  const [isFilterModal, setIsFilterModal] = useState(false)
  const [isEditor, setIsEditor] = useState(false)

  const [filter, setFilter] = useState({
    ticket: '',
    title: '',
    isOpen: '',
  })

  const [skipValue, setSkipValue] = useState(0)

  const { user } = useSelector((state) => state.isAuth)
  const { loading, error, count, tickets } = useSelector(
    (state) => state.listTickets
  )

  const dispatch = useDispatch()

  const { t } = useTranslation()

  const initiateUsersFiltration = (skip) => {
    let query = { ...filter }

    if (skip?.skip || skip?.skip === 0) {
      setSkipValue(skip.skip)
      query = { ...filter, ...skip }
    }

    dispatch(actions.tickets.listAllTickets(user._id, query))
  }

  const resetFilterOperation = (_) => {
    dispatch(actions.tickets.listAllTickets(user._id))
  }

  useEffect(() => {
    loading && setIsFilterModal(false)
  }, [loading])

  useEffect(() => {
    dispatch(actions.tickets.listAllTickets(user._id))
  }, [])

  return (
    <>
      <div className={style.tickets}>
        <h1>{t('tickets-records')}</h1>

        <div className={style.tickets__wrapper}>
          <div className={style.tickets__actions}>
            <button onClick={() => setIsEditor(true)}>{t('new-ticket')}</button>
            <FilterButton onClick={() => setIsFilterModal(true)} />
          </div>
        </div>

        {isEditor && <Replay setIsEditor={setIsEditor} type='create' />}

        <FilterModal
          isFilter={isFilterModal}
          setIsFilter={setIsFilterModal}
          options={{
            searchFilter: filter,
            setSearchFilter: setFilter,
            resetFilterOperations: resetFilterOperation,
            filterOperationHandler: initiateUsersFiltration,
          }}
        />

        <TicketsFilter
          hidden
          searchFilter={filter}
          setSearchFilter={setFilter}
          resetFilterOperations={resetFilterOperation}
          filterOperationHandler={initiateUsersFiltration}
        />

        <AltTable>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('ticket-id')}</th>
              <th style={{ width: '25rem' }}>{t('ticket-summery')}</th>
              <th>{t('status')}</th>
              <th>{t('createdAt')}</th>
              <th>{t('last-updated')}</th>
              <th>{t('close-ticket')}</th>
            </tr>
          </thead>
          <tbody
            style={{
              position: 'relative',
              height: error ? '5rem' : 'auto',
            }}
          >
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
              tickets &&
              tickets.map((ticket, idx) => (
                <Row key={ticket._id} ticket={ticket} idx={idx + skipValue} />
              ))
            )}
          </tbody>
        </AltTable>
        <div className={style.tickets__content}>
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
            tickets &&
            tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))
          )}
        </div>
        {count > 0 && (
          <Pagination
            count={Math.ceil(count / 5)}
            moveToPageHandler={(skip) => initiateUsersFiltration(skip)}
          />
        )}
      </div>
    </>
  )
}

export default Tickets
