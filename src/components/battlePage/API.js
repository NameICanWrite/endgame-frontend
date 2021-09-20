import axios from 'axios';
import { path } from '../../App';

export const token = getCookie('jwt')




export async function  startBattle() {
    const response = await axios.post(path + '/battle/start', {}, {withCredentials: true})
    .catch(err => {
      throw new Error('startBattle error: ' + err.response.data)
    })
    return response.data
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

