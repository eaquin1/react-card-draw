import React from "react"

const Card = (props) => {
    return (
        <img
            src={props.image}
            alt={props.code}
            key={props.code}
        />
    )    
}

export default Card