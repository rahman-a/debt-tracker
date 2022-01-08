import React from 'react'
import style from './style.module.scss'
import {Carousel as Slider} from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {v4 as uuidv4} from 'uuid'
const Carousel = () => {
    
    const slides = [
        {
            id:uuidv4(),
            src:'images/carousel/slide-1.jpg',
            title:'Lorem ipsum dolor sit amet',
            description:`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod 
            tempor invidunt ut labore et dolore magna aliquyam erat.`
        },
        {
            id:uuidv4(),
            src:'images/carousel/slide-2.jpg',
            title:'Lorem ipsum dolor sit amet',
            description:`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod 
            tempor invidunt ut labore et dolore magna aliquyam erat.`
        },
        {
            id:uuidv4(),
            src:'images/carousel/slide-3.png',
            title:'Lorem ipsum dolor sit amet',
            description:`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod 
            tempor invidunt ut labore et dolore magna aliquyam erat.`
        },
    ]
    
    return (
        <Slider 
        autoPlay={true}
        emulateTouch={true}
        infiniteLoop={true}
        swipeable={true}
        showArrow={true}
        showStatus={false}
        showThumbs={false}
        className={style.carousel}>
            {
                slides.map(slide => {
                    return <div className={style.carousel__slide} key={uuidv4()}>
                        <img src={slide.src} alt={slide.title} />
                        <div className={style.carousel__desc}>
                            <h2>{slide.title}</h2>
                            <p>{slide.description}</p>
                        </div>
                    </div>
                })
            }
        </Slider>
    )
}

export default Carousel
