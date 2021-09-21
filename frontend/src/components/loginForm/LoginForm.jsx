import React from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'

import { login, register } from './API'

function LoginForm() {
    const history = useHistory()

    const [mode, setMode] = React.useState('login')
    const [username, setUsername] = React.useState()
    const [password, setPassword] = React.useState()
    const [email, setEmail] = React.useState()

    const credentials = {
        username,
        password,
        email
    }

    function toggleMode() {
        if (mode == 'login') setMode('register')
        else {
            setMode('login')
            setEmail('')
        }
    }

    return (
        <div>
            {
                mode == 'login' && (
                    <div className="login">
                        <label>
                            <span>username</span>
                            <input type="text"
                             onChange={(e) => setUsername(e.target.value)} />
                        </label>
                        <label>
                            <span>password</span>
                            <input type="text" onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <input type="button" value="sign in" onClick={async () => {
                            await login(credentials)
                            .then((res) => {
                                console.log(res)
                                history.push('/profile')
                            })
                            .catch(err => console.log(err.message))
                        }}
                        />
                        <a onClick={toggleMode} style={{color: '#008CB4'}}>register</a>
                    </div>
                )
                ||
                mode == 'register' && (
                    <div className="register">
                        <label>
                            <span>username</span>
                            <input type="text" onChange={(e) => setUsername(e.target.value)} />
                        </label>

                        <label>
                            <span>password</span>
                            <input type="text" onChange={(e) => setPassword(e.target.value)} />
                        </label>

                        <label>
                            <span>email</span>
                            <input type="text" onChange={(e) => setEmail(e.target.value)} />
                        </label>
                
                        <input type="button" value="sign up" onClick={async () => {
                            await register(credentials).then((res) => {
                                console.log(res)
                            })
                            .catch(err => console.log(err.message))
                        }} />

                        <a onClick={toggleMode} style={{color: '#008CB4'}}>login</a>
                    </div>
                )
            }

        </div>
    )
}

export default LoginForm
