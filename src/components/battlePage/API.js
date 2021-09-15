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

export const cards = [
  {
    name: 'superman',
    defence: 19,
    attack: 9
  },
  {
    name: 'harry potter',
    defence: 7,
    attack: 0
  },
  {
    name: 'kirk',
    defence: 2,
    attack: 2
  },
  {
    name: 'skywalker',
    defence: 7,
    attack: 30
  },
  {
    name: 'Elon Musk',
    defence: 150,
    attack: 19
  },
  {
    name: 'Jesus Crist',
    defence: 2021,
    attack: 10
  },
  {
    name: 'naruto',
    defence: 2,
    attack: 3
  },
  {
    name: 'Rick and Morty',
    defence: 9,
    attack: 9
  },
  {
    name: 'Christopher Nolan',
    defence: 10,
    attack: 10
  },
  {
    name: 'Random Character',
    defence: Math.floor(Math.random()*10),
    attack: Math.floor(Math.random()*10)
  },
  {
    name: 'Not Defined Character',
    defence: undefined ,
    attack: undefined
  },
  {
    name: 'Clone 1',
    defence: 19,
    attack: 9
  },
  {
    name: 'Clone 2',
    defence: 7,
    attack: 0
  },
  {
    name: 'Clone 3',
    defence: 2,
    attack: 2
  },
  {
    name: 'Clone 4',
    defence: 7,
    attack: 30
  },
  {
    name: 'Clone 5',
    defence: 150,
    attack: 19
  },
  {
    name: 'Clone 6',
    defence: 2021,
    attack: 10
  },
  {
    name: 'Clone 7',
    defence: 2,
    attack: 3
  },
  {
    name: 'Clone 8',
    defence: 9,
    attack: 9
  },
  {
    name: 'Clone 9',
    defence: 10,
    attack: 10
  },
]
  
