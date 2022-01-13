import React, {useState} from 'react'
import style from './style.module.scss'
import {v4 as uuidv4} from 'uuid'

const Pagination = ({count}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState([1,2,3,4,5])
    
    const changeCurrentPage = type => {
        if(type === 'next') {
            if(currentPage >= 5) {
                const pagesArray = pages.slice(1, pages.length)
                pagesArray.push(pagesArray[pagesArray.length - 1] + 1)
                if(pagesArray[pagesArray.length - 1] <= count) {
                    setPages(pagesArray)
                }
            }
            if (currentPage < count) {
                setCurrentPage(prev => prev + 1)
            }
        }else if ('prev') {
            if(pages[0] === currentPage && currentPage > 1) {
                let pagesArray = pages.slice(0, pages.length - 1)
                pagesArray = [pages[0] - 1].concat(pagesArray)
                setPages(pagesArray)
            }
            if (currentPage > 1) {
                setCurrentPage(prev => prev - 1)
            }
        }
    }
    
    return (
        <div className={style.pagination}>
            <button onClick={() => changeCurrentPage('prev')}>Prev</button>
            {
                pages.map(page => {
                    return <button 
                    key={uuidv4()} 
                    className={`${style.pagination__page} 
                    ${currentPage === page && style.pagination__page_active}`}
                    onClick={() => setCurrentPage(page)}>
                        {page}
                    </button>
                })
            }
            <button onClick={() => changeCurrentPage('next')}>Next</button>
        </div>
    )
}

export default Pagination
