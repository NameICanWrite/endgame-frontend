import React, { useEffect } from 'react'
import './style.sass'

function Cards({ cards, handleCard }) {
    useEffect(() => {
        console.log('in card component: ' + cards?.some(card => !card.name))
    }, [cards])
    return (
        <div className='cards'>
            {
                cards?.map(card => {
                    return (
                        <div className='card-container' onClick={() => handleCard(card)}>
                            {card.name ? <Card card={card} /> : ``}
                        </div>
                    )
                })
            }
        </div>
    )
}

export function Card({ card }) {
    return (
        <div className='card'>
            <span className='card-name'>{card.name}</span>
            <span className='card-attack'>💥 {card.attack}</span>
            <span className='card-defence'>🛡️ {card.defence}</span>
        </div>
    )
}

export default Cards
