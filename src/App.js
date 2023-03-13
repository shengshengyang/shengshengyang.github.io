import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import About from './components/pages/About';
import SitemapPage from './components/pages/SitemapPage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import ErrorPage from './components/pages/ErrorPage';
import MainPage from './components/pages/MainPage';

function App() {
  return (
    <div>
    <Header/>
    <Routes>
      <Route path='/about' element={<About/>}/>
      <Route path='/' element={<MainPage/>}/>
      <Route path='/Sitemap' element = {<SitemapPage/>}/>
      <Route path='*' element = {<ErrorPage/>}/>
    </Routes>
    <Footer/>
    </div>

  );
}

export default App;
