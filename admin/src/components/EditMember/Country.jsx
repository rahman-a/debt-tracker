import React from 'react'
import { Form } from 'react-bootstrap'
import flags from 'country-flag-emoji-json'
import { useTranslation } from 'react-i18next'

const Country = ({ setInfo }) => {
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
    setInfo({ country })
  }

  return (
    <Form>
      <Form.Group>
        <Form.Label>Choose Member Country</Form.Label>
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
    </Form>
  )
}

export default Country
