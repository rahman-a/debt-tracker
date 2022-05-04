import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { v4 as uuidv4 } from 'uuid'
import { Badge, Button, Modal, Alert } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from '../../components'
import labels from '../../config/label'
import messages from '../../config/messages'
import actions from '../../actions'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const Country = ({ country }) => {
  const { t } = useTranslation()
  return (
    <span style={{ flexDirection: 'row' }}>
      {country.name ? (
        <>
          <img
            src={country.image}
            alt={country.name}
            width='25'
            style={{ marginRight: '1rem' }}
          />
          {`${country.abbr} ${country.name}`}
        </>
      ) : (
        <Badge bg='danger'>{t('not-provided')}</Badge>
      )}
    </span>
  )
}

const ToggleAccount = ({ isActive, setIsActive, memberId }) => {
  const dispatch = useDispatch()
  const { loading, isConfirmed } = useSelector((state) => state.toggleUser)
  const { t } = useTranslation()

  const setMemberActivation = (e) => {
    dispatch(actions.admin.toggleUser(memberId))
  }

  const lang = i18next.language

  useEffect(() => {
    setIsActive(isConfirmed)
  }, [isConfirmed])

  return (
    <div className={style.segment__toggle}>
      {loading && <Loader size='5' center options={{ animation: 'border' }} />}
      <strong style={{ color: 'red' }}>
        {' '}
        <i> {t('account-not-active')} </i>{' '}
      </strong>

      <div
        className={`${style.segment__toggle_state} 
            ${
              lang === 'ar' && !isActive ? style.segment__toggle_state_ar : ''
            }`}
      >
        <label htmlFor='state'>
          {loading && <span className={style.segment__toggle_backdrop}></span>}
          <span
            className={
              isActive
                ? `${style.segment__toggle_active} 
                    ${lang === 'ar' && style.segment__toggle_active_ar}`
                : ''
            }
          ></span>
        </label>

        <input
          disabled={loading ? true : false}
          type='checkbox'
          id='state'
          name='state'
          onChange={setMemberActivation}
        />
      </div>

      <strong style={{ color: 'green' }}>
        {' '}
        <i> {t('account-active')} </i>{' '}
      </strong>
    </div>
  )
}

const MemberColorCode = ({ color, memberId }) => {
  const [colorToggle, setColorToggle] = useState(false)
  const [code, setCode] = useState(null)
  const [label, setLabel] = useState(null)
  const [isReport, setIsReport] = useState(false)
  const [reportId, setReportId] = useState('')
  const dispatch = useDispatch()
  const { loading, error, message } = useSelector(
    (state) => state.userColorCode
  )
  const { t } = useTranslation()
  const lang = i18next.language

  const colorCodes = {
    red: '#EC4A0D',
    yellow: ' #fffb00',
    green: '#037A12',
  }

  const changeColorHandler = (_) => {
    let data

    const color = colorCodes[code]

    if (color === '#037A12') {
      data = { code: color }
    } else {
      const labelTitle = labels.find((lb) => lb.label === label)
      const message = reportId ? messages[label](reportId) : messages[label]

      data = {
        code: color,
        state: {
          label: { en: labelTitle['en'], ar: labelTitle['ar'] },
          message,
        },
      }
      if (reportId) {
        data.state.report = reportId
      }
    }
    dispatch(actions.admin.userColorCode(memberId, data))
  }

  const setLabelValue = (e) => {
    setLabel(e.target.value)
    const type = labels.find((lb) => lb.label === e.target.value).type
    type === 'payment' ? setIsReport(true) : setIsReport(false)
  }

  return (
    <>
      <Modal show={colorToggle} onHide={() => setColorToggle(false)}>
        <Modal.Header> {t('change-member-color-code')} </Modal.Header>

        <Modal.Body>
          {message && (
            <Alert variant='success' className='text-center'>
              {message}
            </Alert>
          )}

          {error && (
            <Alert variant='danger' className='text-center'>
              {error}
            </Alert>
          )}

          {loading && (
            <div style={{ textAlign: '-webkit-center' }}>
              <Loader size='5' options={{ animation: 'border' }} />
            </div>
          )}

          <div className={style.segment__color_change}>
            <div className={style.segment__color_types}>
              <h3>{t('select-color')}</h3>

              <span
                onClick={() => setCode('green')}
                className={
                  code === 'green' ? style.segment__color_types_select : ''
                }
              >
                {t('green')}
              </span>

              <span
                onClick={() => setCode('yellow')}
                className={
                  code === 'yellow' ? style.segment__color_types_select : ''
                }
              >
                {t('yellow')}
              </span>

              <span
                onClick={() => setCode('red')}
                className={
                  code === 'red' ? style.segment__color_types_select : ''
                }
              >
                {t('red')}
              </span>
            </div>

            <div className={style.segment__color_state}>
              <h3>{t('reason-change-color-code')}</h3>
              <select
                name='label'
                id='label'
                onChange={(e) => setLabelValue(e)}
                style={{ fontSize: '1.4rem' }}
              >
                <option value=''> .... </option>
                {labels.map((label) => (
                  <option key={label.label} value={label.label}>
                    {lang === 'ar' ? label.ar : label.en}
                  </option>
                ))}
              </select>
            </div>

            {isReport && (
              <div className={style.segment__color_state}>
                <h3> {t('enter-related-report-id')} </h3>
                <input
                  type='text'
                  name='report'
                  placeholder={t('enter-related-report-id')}
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  className={style.segment__color_report}
                />
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='success' size='lg' onClick={changeColorHandler}>
            {t('confirm-change-color-code')}
          </Button>

          <Button
            variant='danger'
            size='lg'
            onClick={() => setColorToggle(false)}
          >
            {t('cancel-change-color-code')}
          </Button>
        </Modal.Footer>
      </Modal>

      <div
        className={`${style.segment__color} ${
          lang === 'ar' ? style.segment__color_ar : ''
        }`}
      >
        <div
          className={style.segment__color_block}
          style={{ backgroundColor: color }}
        ></div>

        <Button variant='warning' onClick={() => setColorToggle(true)}>
          {' '}
          {t('change-color-code')}{' '}
        </Button>
      </div>
    </>
  )
}

const ProfileSegment = ({
  title,
  text,
  type,
  placeholder,
  isConfirmed,
  memberId,
  color,
}) => {
  const [isActive, setIsActive] = useState(false)

  const { t } = useTranslation()
  const lang = i18next.language

  useEffect(() => {
    setIsActive(isConfirmed)
  }, [isConfirmed])

  return (
    <div
      className={`${style.segment} ${lang === 'ar' ? style.segment_ar : ''}`}
    >
      <h3> {t(title)} </h3>
      <p style={{ display: placeholder ? 'block' : 'flex' }}>
        {placeholder ? (
          <Badge bg='danger'>{t('not-provided')}</Badge>
        ) : type === 'email' || type === 'phones' ? (
          text.map((t) => <span key={t._id}>{t.email || t.phone}</span>)
        ) : type === 'outPhones' && text ? (
          text.map((t) => <span key={uuidv4()}>{t}</span>)
        ) : type === 'country' ? (
          <Country country={text} />
        ) : type === 'toggle' ? (
          <ToggleAccount
            isActive={isActive}
            setIsActive={setIsActive}
            memberId={memberId}
          />
        ) : type === 'color' ? (
          <MemberColorCode color={color} memberId={memberId} />
        ) : (
          text
        )}
      </p>
    </div>
  )
}

export default ProfileSegment
