import React from 'react'
import {Spinner} from 'react-bootstrap'

const Loader = ({size, text, center, custom, options}) => {
    const getStyle = _ => {
        let centerStyle = {}
        if(center) {
            centerStyle = {
                position:'absolute',
                left:'50%',
                top:'50%',
                transform:'translate(-50%, -50%)',
                zIndex:'9999999999'
            }
        }
        if(custom) {
            centerStyle = {...centerStyle, ...custom}
        }
        return {
            textAlign:'center',
            padding:'1rem',
            width:size ? `${size}rem` :'3rem',
            height:size ?`${size}rem` : '3rem',
            ...centerStyle
        }
    }
    return (
        <div style={getStyle()}>
           <Spinner {...options} style={{width:'100%', height:'100%'}}/>
           {text ? <p>{text}</p> : ''}
        </div>
    )
}

export default Loader
