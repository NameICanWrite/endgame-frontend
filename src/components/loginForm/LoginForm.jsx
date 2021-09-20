import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'

import Loader from 'react-loader-spinner'

import { login, register } from './API'

import './style.sass'

function LoginForm() {
    const history = useHistory()

    const [mode, setMode] = React.useState('login')
    const [username, setUsername] = React.useState()
    const [password, setPassword] = React.useState()
    const [email, setEmail] = React.useState()
    const [error, setError] = useState()
    const [message, setMessage] = useState()

    const [loading, setLoading] = useState(false)


    const credentials = {
        username,
        password,
        email
    }

    function toggleMode() {
        setError('')
        if (mode == 'login') setMode('register')
        else {
            setMode('login')
            setEmail('')
        }
    }

    async function handleLogin() {
        setLoading(true)
        setMessage('')
        setError('')
        await login(credentials)
            .then((res) => {
                console.log(res)
                history.push('/profile')
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }
    async function handleRegister() {
        setLoading(true)
        setMessage('')
        setError('')
        await register(credentials)
            .then((res) => {
                console.log(res)
                setMessage(res)
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }


    return (
        <div className='background'>

            <div className='login-container'>
                <span className="error">{error}</span>
                <span className="message">{message}</span>
                

                {
                    // login 
                    mode == 'login' && (
                        <div className="login">
                            <h4>Log in</h4>
                            <label key='1'>
                                <span>username</span>
                                <input type="text"
                                    onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
                            </label>
                            <label key='2'>
                                <span>password</span>
                                <input type="password" onChange={(e) => setPassword(e.target.value)} />
                            </label>
                            <a href='#' className='toggle' onClick={toggleMode} style={{ color: '#008CB4' }}>New? Sign up here ={'>'}</a>

                            <button className='submit-button' onClick={handleLogin}>Log in</button>
                        </div>

                    )
                    ||

                    //register
                    mode == 'register' && (
                        <div className="register">
                            <h4>Sign up</h4>
                            <label key='3'>
                                <span>username</span>
                                <input type="text" onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
                            </label>

                            <label key='4'>
                                <span>password</span>
                                <input type="password" onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
                            </label>

                            <label key='5'>
                                <span>email</span>
                                <input type="text" onChange={(e) => setEmail(e.target.value)} />
                            </label>
                            <a href='#' className='toggle' onClick={toggleMode} style={{ color: '#008CB4' }}>Already have an account? Go here ={'>'}</a>

                            <button className='submit-button' onClick={handleRegister}>Sign up</button>

                        </div>
                    )
                }
                {
                    loading &&
                    <div className="loader">Loading...</div>
                }
            </div>


        </div>
    )
}

export default LoginForm
