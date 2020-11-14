import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 5;
    width: 100%;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    border: 2px solid aqua;
`;

const Wrapper = styled.div`
    position: relative;
    width: 220px;
    background-color: #0f1017;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        cursor: pointer;
    }

    &:hover ${Container} {
        display: flex;
        cursor: pointer;
    }

    @media(max-width: 750px) {
        width: 200px;
    }

    @media(max-width: 500px) {
        width: 150px;
    }

    @media(max-width: 400px) {
        width: 120px;
    }
`;

const MainItem = styled.div`
    font-weight: bold;
    color: aqua;
    text-align: center;

    @media(max-width: 750px) {
        font-size: 14px;
    }

    @media(max-width: 500px) {
        font-size: 12px;
    }
`;

const Item = styled.div`
    padding: 10px 20px;
    width: 100%;
    color: ${props => props.color};
    background-color: #202233;
    text-align: center;
    box-sizing: border-box;

    &:hover {
        background-color: #333754;
    }

    @media(max-width: 750px) {
        font-size: 12px;
        padding: 5px 10px;
    }

    @media(max-width: 500px) {
        font-size: 10px;
    }
`;

export default function algorithms(props) {

    let arr = props.algorithms.map(x => {
        let color = props.chosenAlgo === x ? "aqua" : "teal";
        return (<Item 
            onClick={props.itemClick} color={color} key={x} id={x}>{getFullName(x)}
        </Item>);
    });

    return(
        <Wrapper>
            <MainItem>{getFullName(props.chosenAlgo)}</MainItem>
            <Container>
                { arr }
            </Container>
        </Wrapper>
    );
}

function getFullName(str) {
    switch(str) {
        case "astar":
            return "A* Algorithm";
        case "bfs":
            return "Breadth First Search";
        case "dijkstra":
            return "Dijkstra's Algorithm";
        case "dfs":
            return "Depth First Search";
        default:
            return;
    }
}