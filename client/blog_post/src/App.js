
import './App.css';
import Header from './Components/Header';
import HomePage from './Components/HomePage';
import Layout from './Components/Layout';
import LoginPage from './Components/LoginPage';
import Post from './Components/Post';
import {Routes,Route} from 'react-router-dom';
import RegisterPage from './Components/RegisterPage';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<HomePage/>}/>
      <Route path='/Login' element ={<LoginPage/>}/>
      <Route path='/register' element ={<RegisterPage/>}/>
      </Route>
      </Routes>
     );
    
}

export default App;
