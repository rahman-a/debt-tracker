import React, { useEffect } from 'react'
import style from './style.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { useTranslation } from 'react-i18next'
import Segment from './Segment'
import { PieChart } from './Pie'
import Timeline from './Timeline'
import LoadingSegment from './loadingSegment'
import LoadingTimeLine from './LoadingTimeLine'
import actions from '@/src/actions'
import {
  Cogs,
  CashRegister,
  HandshakeSlash,
  AddressCard,
  Help,
  Times,
} from '@/src/icons'
import { Loader } from '@/src/components'

const Home = () => {
  const dispatch = useDispatch()
  const { loading, info } = useSelector((state) => state.appInfo)
  const { t } = useTranslation()

  const { loading: members_loading, members } = useSelector(
    (state) => state.latestMembers
  )

  const { loading: tickets_loading, tickets } = useSelector(
    (state) => state.latestTickets
  )

  const { loading: operations_loading, operations } = useSelector(
    (state) => state.latestOperations
  )

  const { loading: reports_loading, reports } = useSelector(
    (state) => state.latestReports
  )

  const segments = [
    {
      id: uuidv4(),
      title: 'pending-operation',
      icon: <Cogs />,
      type: 'primary',
      page: '/operations?state=pending',
      value: info?.pending,
    },
    {
      id: uuidv4(),
      title: 'declined-operation',
      icon: <Times />,
      type: 'danger',
      page: '/operations?state=decline',
      value: info?.declined,
    },
    {
      id: uuidv4(),
      title: 'active-reports',
      icon: <CashRegister />,
      type: 'success',
      page: '/reports/active',
      value: info?.active,
    },
    {
      id: uuidv4(),
      title: 'closed-reports',
      icon: <HandshakeSlash />,
      type: 'dark',
      page: '/reports/closed',
      value: info?.closed,
    },
    {
      id: uuidv4(),
      title: 'active-members',
      icon: <AddressCard />,
      type: 'info',
      page: '/members',
      value: info?.members,
    },
    {
      id: uuidv4(),
      title: 'open-tickets',
      icon: <Help />,
      type: 'warning',
      page: '/support',
      value: info?.tickets,
    },
  ]

  const testValues = [2, 6, 4, 6, 3, 2, 5]

  useEffect(() => {
    dispatch(actions.admin.appInfo())
    dispatch(actions.admin.latestMembers())
    dispatch(actions.admin.latestTickets())
    dispatch(actions.admin.latestOperations())
    dispatch(actions.admin.latestReports())
  }, [])

  return (
    <div className={style.dashboard}>
      <div className={style.dashboard__overview}>
        {loading
          ? [...Array(segments.length)].map((_) => (
              <LoadingSegment key={uuidv4()} />
            ))
          : info &&
            segments.map(({ id, type, page, value, title, icon }) => (
              <Segment
                key={id}
                type={type}
                value={value}
                title={title}
                page={page}
                icon={icon}
              />
            ))}
      </div>

      <div className={style.dashboard__container}>
        <div className={style.dashboard__info}>
          <div className={style.dashboard__pie}>
            <h2>{t('latest-operations')}</h2>
            {operations_loading ? (
              <Loader size='8' options={{ animation: 'border' }} />
            ) : (
              operations && <PieChart values={operations} />
            )}
          </div>
          <div className={style.dashboard__timeline}>
            <h2>{t('latest-members')}</h2>

            {members_loading
              ? [...Array(5)].map((_) => <LoadingTimeLine key={uuidv4()} />)
              : members &&
                members.map((member) => (
                  <Timeline
                    key={member._id}
                    englishName={member.fullNameInEnglish}
                    arabicName={member.fullNameInArabic}
                    date={member.createdAt}
                  />
                ))}
          </div>
        </div>
        <div className={style.dashboard__info}>
          <div className={style.dashboard__pie}>
            <h2>{t('latest-reports')}</h2>
            {reports_loading ? (
              <Loader size='8' options={{ animation: 'border' }} />
            ) : (
              reports && <PieChart values={reports} />
            )}
          </div>
          <div className={style.dashboard__timeline}>
            <h2>{t('latest-tickets')}</h2>

            {tickets_loading
              ? [...Array(5)].map((_) => <LoadingTimeLine key={uuidv4()} />)
              : tickets &&
                tickets.map((ticket) => (
                  <Timeline
                    key={ticket._id}
                    ticket={ticket.title}
                    date={ticket.createdAt}
                    type='ticket'
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
