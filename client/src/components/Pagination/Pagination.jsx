import React, {useState} from 'react'
import style from './style.module.scss'
import {v4 as uuidv4} from 'uuid'

const Pagination = ({count}) => {
    const [currentPage, setCurrentPage] = useState(1)
    
    const changeCurrentPage = type => {
        if(type === 'next') {
            if (currentPage < count) {
                setCurrentPage(prev => prev + 1)
            }
        }else if ('prev') {
            if (currentPage > 1) {
                setCurrentPage(prev => prev - 1)
            }
        }
    }
    
    return (
        <div className={style.pagination}>
            <button onClick={() => changeCurrentPage('prev')}>Prev</button>
            {
                [...Array(count)].map((_, idx) => {
                    return <button 
                    key={uuidv4()} 
                    className={`${style.pagination__page} 
                    ${currentPage === (idx + 1) && style.pagination__page_active}`}
                    onClick={() => setCurrentPage(idx + 1)}>
                        {idx + 1}
                    </button>
                })
            }
            <button onClick={() => changeCurrentPage('next')}>Next</button>
        </div>
    )
}

export default Pagination
