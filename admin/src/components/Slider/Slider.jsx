import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'

import actions from '../../actions'
import { Table, Loader, HeaderAlert } from '../../components'
import Row from './Row'
import AddNewSlider from './AddNewSlider'
import { useTranslation } from 'react-i18next'

const Slider = () => {
  const [isCreateSlide, setIsCreateSlide] = useState(false)
  const { loading, error, sliders } = useSelector((state) => state.listSliders)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    !sliders?.length && dispatch(actions.content.listSlider())
  }, [])
  return (
    <>
      <AddNewSlider
        isCreateSlide={isCreateSlide}
        setIsCreateSlide={setIsCreateSlide}
      />

      <div className={style.slider}>
        <Button
          variant='dark'
          size='lg'
          className='mb-3'
          onClick={() => setIsCreateSlide(true)}
        >
          {' '}
          {t('add-new-slider')}{' '}
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
          sliders && (
            <Table>
              <thead>
                <th>#</th>
                <th>{t('title')}</th>
                <th>{t('text')}</th>
                <th>{t('image')}</th>
                <th>{t('link-to')}</th>
                <th>{t('createdAt')}</th>
                <th></th>
              </thead>
              <tbody>
                {sliders &&
                  sliders.map((slide, idx) => (
                    <tr key={slide._id}>
                      <Row slide={slide} idx={idx} />
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

export default Slider
