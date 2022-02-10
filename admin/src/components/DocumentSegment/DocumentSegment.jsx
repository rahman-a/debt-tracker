import React, {useState} from 'react'
import style from './style.module.scss'
import {Badge} from 'react-bootstrap'
import ExpiredImageContainer from './ExpiredImageContainer'
import ImageContainer from './ImageContainer'

const DocumentSegment = ({ img, document, isExpired }) => {
  const [imageContainer, setImageContainer] = useState(false)

  return (
    <>
     {
       imageContainer && 
        <ImageContainer
        img={img}
        document={document}
        imageContainer={imageContainer}
        setImageContainer={setImageContainer}
        />
     } 

      <div className={style.segment}>
        {img && !isExpired ? (
          <div className={style.segment__doc}
          onClick={() => setImageContainer(true)}>
            <img src={img} alt={document} />
            <p>{document} document</p>
          </div>
        ) : (
          <div className={style.segment__block} >
           
            {
              isExpired 
              ?  <ExpiredImageContainer img={img} document={document}/>
              :  <Badge bg='danger'> Not Provided </Badge>
            }
           
            <p>{document} document</p>
          </div>
        )}
      </div>
    </>
  )
}

export default DocumentSegment
