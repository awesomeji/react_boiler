import { React, useState } from 'react'
import useStore from '../../store/store'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function RegisterPage() {
 
    const navigate = useNavigate();
    const { registerfetch } = useStore();

    const [userID , setUserID] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [ PW, setPW ] = useState('');
    const [PWCheck, setPWCheck] = useState('');
    const [error, setError] = useState([]);

    const onIDHandler = (e) => { 
        setUserID(e.target.value)
    }
    const onEmailHandler = (e) => { 
        setEmail(e.target.value)
    }
    const onNameHandler = (e) => { 
        setName(e.target.value)
    }
    const onPWHandler = (e) => { 
        setPW(e.target.value)
    }
    const onPWCheckHandler = (e) => { 
        setPWCheck(e.target.value)
    }

    const onSubmitHandler = (e) => { 
        e.preventDefault()

        if(PW!==PWCheck){
            alert("비밀번호가 일치하지 않습니다.")
            return
        }
        let registerInfo = {
            userid: userID,
            email: email,
            name: name,
            password: PW
        }
        registerfetch(registerInfo)
            .then( res =>  {
                if (res.error) { 
                     console.log(res.error.message)
                    // setError([res.error.message]);
                    let errorSplit = res.error.message.split('/')
                    for (var i in errorSplit) { 
                            // console.log(errorSplit)
                        if (errorSplit[i] !== '') { 
                            if (errorSplit[i].slice(0, 1) == ',') { 
                            errorSplit[i] = errorSplit[i].substring(1)
                            }
                            const err = errorSplit[i].trim()
                            
                            if (err !=='') {
                            setError(oldarray => [...oldarray, err])
                            }
                            
                            //mysweetalert2로 교체하자거
                            
                            alert(error[i])
                        }
                    }
                } else if(res.success){ 
                    alert("환영합니다^오^")
                    navigate('/login')
                }
              
            })
    }
  return (
      <div>
          <StyledRegister onSubmit={onSubmitHandler}>
              <StyledForm>
              <h1>Sign Up</h1>
              <span>ID  </span>
              <StyledInput  onChange={e=> onIDHandler(e)} value={userID} type="text" />
              <span>Email  </span>
              <StyledInput  onChange={e=> onEmailHandler(e)} value={email} type="email" />
              <span>Name  </span>
              <StyledInput  onChange={e=> onNameHandler(e)} value={name} type="text" />
              <span>Password  </span>
              <StyledInput  onChange={e=> onPWHandler(e)} value={PW} type="password" />
              <span>Confirm password  </span>
              <StyledInput  onChange={e=> onPWCheckHandler(e)} value={PWCheck} type="password" />
              <StyledButton type="submit">register</StyledButton>
              </StyledForm>
          </StyledRegister>
    </div>
  )
}
const StyledRegister = styled.div`

padding: 1rem;

border : 3px solid #F5F5F5;

width : 50%;

min-height : 30rem;

margin : 7rem auto;

border-radius : 1.5rem;

font-family: 'Orbitron', sans-serif;

`;

const StyledForm = styled.form`

margin : 2rem auto;

height : 38rem;

align-items : center;

display : flex;

flex-direction : column;

justify-content : space-around;

background-color : #000000;

width : 80%;

color : white;

border-radius : 1rem;

.contents_wrap{

width:400px;

display : flex;

justify-content: space-around;

align-items : center;

flex-direction: column;

}

span{

display : flex;

justify-content: flex-start;

align-items : center;

width:250px;

margin-bottom:6px;

}

`;

const StyledInput = styled.input`

height : 2rem;

width : 15rem;

border-radius : 0.5rem;

border : 1px solid white;

`;

const StyledButton = styled.button`

font-family: 'Orbitron', sans-serif;

margin : 0 1rem;

min-width : 4rem;

min-height : 2rem;

background: none;

border : 1px solid white;

cursor : pointer;

color : black;

background-color : white;

border-radius : 0.5rem;

&hover{

color :#0C6D10;

}

`;