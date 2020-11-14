import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const Title = styled.h1`
    text-align: center;
    color: white;
    font-size: ${props => props.bigger ? "50px" : "30px"}
`;

export default function pageNotFound() {
    return (
    <Wrapper>
        <Title bigger={true}>404</Title>
        <Title>Page Not Found</Title>
    </Wrapper>);
}