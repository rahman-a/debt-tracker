import React, {useState} from 'react'
import style from './style.module.scss'
import NonDueReports from './NonDueReports'
import DueReports from './DueReports'

const Reports = () => {
  const [isDue, setIsDue] = useState(true)
  
    return (
    <div className={style.reports}>
       <h1 className='main-header'>Active Reports List</h1>
       <div className={style.reports__select}>
          <button className={isDue ? style.reports__select_active :''}
          onClick={() => setIsDue(true)}>
              Reports with Due Date
          </button>
          
          <button className={!isDue ? style.reports__select_active :''}
          onClick={() => setIsDue(false)}>
              Reports without Due Date
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