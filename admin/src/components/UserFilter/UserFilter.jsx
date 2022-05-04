import React from 'react'
import style from './style.module.scss'
import { Input, DropdownMenu } from '../../components'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Filter = ({
  hidden,
  filterOperationHandler,
  resetFilterOperations,
  searchFilter,
  setSearchFilter,
}) => {
  const colorCode = {
    green: '#037A12',
    yellow: '#fffb00',
    red: '#EC4A0D',
  }
  const searchFilterHandler = (e) => {
    let value = {}
    if (e.target.name === 'color') {
      value = { [e.target.name]: colorCode[e.target.value] }
    } else {
      value = { [e.target.name]: e.target.value }
    }
    setSearchFilter({ ...searchFilter, ...value })
  }

  const selectSearchFilterHandler = (filter) => {
    setSearchFilter({ ...searchFilter, ...filter })
  }

  const resetFilterHandler = (_) => {
    const resetFilterObject = {
      arabicName: '',
      englishName: '',
      code: '',
      username: '',
      color: '',
      isProvider: '',
      isActive: '',
      email: '',
      phone: '',
      country: '',
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
  const lang = i18next.language

  return (
    <div
      className={`${style.filter} ${hidden ? style.filter__hidden : ''}`}
      onKeyDown={startFilterProcessOnEnter}
    >
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

      {lang === 'ar' ? (
        <div className={style.filter__input}>
          <Input
            name='arabicName'
            type='text'
            placeholder='name'
            value={searchFilter['arabicName']}
            className={style.filter__input_value}
            onChange={(e) => searchFilterHandler(e)}
          />
        </div>
      ) : (
        <div className={style.filter__input}>
          <Input
            name='englishName'
            type='text'
            placeholder='name'
            value={searchFilter['englishName']}
            className={style.filter__input_value}
            onChange={(e) => searchFilterHandler(e)}
          />
        </div>
      )}

      <div className={style.filter__input}>
        <Input
          name='country'
          type='text'
          placeholder='country'
          value={searchFilter['country']}
          className={style.filter__input_value}
          onChange={(e) => searchFilterHandler(e)}
        />
      </div>

      <div className={style.filter__input}>
        <DropdownMenu
          className={style.filter__input_dropdown}
          onSelectHandler={(value) =>
            selectSearchFilterHandler({ isProvider: value })
          }
          data={{
            label: 'provider',
            items: [
              { text: 'yes', value: 'true' },
              { text: 'no', value: 'false' },
            ],
          }}
        />
      </div>

      <div className={style.filter__input}>
        <DropdownMenu
          className={style.filter__input_dropdown}
          onSelectHandler={(value) =>
            selectSearchFilterHandler({ color: value })
          }
          data={{
            label: 'color',
            items: [
              { text: 'green', value: colorCode['green'] },
              { text: 'yellow', value: colorCode['yellow'] },
              { text: 'red', value: colorCode['red'] },
            ],
          }}
        />
      </div>

      <div className={style.filter__input}>
        <DropdownMenu
          className={style.filter__input_dropdown}
          onSelectHandler={(value) =>
            selectSearchFilterHandler({ isActive: value })
          }
          data={{
            label: 'active-member',
            items: [
              { text: 'yes', value: 'true' },
              { text: 'no', value: 'false' },
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

export default Filter
