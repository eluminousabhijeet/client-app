import React, { Component } from 'react';
import styled from 'styled-components';

export default class Header extends Component {
    render() {
        return (
            <MainContainer className="headerContainer">
                <h1>Welcome to Dashboard</h1>
            </MainContainer>
        )
    }
}

const MainContainer = styled.header`
    background: url(require(../../images/header-bg.jpg))no-repeate center/cover;
    height: 20rem;

    h1{
        transform: translate(-50%, -50%);
        font-weight: 900;
        font-family: "Open Sans", sans serif;
        position: absolute;
        top: 10%;
        left: 50%
    }
`