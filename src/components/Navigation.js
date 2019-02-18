import React from 'react';
import { NavLink } from "react-router-dom";

const Navigation = () => {
    return (
        <div>
            <NavLink to="/home">Home</NavLink>
            <br />
            <NavLink to="/game">Play game</NavLink>
        </div>
    );
};

export default Navigation;