import React from 'react';
import styled from 'styled-components';
import { BACKGROUND_COLOR } from '../../constants/index';

const Button = styled.button`
    padding: 10px 20px;
    box-sizing: border-box;
    font-size: 15px;
    font-weight: bold;
    transition: all .3s;
    background-color: ${BACKGROUND_COLOR};
    color: #31a4d4;
    color: teal;
    border: none;

    &:hover {
        cursor: pointer;
        color: aqua;
        border-color: aqua;
    }

    @media(max-width: 750px) {
        padding: 5px 10px;
        font-size: 12px;
    }

    @media(max-width: 500px) {
        font-size: 10px;
    }
`;

const ButtonAlt = styled.button`
    padding: 10px 20px;
    border: none;
    font-size: 15px;
    font-weight: bold;
    background-color: #1b2b2b;
    color: #3d5252;
    box-sizing: border-box;

    @media(max-width: 750px) {
        padding: 8px 10px;
        font-size: 12px;
    }

    @media(max-width: 500px) {
        font-size: 10px;
    }
`;

export default function btn(props) {

    if(props.active) {
        return  <Button onClick={props.onclick}>{props.txt}</Button>;
    }
    return(
        <ButtonAlt>{props.txt}</ButtonAlt>
    );
}