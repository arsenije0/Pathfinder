import React, { Component } from 'react';
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

export default function modal(props) {
    return(
        <Modal
            position={props.position} >
            {props.children}
        </Modal>
    );
}