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

    return username ? (
    <div className='profile'>
      <div className='profile-name' >User {username}</div>
      <div className='logout' onClick={handleLogout} >logout</div>
      <div className='to-battle' onClick={handleStartBattle}>TO BATTLE</div>
      <div className='wins'>You have {wins} wins</div>
    </div >
  ) : <p className="profile-loading">Loading...</p>
  }

  export default UserProfile
