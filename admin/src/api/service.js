import axios from "axios";
import i18next from 'i18next'

const service = _ => {
    return axios.create({
        baseURL:'/api/',
        headers:{
            'Accept-Language':i18next.language,
            apikey:process.env.REACT_APP_API_KEY
        }
    })
} 

export default service