import React from 'react'
import style from './style.module.scss'
import { useTranslation } from 'react-i18next'
import { Input, DropdownMenu } from '@/src/components'

const TicketsFilter = ({
  hidden,
  filterOperationHandler,
  resetFilterOperations,
  searchFilter,
  setSearchFilter,
}) => {
  const { t } = useTranslation()
  const searchFilterHandler = (e) => {
    const value = { [e.target.name]: e.target.value }
    setSearchFilter({ ...searchFilter, ...value })
  }

  const selectSearchFilterHandler = (filter) => {
    setSearchFilter({ ...searchFilter, ...filter })
  }

  const resetFilterHandler = (_) => {
    const resetFilterObject = {
      title: '',
      isOpen: '',
      ticket: '',
    }
    setSearchFilter(resetFilterObject)
    resetFilterOperations()
  }

  const startFilterProcessOnEnter = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      filterOperationHandler()
    }
  }

  return (
    <div
      className={`${style.filter} ${hidden ? style.filter__hidden : ''}`}
      onKeyDown={startFilterProcessOnEnter}
    >
      <div className={style.filter__input}>
        <Input
          name='ticket'
          type='text'
          placeholder={t('ticket-id')}
          value={searchFilter['ticket']}
          className={style.filter__input_value}
          onChange={(e) => searchFilterHandler(e)}
        />
      </div>

      <div className={style.filter__input}>
        <Input
          name='title'
          type='text'
          placeholder={t('ticket-title')}
          value={searchFilter['title']}
          className={style.filter__input_value}
          onChange={(e) => searchFilterHandler(e)}
        />
      </div>

      <div className={style.filter__input}>
        <DropdownMenu
          className={style.filter__input_dropdown}
          onSelectHandler={(value) =>
            selectSearchFilterHandler({ isOpen: value })
          }
          data={{
            label: 'status',
            items: [
              { text: 'open', value: true },
              { text: 'closed', value: false },
            ],
          }}
        />
      </div>

      <div className={style.filter__input}>
        <button className={style.filter__btn} onClick={filterOperationHandler}>
          {t('search')}
        </button>
        <button className={style.filter__btn} onClick={resetFilterHandler}>
          {t('reset')}
        </button>
      </div>
    </div>
  )
}

export default TicketsFilter
