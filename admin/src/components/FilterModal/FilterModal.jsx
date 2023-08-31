import React from 'react'
import style from './style.module.scss'
import { Modal } from 'react-bootstrap'
import { Times } from '../../icons'
import {
  UserFilter,
  OperationFilter,
  ReportFilter,
  TicketsFilter,
} from '../../components'

const FilterModal = ({ isFilter, setIsFilter, type, options }) => {
  const Component = {
    user: <UserFilter {...options} />,
    operation: <OperationFilter {...options} />,
    report: <ReportFilter {...options} />,
    ticket: <TicketsFilter {...options} />,
  }
  return (
    <>
      <Modal show={isFilter} onHide={() => setIsFilter(false)}>
        <span className={style.filter} onClick={() => setIsFilter(false)}>
          <Times />
        </span>
        {Component[type]}
      </Modal>
    </>
  )
}

export default FilterModal
