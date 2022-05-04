import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'

import actions from '../../actions'
import { Table, Loader, HeaderAlert } from '../../components'
import Row from './Row'
import AddNews from './AddNews'
import { useTranslation } from 'react-i18next'

const QuickNews = () => {
  const [isCreateNews, setIsCreateNews] = useState(false)
  const { loading, error, news } = useSelector((state) => state.listNews)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  useEffect(() => {
    !news?.length && dispatch(actions.content.listNews())
  }, [])
  return (
    <>
      <AddNews isCreateNews={isCreateNews} setIsCreateNews={setIsCreateNews} />

      <div className={style.slider}>
        <Button
          variant='dark'
          size='lg'
          className='mb-3'
          onClick={() => setIsCreateNews(true)}
        >
          {' '}
          {t('add-news')}{' '}
        </Button>
        {loading ? (
          <Loader size='5' options={{ animation: 'border' }} />
        ) : error ? (
          <HeaderAlert
            size='2'
            type='danger'
            text={error}
            custom={{ top: '8rem' }}
          />
        ) : (
          news && (
            <Table>
              <thead>
                <th>#</th>
                <th>{t('news-body')}</th>
                <th>{t('name')}</th>
                <th>{t('image')}</th>
                <th>{t('createdAt')}</th>
                <th></th>
              </thead>
              <tbody>
                {news &&
                  news.map((n, idx) => (
                    <tr key={n._id}>
                      <Row news={n} idx={idx} />
                    </tr>
                  ))}
              </tbody>
            </Table>
          )
        )}
      </div>
    </>
  )
}

export default QuickNews
