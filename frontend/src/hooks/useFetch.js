import { jwtDecode } from "jwt-decode"
import dayjs from 'dayjs'
import useAuthStore from '../utils/appStore'


let useFetch = () => {
    let config = {}

    let {authTokens, setAuthTokens, setUser} = useAuthStore()

    let baseURL = 'http://127.0.0.1:8000/api/'

    let originalRequest = async (url, config)=> {
        url = `${baseURL}${url}`
        let response = await fetch(url, config)
        let data = await response.json()
        console.log('REQUESTING:', data)
        return {response, data}
    }

    let refreshToken = async (authTokens) => {

        let response = await fetch('http://127.0.0.1:8000/api/auth/login/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens.refresh})
        })
        let data = await response.json()
        localStorage.setItem('authTokens', JSON.stringify(data))
        setAuthTokens(data)
        setUser(jwtDecode(data.access))
        return data
    }

    let callFetch = async (url, method = 'GET', body = null) => {
        const user = jwtDecode(authTokens.access)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if(isExpired){
            authTokens = await refreshToken(authTokens)
        }

        
        config['headers'] = {
            Authorization:`Bearer ${authTokens?.access}`,
            'Content-Type': 'application/json',
        }

        config['method'] = method
        if (body) {
            config['body'] = JSON.stringify(body)
        }

        let {response, data} = await originalRequest(url, config)
        return {response, data}
    }

    return callFetch
}

export default useFetch