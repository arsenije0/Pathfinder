import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 50%;
    margin: auto;
    color: white;
    text-align: center;
`;

const Paragraph = styled.p`
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px 15px 10px 15px;
    border: none;
    background-color: #273030;
    transition: all .2s;
    margin-top: 10px;
    color: #747575;
    border-radius: 5px;

    &:hover {
        cursor: pointer;
        color: white;
        background-color: #445d75;
    }

    @media (max-width: 750px) {
        padding: 10px;
    }
`;

const Details = styled.details`
    margin-top: 20px;

    &:hover {
        cursor: pointer;
    }
`;


export default class ErrorBoundary extends Component {
    state = {
        error: '',
        errorInfo: '',
        hasError: false,
    };

    static getDerivedStateFromError(error) {
            return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
    }

    render() {
        const { hasError, errorInfo } = this.state;
        if (hasError) {
        return (
            <Wrapper>
                <div>
                    <Paragraph>There was an error in loading this page.</Paragraph>
                    <Button onClick={() => { window.location.reload(); }}>
                        Reload
                    </Button>{' '}
                </div>
                <div>
                    <Details>
                        <summary>Click for error details</summary>
                        {errorInfo && errorInfo.componentStack.toString()}
                    </Details>
                </div>
            </Wrapper>
        );
        } else {
            return this.props.children;
        }
    }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]).isRequired,
};