import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { BACKGROUND_COLOR } from '../../constants/index';
import PageI from './PageI';
import PageII from './PageII';
import PageIII from './PageIII';

const Modal = styled.div`
    position: ${props => props.position};
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
`;

const HiddenDiv = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
`;

const Container = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 400px;
    width: 400px;
    padding: 15px;
    background-color: grey;
    border-radius: 5px;
    text-align: center;
    display: flex;
    flex-flow: column;
    justify-content: space-around;

    @media (max-width: 980px) {
        top: 5%;
        transform: translateX(-50%);
    }

    @media (max-width: 500px) {
        height: 350px;
        width: 350px;
        padding: 10px;
    }

    @media (max-width: 400px) {
        box-sizing: border-box;
    }

    @media (max-width: 350px) {
        width: 320px;
    }
`;

const Home = styled.div`
    display: flex;
    flex-flow: column;
    justify-content: space-between;
`;

const Title = styled.h1`
    color: #1d1f2e;
    margin-bottom: 70px;

    @media (max-width: 500px) {
        font-size: 28px;
    }
`;

const Btns = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

const Button = styled.button`
    color: grey;
    border: 1px solid #2a2d42;
    border-radius: 5px;
    padding: 20px;
    background-color: #2a2d42;
    transition: all .3s;
    width: ${props => props.big ? "85px" : "72px"};

    &:hover {
        cursor: pointer;
        color: grey;
        border-color: grey;
        background-color: ${BACKGROUND_COLOR};
    }
`;

const Flexy = styled.div`
    display: flex;
    justify-content: space-around;
`;

export default class Tutorial extends Component {

    constructor() {
        super();
        this.state = {
            pageNum: 0
        }
    }

    incrementPageNum = () => {
        let temp = this.state.pageNum + 1;
        if(!(temp > 3 || temp < 0)) {
            this.setState({ pageNum: temp });
        }
    }

    decrementPageNum = () => {
        let temp = this.state.pageNum - 1;
        if(!(temp > 3 || temp < 0)) {
            this.setState({ pageNum: temp });
        }
    }
    
    render() {

        let home = null;
        if(this.state.pageNum === 0) {
            home = 
                <Home>
                    <Title>{`Pathfinding Visualizer`}</Title>
                    <Btns>
                        <Button big={true} onClick={this.incrementPageNum}>{`GUIDE`}</Button>
                        <Button big={true} onClick={this.props.end}>{`EXIT`}</Button>
                    </Btns>
                </Home>;
        }
        let controlButtons = null;
        if(this.state.pageNum > 0) {
            controlButtons = 
                <Flexy>
                    <Button onClick={this.decrementPageNum}>{`Back`}</Button>
                    {
                        this.state.pageNum !== 3 ?
                        <Button onClick={this.incrementPageNum}>{`Next`}</Button>
                        : <Button onClick={this.props.end}>{`End`}</Button>
                    }
                </Flexy>;
        }

        let pageI = null;
        if(this.state.pageNum === 1) {
            pageI = <PageI />;
        }
        let pageII = null;
        if(this.state.pageNum === 2) {
            pageII = <PageII />;
        }
        let pageIII = null;
        if(this.state.pageNum === 3) {
            pageIII = <PageIII />;
        }

        return (
            <Modal position={"absolute"}>
                <HiddenDiv onClick={this.props.end} />
                <Container>
                    { home }
                    { pageI }
                    { pageII }
                    { pageIII }
                    { controlButtons }
                </Container>
            </Modal>
        );
    }
}