import React, {useState} from 'react'
import style from './style.module.scss'
import NonDueReports from './NonDueReports'
import DueReports from './DueReports'
import { useTranslation } from 'react-i18next'

const Reports = () => {
  const [isDue, setIsDue] = useState(true)
  const {t} = useTranslation()
    return (
    <div className={style.reports}>
       <h1 className='main-header'>{t('active-reports')}</h1>
       <div className={style.reports__select}>
          <button className={isDue ? style.reports__select_active :''}
          onClick={() => setIsDue(true)}>
              {t('reports-due-date')}
          </button>
          
          <button className={!isDue ? style.reports__select_active :''}
          onClick={() => setIsDue(false)}>
              {t('reports-no-due-date')}
          </button>
      </div>
       
       {
           isDue 
           ? <DueReports/>  
           : <NonDueReports/>
       }
    </div>
  )
}

export default Reports