import React from 'react'
import style from './style.module.scss'
import { Modal } from 'react-bootstrap'
import { Times } from '@/src/icons'
import { TicketsFilter } from '@/src/components'

const FilterModal = ({ isFilter, setIsFilter, options }) => {
  return (
    <>
      <Modal show={isFilter} onHide={() => setIsFilter(false)}>
        <span className={style.filter} onClick={() => setIsFilter(false)}>
          <Times />
        </span>
        {<TicketsFilter {...options} />}
      </Modal>
    </>
  )
}

export default FilterModal
