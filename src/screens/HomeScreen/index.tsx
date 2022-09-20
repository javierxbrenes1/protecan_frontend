import React from 'react';
import Screen from '../../components/Screen';
import StagingNote from '../../components/StagingNote';
import HomeHeader from './HomeHeader';
import HomeMenu from './HomeMenu';
import UpdatePassword from './UpdatePassword';

const Home = () => {
    return (
        <>
            <Screen>
                <HomeHeader />
                <HomeMenu />
            </Screen>
            <UpdatePassword />
            <StagingNote />
        </>
    );
}

export default Home;