import React, { useState, useEffect } from "react";
import Card from "./Card";
import axios from "axios";

const CardList = () => {
    const [deckId, setDeckId] = useState(null);
    const [drawn, setDrawn] = useState([]);

    useEffect(() => {
        async function loadDeck() {
            const res = await axios.get(
                `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
            );
            setDeckId(res.data.deck_id);
            console.log(deckId);
        }
        loadDeck();
    }, []);

    
        async function drawCard() {
            const res = await axios.get(
                `https://deckofcardsapi.com/api/deck/${deckId}/draw`
            );
            
            const card = res.data.cards[0];
            setDrawn((c) => [
                ...c,
                {
                    id: card.code,
                    image: card.image,
                },
            ]);
        }
     

    let cards = [];
    if (drawn !== []) {
        cards = drawn.map((c) => <Card key={c.id} image={c.image} />);
    } 

    return (
        <div>
            <button onClick={drawCard}>Gimme a Card!</button>
            {cards === [] ? "Draw a Card!" : cards}
        </div>
    );
};

export default CardList;
