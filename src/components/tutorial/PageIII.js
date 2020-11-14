import React from 'react';
import styled from 'styled-components';
import { START_COLOR, END_COLOR } from '../../constants/index';

const Container = styled.div`
    height: 250px;
    text-align: left;
    display: flex;
    flex-flow: column;
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
    font-size: 18px;
    margin-top: 10px;

    @media (max-width: 500px) {
        font-size: 15px;
        margin-bottom: 8px;
    }
`;

const Cube = styled.div`
    height: 20px;
    width: 20px;
    background-color: ${props => props.color};
`;

const Flexy = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: space-around;
`;

const Section = styled.div`
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
`;

export default function pageThree(props) {
    
    return (
        <Container>
            <Flexy>
                <Section>
                    <Cube color={START_COLOR} />
                    <En>{`Start`}</En>
                </Section>
                <Section>
                    <Cube color={END_COLOR} />
                    <En>{`End`}</En>
                </Section>
            </Flexy>
            <ul>
                <Item>
                    {`Change positions of Start and End points by dragging them on the grid.`}
                </Item>
            </ul>
        </Container>
    );
}