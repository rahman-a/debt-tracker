import axios from "axios";


const service = _ => {
    return axios.create({
        baseURL:'/api/',
        headers:{
            apikey:process.env.REACT_APP_API_KEY
        }
    })
} 

export default service