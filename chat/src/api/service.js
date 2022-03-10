import axios from 'axios'


const service = () => {
    return axios.create({
        baseURL:'/api/chat/',
        headers:{
            apikey:process.env.REACT_APP_API_KEY
        }
    })
}

export default service