<<<<<<< HEAD
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'

import { fetchUserData, postUserData } from './API'
import { logout } from '../loginForm/API'
import { startBattle } from '../battlePage/API'

import './style.sass'



function UserProfile() {

  // const [userData, setUserData] = React.useState({})
  const [wins, setWins] = React.useState(0)
  const [username, setUsername] = React.useState('')

  const history = useHistory()

  async function handleLogout() {
    await logout().then((res) => {
      console.log(res)
      history.push('/login')
    })
  }

  async function handleStartBattle() {
    await startBattle().then((res) => {
      console.log(res)
      history.push('/battle')
    }).catch((err) => console.log(err))
  }


  useEffect(async () => {
      const res = await fetchUserData().then(res => {
        // setUserData(res);
        // const newWins = res.data?.wins || 0
        setWins(res.data.wins || 0)
        setUsername(res.username)
      }).catch(err => {
        history.push('/login')
      })
    }, []);

    return (
    <div>
      <h1 className='profile-name' >User {username}</h1>
      <button className='logout' onClick={handleLogout} >logout</button>
      <br />
      <br />
      <button className='to-battle' onClick={handleStartBattle}>TO BATTLE</button>
      <br />
      <br />
      <h4>Wins: {wins}</h4>
    </div >
  )
  }

  export default UserProfile
=======
import React, { useEffect} from 'react'
import {useHistory } from 'react-router'
import { fetchUserData, postUserData } from './API'
import {logout} from '../loginForm/API'

function UserProfile() {

  const [userData, setUserData] = React.useState({})
  let [clicks, setClicks] = React.useState(0)

  const history = useHistory()


  useEffect(async () => {
    const res = await fetchUserData()
    setUserData(res);
    const newClicks = res.data?.clicks || 0
    setClicks(newClicks)
  }, []);

  return (
    <div>
      <h1>User {userData.username || 'undefined'}</h1>
      <p>{`${clicks} clicks`}</p>
      
      <button onClick={async () => {
        clicks++
        setClicks(clicks)
        postUserData({ clicks })
      }}>Click me!</button>

      <button onClick={async () => {
        const res = await logout().then((res) => {
          console.log(res)
          history.push('/login')
        })
        }} >logout</button>
    </div>
  )
}

export default UserProfile
>>>>>>> 5f19d49cdd19084929351ba97c1fd300a159caeb
