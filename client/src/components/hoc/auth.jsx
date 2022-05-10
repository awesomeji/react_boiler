
import useStore from '../../store/store';
import {useEffect} from 'react'
import axios from '../../plugins/axios'
import { useParams, useLocation, useNavigate } from 'react-router-dom';



export default function (SpecificComponent, option, adminRoute = null) {

    const {auth,accessToken,setAccessToken,setLoginStatus,setUserInfo,userInfo}= useStore();
   
    // option = null // pages taht anyone can access
    // true // pages that only loginuser can access
    // false // pages that loginuser can not access
    // adiminRoute = null // pages that only admin can access
    function AuthenticationCheck(props){

        const navigate = useNavigate();
        useEffect(()=>{
        auth(accessToken).then(res => {
            // console.log(res)
            // if (res.id) {
            //      console.log(res.id)
            //         console.log(res.userid)
            //         console.log(res.role)
            //         setUserInfo(res.id,res.userid,res.role)
            //         console.log(userInfo)
            //  }
            //이게 지랄나는 이유는 대체 모르겠다
            if (res.accessToken) {
                setAccessToken(res.accessToken)
                setLoginStatus(true)
                setUserInfo(res.id,res.userid,res.role)
               
            }
            if (res.isAuth===false) {
                if (option) {
                    navigate('/login')
                }
            } else { 
                
                
                if (adminRoute && !res.isAdmin) {
                    navigate('/login')
                } else { 
                   
                    if (option === false) {
                        navigate('/contact')
                    }
                    
                }
            }
        });

    },[])
    return(
        <SpecificComponent {...props} navigate={navigate}/>
     )
  }


  return AuthenticationCheck
}
