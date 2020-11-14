import React from 'react';
import styled from 'styled-components';

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

export default function pageTwo(props) {
    
    return (
        <Container>
            <ul>
                <Item>{`Draw or erase walls by clicking and dragging with your mouse on the grid.`}</Item>
                <Item>{`You can generate random walls by clicking on the `}<En>{`Generate Walls`}</En>{` button.`}</Item>
                <Item>{`You can generate maze pattern by clicking on the `}<En>{`Generate Maze`}</En>{` button.`}</Item>
                <Item>{`The `}<En>{`Erase Walls`}</En>{` button will clear the grid.`}</Item>
            </ul>
        </Container>
    );
}