import './App.css';
import {Route, Routes, useLocation} from 'react-router-dom';
import About from './components/pages/About';
import SitemapPage from './components/pages/SitemapPage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import ErrorPage from './components/pages/ErrorPage';
import MainPage from './components/pages/MainPage';

function App() {
    const location = useLocation();
    console.log(location.pathname)
    let isRoutes = false;
    switch (location.pathname) {
        case '/about':
        case '/':
        case '/sitemap':
            isRoutes = true;
            break;
        default:
            break;
    }


    return (
        <div className='wrapper'>
            {isRoutes ? <Header/> : null}
            <div className='content'>
                <Routes>
                    <Route path='/about' element={<About/>}/>
                    <Route path='/' element={<MainPage/>}/>
                    <Route path='/sitemap' element={<SitemapPage/>}/>
                    <Route path='*' element={<ErrorPage/>}/>
                </Routes>
            </div>
            <Footer/>
        </div>

    );
}

export default App;
