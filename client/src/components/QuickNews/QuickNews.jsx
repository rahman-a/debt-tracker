import React, { useEffect } from 'react'
import style from './style.module.scss'
import { Carousel } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AngleLeft, AngleRight } from '../../icons'
import actions from '../../actions'
import i18next from 'i18next'

const news = [
  {
    id: 1,
    title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam eum, totam minima ratione, dolore facilis doloribus, magnam ipsa quas incidunt corrupti in accusamus est cupiditate expedita illo dolorem repellat. Exercitationem, voluptatum suscipit recusandae asperiores alias quisquam cupiditate, aut, consectetur minima pariatur adipisci hic excepturi perferendis voluptate assumenda unde rerum eveniet.',
    image: '/images/photos/photo-1.jpg',
    name: 'Александр Константинович',
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam eum, totam minima ratione, dolore facilis doloribus, magnam ipsa quas incidunt corrupti in accusamus est cupiditate expedita illo dolorem repellat. Exercitationem, voluptatum suscipit recusandae asperiores alias quisquam cupiditate, aut, consectetur minima pariatur adipisci hic excepturi perferendis voluptate assumenda unde rerum eveniet.',
    image: '/images/photos/photo-2.jpg',
    name: 'Ahmed Abdelaziz',
  },
  {
    id: 3,
    title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam eum, totam minima ratione, dolore facilis doloribus, magnam ipsa quas incidunt corrupti in accusamus est cupiditate expedita illo dolorem repellat. Exercitationem, voluptatum suscipit recusandae asperiores alias quisquam cupiditate, aut, consectetur minima pariatur adipisci hic excepturi perferendis voluptate assumenda unde rerum eveniet.',
    image: '/images/photos/photo-3.jpg',
    name: 'Waleed Elsaid',
  },
  {
    id: 4,
    title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam eum, totam minima ratione, dolore facilis doloribus, magnam ipsa quas incidunt corrupti in accusamus est cupiditate expedita illo dolorem repellat. Exercitationem, voluptatum suscipit recusandae asperiores alias quisquam cupiditate, aut, consectetur minima pariatur adipisci hic excepturi perferendis voluptate assumenda unde rerum eveniet.',
    image: '/images/photos/photo-4.jpg',
    name: 'Mohamed Elsayed',
  },
]

const QuickNews = () => {
  const { isloading, news } = useSelector((state) => state.listNews)
  const dispatch = useDispatch()
  const lang = i18next.language

  useEffect(() => {
    dispatch(actions.content.listNews())
  }, [])

  return (
    <div className={style.news}>
      <button className='carousel-control-prev' tabIndex={0}>
        <span>
          {' '}
          <AngleLeft />{' '}
        </span>
      </button>
      <button className='carousel-control-next' tabIndex={0}>
        <span>
          {' '}
          <AngleRight />{' '}
        </span>
      </button>
      <Carousel>
        {news &&
          news.map((item) => (
            <Carousel.Item key={item.id}>
              <div className={style.news__block}>
                {item.image && (
                  <figure>
                    <img src={`/api/files/${item.image}`} alt='personal' />
                  </figure>
                )}
                <p> {item.body[lang]} </p>
                {item.name && <span>{item.name[lang]} </span>}
              </div>
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  )
}

export default QuickNews
