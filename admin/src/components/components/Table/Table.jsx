import React from 'react'
import style from './style.module.scss'
import {Row} from '../../components'

const Table = ({records, due, op, closed}) => {
    return (
        <div className={style.records}>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Operation code</th>
                        <th>Second peer name</th>
                        <th>Second peer photo</th>
                        <th>Note</th>
                        <th>Credit</th>
                        <th>Debt</th> 
                        <th>Operation currency</th>
                        {op && <th>Operation status</th> }
                        {(due || closed) && <th> {closed ? 'Payment date' : 'Due date'} </th>}
                    </tr>
                </thead>
                <tbody>
                    {
                        records.map((record, idx) => (
                            <Row 
                            record={record} 
                            idx={idx} 
                            key={record._id} 
                            due={due}
                            closed={closed}
                            op={op}/>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table
