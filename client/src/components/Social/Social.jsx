import React from 'react'
import style from './style.module.scss'
import {
    Facebook, 
    Linkedin, 
    Whatsapp,
    Twitter,
    Instagram,
    Youtube
} from '../../icons'

const Social = () => {
    return (
        <div className={style.social}>
            <span>
                <Facebook/>
            </span>
            <span>
                <Twitter/>
            </span>
            <span>
                <Instagram/>
            </span>
            <span>
                <Whatsapp/>
            </span>
            <span>
                <Youtube/>
            </span>
            <span>
                <Linkedin/>
            </span>
        </div>
    )
}

export default Social
