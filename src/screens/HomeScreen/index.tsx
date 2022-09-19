import Screen from '../../components/Screen';
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
        </>
    );
}

export default Home;