import React from 'react';
import styled from 'styled-components';
import { BACKGROUND_COLOR } from '../../constants/index';

const Container = styled.div`
    height: 250px;
    text-align: left;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Item = styled.li`
    font-size: 18px;
    margin-bottom: 10px;

    @media (max-width: 500px) {
        font-size: 15px;
        margin-bottom: 8px;
    }
`;

const En = styled.span`
    font-weight: bold;
    color: #232b69;
`;

export default function pageOne(props) {
    
    return (
        <Container>
            <ul>
                <Item>{`The menu is located in the upper section of the window.`}</Item>
                <Item>{`From there, choose your desired algorithm.`}</Item>
                <Item>{`Press the `}<En>{`Start`}</En>{` button to initiate the animation.`}</Item>
                <Item>{`Pres the `}<En>{`Clear`}</En>{` button to end it whenever you like.`}</Item>
            </ul>
        </Container>
    );
}