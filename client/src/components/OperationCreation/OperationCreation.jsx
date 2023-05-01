import React, { useState, useEffect } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import {
  Input,
  DropdownMenu,
  Currency,
  Loader,
  DateInput,
} from '../../components'
import {
  Info,
  Coins,
  FunnelDollar,
  HandDollar,
  HandPlus,
  Note,
} from '../../icons'
import actions from '../../actions'
import constants from '../../constants'

const Details = ({ peerInfo }) => {
  const [peerType, setPeerType] = useState('')
  const [currency, setCurrency] = useState('')
  const [value, setValue] = useState(0)
  const [dueDate, setDueDate] = useState(null)
  const [note, setNote] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.isAuth)
  const { t } = useTranslation()
  const lang = i18next.language
  const {
    loading: curr_loading,
    error: curr_error,
    currencies,
  } = useSelector((state) => state.listCurrencies)

  const { loading, error, message } = useSelector(
    (state) => state.createOperation
  )

  const requestCurrenciesHandler = (_) => {
    dispatch(actions.currencies.listAllCurrencies())
  }

  const listCurrenciesHandler = (_) => {
    if (currencies) {
      return currencies.map((currency) => ({
        text: <Currency currency={currency} inline />,
        value: currency._id,
      }))
    }
    return []
  }

  const $inputOperationValue = document.getElementById('input-operation-value')

  if ($inputOperationValue) {
    $inputOperationValue.addEventListener('mousewheel', (e) => {
      $inputOperationValue.blur()
    })
  }

  const CreateOperationHandler = (_) => {
    const data = {
      initiator: {
        user: user._id,
        type: peerType === 'credit' ? 'debt' : 'credit',
        value: 0,
      },
      peer: {
        user: peerInfo._id,
        type: peerType,
        value: parseInt(value),
      },
      note,
      currency,
    }
    if (dueDate) {
      data.dueDate = dueDate.toISOString()
    }

    if (user.isProvider) {
      data.initiator.type = 'credit'
      data.peer.type = 'debt'
      data.currency = currencies.find((currency) => currency.abbr === 'AED')._id
    }

    dispatch(actions.operations.createOperation(data))
  }

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        navigate('/operation')
      }, 3000)
    }
  }, [message])

  useEffect(() => {
    requestCurrenciesHandler()
    return () => dispatch({ type: constants.operations.CREATE_OPERATION_RESET })
  }, [])

  return (
    <div className={style.details}>
      <div className={style.details__peer}>
        <img src={`/api/files/${peerInfo.image}`} alt={peerInfo.name} />
        <h2>{lang === 'ar' ? peerInfo.arabicName : peerInfo.name}</h2>
      </div>
      <div className={style.details__data}>
        {!user.isProvider && (
          <>
            <p className={style.details__data_label}>{t('peer-type')}</p>
            <DropdownMenu
              onSelectHandler={(value) => setPeerType(value)}
              data={{
                label: 'peer-select-type',
                icon: <Info />,
                items: [
                  {
                    icon: <HandDollar />,
                    text: 'credit-sales',
                    value: 'credit',
                  },
                  { icon: <HandPlus />, text: 'debt-purchase', value: 'debt' },
                ],
              }}
            />
          </>
        )}

        <Input
          icon={<FunnelDollar />}
          placeholder={t('operation-value')}
          type='number'
          label={t('operation-value')}
          name='value'
          value={value}
          id='input-operation-value'
          onChange={(e) => setValue(e.target.value)}
          className={style.details__data_value}
        />
        {!user.isProvider && (
          <>
            <p className={style.details__data_label}>
              {t('operation-currency')}
            </p>
            <DropdownMenu
              onSelectHandler={(value) => setCurrency(value)}
              loading={curr_loading}
              error={curr_error}
              data={{
                label: 'operation-currency-select',
                icon: <Coins />,
                items: listCurrenciesHandler(),
              }}
            />
          </>
        )}

        <p className={style.details__data_label}>{t('operation-due-date')}</p>
        <DateInput
          name='dueDate'
          getExpiryDate={(date) => setDueDate(date)}
          custom={{ marginLeft: '0' }}
        />

        <div className={style.details__note}>
          <span>
            {' '}
            <Note />{' '}
          </span>
          <label htmlFor='note'>{t('operation-note')}</label>
          <textarea
            name='note'
            id='note'
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            direction: 'ltr',
            alignItems: 'center',
          }}
        >
          {error && (
            <p style={{ marginRight: '2rem', color: 'red' }}>{error}</p>
          )}
          {message && (
            <p style={{ marginRight: '2rem', color: 'green' }}>{message}</p>
          )}
          <button
            className={style.details__data_action}
            onClick={CreateOperationHandler}
          >
            {loading ? (
              <Loader center size='4' options={{ animation: 'border' }} />
            ) : (
              <span> {t('execute')} </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Details
