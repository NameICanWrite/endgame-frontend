import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { io } from 'socket.io-client'
import { path } from '../../App';
import { getCookie, token } from './API'
import { fetchUserData } from '../userProfile/API';
import { cards } from './API';

function BattlePage() {
    let [battleData, setBattleData] = useState()
    const [userData, setUserData] = useState()
    const [yourIndex, setYourIndex] = useState()
    const [enemyIndex, setEnemyIndex] = useState()
    const [yourMove, setYourMove] = useState()
    const [battleFinished, setBattleFinished] = useState(false)

    const history = useHistory()
    const socket = io(path, {
        query: `token=${getCookie('jwt')}`
    });

    function calculateHP(data) {
        const card0 = cards[data.users[0].currentMove]
        const card1 = cards[data.users[1].currentMove]

        let dmg0 = card1.attack - card0.defence
        let dmg1 = card0.attack - card1.defence

        if (dmg0 < 0) dmg0 = 0
        if (dmg1 < 0) dmg1 = 0

        data.users[0].hp -= dmg0
        data.users[1].hp -= dmg1

        return data
    }

    function move(cardIndex) {
        //set current move 
        battleData.users[yourIndex].currentMove = cardIndex

        //give new card, delete current
        battleData.users[yourIndex].cards = battleData.users[yourIndex].cards.map(currentCardIndex => currentCardIndex == cardIndex ? Math.floor(Math.random() * 19) : currentCardIndex)

        //if both did move
        if (!isNaN(battleData.users[yourIndex].currentMove) && !isNaN(battleData.users[enemyIndex].currentMove)) {
            
            //no moves. time for animation
            battleData.users[yourIndex].canMove = false

            socket.emit('fight timer start', battleData)
        } else {
            //pass move to the enemy
            battleData.users[yourIndex].canMove = false
            battleData.users[enemyIndex].canMove = true
        }
        socket.emit('update battle', battleData)
        // socket.emit('stop turn timer', yourIndex)
        // socket.emit('start turn timer', battleData, enemyIndex)

        setBattleData(battleData)
    }

    useEffect(() => {

        socket.emit('update battle', battleData)
        socket.on('update battle', data => {
            console.log('updating battle...')
            setBattleData(data)
            console.log(data)
        })
        socket.on('finish battle', (data) => {
            console.log('finishing battle')
            setBattleData(data)
            setBattleFinished(true)
        })
    }, [])
    useEffect(async () => {
        const res = await fetchUserData().then(res => {
            setUserData(res);


        }).catch(err => {
            history.push('/login')
        })
    }, [])

    useEffect(() => {
        setYourIndex(battleData?.users.findIndex(item => item._id == userData._id))
        setEnemyIndex(Math.abs(battleData?.users.findIndex(item => item._id == userData._id) - 1))
    }, [battleData, userData])

    return (
        <div>
            {


                battleData && !battleFinished
                    ?
                    <div>
                        <h1>Your enemy is {battleData.users[enemyIndex]?.username || 'undefined'}</h1>
                        <h2>Enemy hp: {battleData.users[enemyIndex]?.hp}</h2>
                        <br />
                        <p>Enemy move: {cards[battleData.users[enemyIndex]?.currentMove]?.name || 'empty'}</p>
                        <p>{battleData.fightTimer || battleData.users[yourIndex]?.canMove && 'It\'s your move' || battleData.users[enemyIndex]?.canMove && 'It\'s enemy move'}</p>
                        <p>Your move: {cards[battleData.users[yourIndex]?.currentMove]?.name || 'empty'}</p>
                        <br />
                        <h1>You are {battleData.users[yourIndex]?.username || 'undefined'}</h1>
                        <h2>Your hp: {battleData.users[yourIndex]?.hp}</h2>
                        <br />




                        <button onClick={
                            () => {
                                battleData.users[enemyIndex].hp = 0
                                setBattleData()
                                socket.emit('update battle', battleData)
                            }
                        }>Kill enemy</button>
                        <div>
                            <span>Your cards</span><br />
                            <div style={{ display: 'flex' }}>
                                {
                                    battleData.users[yourIndex]?.cards.map(cardIndex => {
                                        const card = cards[cardIndex]
                                        return (
                                            <button onClick={() => {
                                                if (battleData.users[yourIndex].canMove) {
                                                    move(cardIndex)
                                                }
                                            }}>
                                                {`${card.name} ${card.attack}💥 ${card.defence}🛡️`}
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    :
                    'Waiting for a battle'
            }
            {
                battleFinished
                &&
                <div>
                    <h1>{battleData.winner} wins</h1>
                    <button onClick={() => history.push('/profile')}>Ok</button>
                </div>
            }
        </div>
    )
}

export default BattlePage
