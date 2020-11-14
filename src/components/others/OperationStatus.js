import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Modal = styled.div`
    position: ${props => props.position};
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: ${props => props.height ? props.height + "px" : "100%"};
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.6);
`;

const Container = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
`;

const Paragraph = styled.p`
    color: aqua;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin: 0;

    @media(max-width: 750px) {
        font-size: 14px;
    }

    @media(max-width: 500px) {
        font-size: 12px;
    }
`;

const Button = styled.button`
    margin-top: 20px;
    padding: 20px;
    border: 2px solid teal;
    font-size: 15px;
    font-weight: bold;
    transition: all .3s;
    background-color: #0f1017;
    color: teal;
    border-radius: 50%;

    &:hover {
        cursor: pointer;
        background-color: #485d75;
        border-color: aqua;
        color: aqua;
    }

    @media(max-width: 750px) {
        padding: 10px;
        font-size: 12px;
    }

    @media(max-width: 500px) {
        font-size: 10px;
    }
`;

export default class OperationStatus extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidUpdate() {
        let height = 0;
        if(document.getElementById("wrapper").offsetHeight < document. getElementById("inner-wrapper").offsetHeight) {
            height = document.getElementById("wrapper").offsetHeight;
        } else {
            height = document.getElementById("inner-wrapper").offsetHeight;
        }
        if(this.ref.current){
            this.ref.current.style.height = height + "px";
        }
    }

    render() {
        if(!this.props.on) return null;
        let button = null;
        if(this.props.functionality) button = 
            <Button onClick={this.props.functionality}>{`OK`}</Button>;

        return(
            <Modal ref={this.ref} position={"absolute"}>
                <Container>
                    <Paragraph>{this.props.txt}</Paragraph>
                    { button }
                </Container>
            </Modal>
        );
    }
}