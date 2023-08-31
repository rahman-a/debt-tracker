import React from 'react'
import { Badge, Tooltip } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
const CompanyLabel = ({ name }) => {
  const { t } = useTranslation()
  const lang = i18next.language
  return (
    <OverlayTrigger
      placement='top'
      overlay={
        <Tooltip style={{ fontSize: '1.2rem' }}>
          {t('work-for-company', { company: name })}
        </Tooltip>
      }
    >
      {({ ref, ...triggerHandler }) => (
        <Badge
          ref={ref}
          style={{
            position: 'relative',
            zIndex: '9999999',
            display: 'flex',
            justifyContent: 'center',
          }}
          {...triggerHandler}
          bg='info'
        >
          E
        </Badge>
      )}
    </OverlayTrigger>
  )
}

export default CompanyLabel
