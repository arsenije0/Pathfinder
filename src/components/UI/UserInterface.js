import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import Algorithms from './Algorithms';

const Wrapper = styled.div`
    display: flex;
    width: 100%;
`;

export default function userInterface(props) {
    return(
        <Wrapper id={props.id}>
            <Algorithms 
                algorithms={props.algorithms}
                chosenAlgo={props.chosenAlgo}
                itemClick={props.itemClick} />
            <Button 
                onclick={props.initiatePathfinding}
                txt={"Start"}
                active={!props.ongoingAnimation} />
            <Button 
                onclick={props.reset}
                txt={"Clear"}
                active={props.ongoingAnimation} />
            <Button 
                onclick={props.clearWalls}
                txt={"Erase Walls"}
                active={!props.ongoingAnimation} />
            <Button 
                onclick={props.addWallsRandomly}
                txt={"Generate Walls"}
                active={!props.ongoingAnimation} />
            <Button 
                onclick={props.generateMaze}
                txt={"Generate Maze"}
                active={!props.ongoingAnimation} />
            <Button 
                onclick={props.toggleTutorial}
                txt={"Guide"}
                active={!props.tutorial && !props.ongoingAnimation} />
        </Wrapper>
    );
}