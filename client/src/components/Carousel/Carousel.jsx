import React from 'react'
import style from './style.module.scss'
import {Carousel as Slider} from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {v4 as uuidv4} from 'uuid'
import i18next from 'i18next';


const Carousel = () => {
    
    const lang = i18next.language

    const slides = [
        {
            id:uuidv4(),
            src:'images/carousel/slide-1.jpg',
            title:{
                en:'Schedule your commitments',
                ar:'رتب التزاماتك'
            },
            description:`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod 
            tempor invidunt ut labore et dolore magna aliquyam erat.`
        },
        {
            id:uuidv4(),
            src:'images/carousel/slide-2.png',
            title:{
                en:'Increase your sales',
                ar:'زود مبيعاتك'
            },
            description:`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod 
            tempor invidunt ut labore et dolore magna aliquyam erat.`
        },
        {
            id:uuidv4(),
            src:'images/carousel/slide-3.jpg',
            title:{
                en:'Protect your money',
                ar:'إحمى أموالك'
            },
            description:`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod 
            tempor invidunt ut labore et dolore magna aliquyam erat.`
        },
        {
            id:uuidv4(),
            src:'images/carousel/slide-4.png',
            title:{
                en:'Guarantee your rights',
                ar:"إضمن حقوقك"
            },
            description:`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod 
            tempor invidunt ut labore et dolore magna aliquyam erat.`
        },
    ]
    
    return (
        <Slider 
        autoPlay
        infiniteLoop={true}
        swipeable={true}
        showStatus={false}
        showThumbs={false}
        className={style.carousel}>
            {
                slides.map(slide => {
                    return <div className={style.carousel__slide} key={uuidv4()}>
                        <img src={slide.src} alt={slide.title} />
                        <div className={style.carousel__desc}
                        style={{textAlign:lang === 'ar' ? 'right' : 'left'}}>
                            <h2>{slide.title[lang]}</h2>
                            <p>{slide.description}</p>
                        </div>
                    </div>
                })
            }
        </Slider>
    )
}

export default Carousel
