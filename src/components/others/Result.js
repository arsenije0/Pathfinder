import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Container = styled.div`
    z-index: 1000;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px;
    border-radius: 5px;
    border: 4px solid teal;
    background-color: #13171a;
    color: white;

    @media (max-width: 750px) {
        border-width: 2px;
        padding: 10px;
    }
`;

const Exit = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    color: red;
    border: none;
    background-color: transparent;
    font-size: 15px;

    &:hover {
        cursor: pointer;
    }
`;

const Title = styled.h2`
    @media (max-width: 750px) {
        font-size: 22px;
    }

    @media (max-width: 400px) {
        font-size: 14px;
    }
`;

const Paragraph = styled.p`
    @media (max-width: 750px) {
        font-size: 14px;
    }

    @media (max-width: 400px) {
        font-size: 12px;
    }
`;

export default class Result extends Component {
    
    componentDidMount() {
        // Top Calculation
        let top = 0;
        if(document.getElementById("wrapper").offsetHeight < document.getElementById("inner-wrapper").offsetHeight) {
            top = (document.getElementById("wrapper").offsetHeight/2)
                - (document.getElementById("result-div").offsetHeight/2);
        } else {
            top = (document.getElementById("inner-wrapper").offsetHeight/2)
                - (document.getElementById("result-div").offsetHeight/2)
        }
        document.getElementById("result-div").style.top = top + "px";
    }
    
    render() {
        let length = <b>{this.props.result.length}</b>;
        let time = <b>{this.props.result.time}</b>;
        const onClc = () => {
            document.getElementById("result-div").style.display = "none";
        }

        return(
            <Container id={"result-div"}>
                <Exit onClick={onClc}>x</Exit>
                <Title>Path Found</Title>
                <Paragraph>{`Path Length: `}{length}</Paragraph>
                <Paragraph>{`Time: `}{time}{` seconds`}</Paragraph>
            </Container>
        );
    }
}