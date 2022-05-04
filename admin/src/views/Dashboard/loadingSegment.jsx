import React from 'react'
import style from './style.module.scss'
import {Placeholder} from 'react-bootstrap'

const loadingSegment = () => {
  return (
    <div className={style.dashboard__segment}>
          <span style={{width:'4rem', height:'2rem'}}>
              <Placeholder animation='glow'>
                  <Placeholder xs={12} />
              </Placeholder>
          </span>
          <div className={style.dashboard__segment_info}
          style={{width:'100%'}}>
              <Placeholder as='h3' animation='glow'>
                  <Placeholder xs={12}/>
              </Placeholder>
            <Placeholder as='p' animation='glow'>
                <Placeholder xs={12}/>
            </Placeholder>
          </div>
      </div>
  )
}

export default loadingSegment