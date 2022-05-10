
import {Route,Routes} from 'react-router-dom'
import About from './components/About'
import Login from './components/Login/LoginPage'
import Register from './components/Login/RegisterPage'
import Contact from './components/Board/Contact'
import Auth from './components/hoc/auth'
import Write from './components/Board/WritePage'
import Nav from './components/Nav'
import { useParams, useLocation, useNavigate } from 'react-router-dom';


function App() {
 
    const AuthAbout = Auth(About,null);
    const AuthContact = Auth(Contact, true);
    const AuthLogin = Auth(Login, false);
    const AuthRegister = Auth(Register, false);
    const AuthWrite = Auth(Write, true);
    return (
       <>
       <Nav></Nav>
        <Routes>
        <Route path='*' element={  <AuthAbout />} />
        <Route path='/about' element={   <AuthAbout />} />
        <Route path='/login' element={ <AuthLogin />} />
        <Route path='/board' element={ <AuthContact />} />
        <Route path='/register' element={ <AuthRegister />} />
        <Route path='/write' element={ <AuthWrite />} />
        {/* <Route path='/' element={ <Home />} ></Route> */}
    </Routes>
       </>
    
        
    )
}

export default App
