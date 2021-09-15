import axios from 'axios';
import { path } from '../../App';
// const path = 'https://endgame-backend.herokuapp.com'

export async function  login(credentials) {
    const response = await axios.post(path + '/users/login', credentials, {withCredentials: true})
    .catch(err => {
      throw new Error(err.response.data)
    })
    return response.data
}

export async function  register(credentials) {
    const response = await axios.post(path + '/users/register', credentials)
    .catch(err => {
      throw new Error(err.response.data)
    })

    return response.data
}

export async function logout() {
  const response = await axios.post(path + '/users/logout', {}, {withCredentials: true})
  .catch(err => {
    throw new Error(err.response.data)
  })
  
  return response.data
}