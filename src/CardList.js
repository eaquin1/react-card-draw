import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const CardList = () => {
    const [deckId, setDeckId] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [autoDeal, setAutoDeal] = useState(false);
    const timerRef = useRef(null);

    /* At mount: load deck from API into state */
    useEffect(() => {
        async function loadDeck() {
            const res = await axios.get(
                `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
            );
            setDeckId(res.data.deck_id);
        }
        loadDeck();
    }, []);

    /** Draw one card every second if autoDraw is true */
    useEffect(() => {
        async function getCard() {
            try {
                let drawRes = await axios.get(
                    `https://deckofcardsapi.com/api/deck/${deckId}/draw`
                );

                if (drawRes.data.remaining === 0) {
                    setAutoDeal(false);
                    throw new Error("No cards remaining!");
                }

                const card = drawRes.data.cards[0];

                setDrawn((c) => [
                    ...c,
                    {
                        id: card.code,
                        image: card.image,
                    },
                ]);
            } catch (e) {
                alert(e);
            }
        }

        if (autoDeal && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [deckId, autoDeal, setAutoDeal]);

    const toggleDraw = () => {
        setAutoDeal((deal) => (deal = !deal));
        console.log(autoDeal);
    };

    let cards = drawn.map((c) => <Card key={c.id} image={c.image} />);

    return (
        <div>
            <button onClick={toggleDraw}>
                {!autoDeal ? "Turn on AutoDeal" : "Turn off Autodeal"}
            </button>
            {cards}
        </div>
    );
};

export default CardList;
