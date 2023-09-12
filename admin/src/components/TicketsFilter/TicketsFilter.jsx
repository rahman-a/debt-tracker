import React from 'react'
import style from './style.module.scss'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { Input, DropdownMenu } from '@/src/components'

const TicketsFilter = ({
  hidden,
  filterOperationHandler,
  resetFilterOperations,
  searchFilter,
  setSearchFilter,
}) => {
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
      name: '',
      email: '',
      phone: '',
      code: '',
      username: '',
    }
    setSearchFilter(resetFilterObject)
    resetFilterOperations()
  }

  const startFilterProcessOnEnter = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      filterOperationHandler()
    }
  }

  const { t } = useTranslation()

  const filterClasses = classnames(style.filter, {
    [style.filter__hidden]: hidden,
  })

  return (
    <div className={filterClasses} onKeyDown={startFilterProcessOnEnter}>
      <div className={style.filter__input}>
        <Input
          name='code'
          type='text'
          placeholder='code'
          value={searchFilter['code']}
          className={style.filter__input_value}
          onChange={(e) => searchFilterHandler(e)}
        />
      </div>

      <div className={style.filter__input}>
        <Input
          name='title'
          type='text'
          placeholder='title'
          value={searchFilter['title']}
          className={style.filter__input_value}
          onChange={(e) => searchFilterHandler(e)}
        />
      </div>

      <div className={style.filter__input}>
        <Input
          name='name'
          type='text'
          placeholder='name'
          value={searchFilter['name']}
          className={style.filter__input_value}
          onChange={(e) => searchFilterHandler(e)}
        />
      </div>

      <div className={style.filter__input}>
        <Input
          name='username'
          type='text'
          placeholder='username'
          value={searchFilter['username']}
          className={style.filter__input_value}
          onChange={(e) => searchFilterHandler(e)}
        />
      </div>

      <div className={style.filter__input}>
        <Input
          name='email'
          type='text'
          placeholder='email'
          value={searchFilter['email']}
          className={style.filter__input_value}
          onChange={(e) => searchFilterHandler(e)}
        />
      </div>

      <div className={style.filter__input}>
        <Input
          name='phone'
          type='text'
          placeholder='phone'
          value={searchFilter['phone']}
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
