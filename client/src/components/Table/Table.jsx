import React from 'react'
import style from './style.module.scss'
import {Row} from '../../components'

const Table = ({records, due}) => {
    return (
        <div className={style.records}>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Operation code</th>  
                        <th>Second peer name</th>
                        <th>Second peer photo</th> 
                        <th>Second peer type</th>
                        <th>Operation value</th> 
                        <th>Operation currency</th>
                        <th>Operation status</th>
                        {due && <th>Due date</th>}
                    </tr>
                </thead>
                <tbody>
                    {
                        records.map((record, idx) => (
                            <Row record={record} idx={idx} key={record._id} due={due}/>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table
