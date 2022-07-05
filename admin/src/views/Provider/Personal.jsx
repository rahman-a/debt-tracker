import React from 'react'
import style from './style.module.scss'
import { Form } from 'react-bootstrap'
import flags from 'country-flag-emoji-json'
import { useTranslation } from 'react-i18next'

const Personal = ({ getInfoValues, setCountry }) => {
  const { t } = useTranslation()

  const countries = (_) => {
    return flags.map((flag) => ({
      name: flag.name,
      abbr: flag.emoji,
      image: flag.image,
    }))
  }

  const selectProviderCountry = (value) => {
    const country = countries().find((country) => country.abbr === value)
    setCountry(country)
  }

  return (
    <div className={style.provider__segment}>
      <h2>{t('personal-info')}</h2>
      <Form.Group
        style={{ direction: 'rtl' }}
        className='mb-3'
        controlId='formBasicArabic'
      >
        <Form.Label>{t('full-name-in-arabic')}</Form.Label>
        <Form.Control
          size='lg'
          type='text'
          name='fullNameInArabic'
          style={{ direction: 'rtl' }}
          placeholder={t('full-name-in-arabic')}
          onChange={(e) => getInfoValues(e)}
        />
      </Form.Group>
      <Form.Group
        style={{ direction: 'ltr' }}
        className='mb-3'
        controlId='formBasicEnglish'
      >
        <Form.Label>{t('full-name-in-english')}</Form.Label>
        <Form.Control
          size='lg'
          type='text'
          name='fullNameInEnglish'
          style={{ direction: 'ltr' }}
          placeholder={t('full-name-in-english')}
          onChange={(e) => getInfoValues(e)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>{t('choose-provider-country')}</Form.Label>
        <Form.Select
          size='lg'
          onChange={(e) => selectProviderCountry(e.target.value)}
        >
          {countries().map((country) => (
            <option key={country.abbr} value={country.abbr}>
              {country.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className='mb-3' controlId='formBasicCompany'>
        <Form.Label>{t('company-name')}</Form.Label>
        <Form.Control
          size='lg'
          type='text'
          name='company'
          placeholder={t('company-name')}
          onChange={(e) => getInfoValues(e)}
        />
      </Form.Group>
    </div>
  )
}

export default Personal
