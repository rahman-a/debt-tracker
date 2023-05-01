import React, { useState } from 'react'
import style from './style.module.scss'
import { Pagination } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../actions'

const PaginationItems = () => {
  const [active, setActive] = useState(1)
  const { user } = useSelector((state) => state.isAuth)
  const { count } = useSelector((state) => state.mutualsPeers)
  const dispatch = useDispatch()
  const getMutualsPeers = (page) => {
    const skip = (page + 0) * 5 - 5
    dispatch(actions.users.getMutualsPeers(user._id, skip))
    setActive(page)
  }
  return (
    <Pagination size='lg' className={style.operation__pagination}>
      {count &&
        count > 5 &&
        [...Array(Math.ceil(count / 5))].map((_, idx) => (
          <Pagination.Item
            key={idx}
            active={idx + 1 === active}
            onClick={() => getMutualsPeers(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
    </Pagination>
  )
}

export default PaginationItems
