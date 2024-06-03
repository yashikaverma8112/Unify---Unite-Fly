import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import OAuth from './OAuth';
import {useDispatch, useSelector} from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../../feature/userSlice';
import unify from '../../images/logo.png'
export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading , error} = useSelector((state)=>state.user);
  const [cookies, setCookie] = useCookies(['token']);
  const AUTH_SIGNIN = process.env.REACT_APP_AUTH_SIGNIN;
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        dispatch(signInStart());
        const res = await fetch(AUTH_SIGNIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include'
        });
        console.log("res",res.ok)
     
        const data = await res.json();
        console.log("data",data)
        dispatch(signInSuccess(data));
        let expires = new Date()
        console.log("1");
        expires.setTime(expires.getTime() + (1000 * 60 * 60))
       
        if (data.message === "User not found" || data.message==="Incorrect Password") {
          // alert('Invalid Credentials');
          setMsg(data.message)
          // navigate('/sign-up');
          dispatch(signInFailure(data));
          console.log("2");
          
        }
        else {
            console.log("3");
            setCookie('access_token', data.authToken, { path: '/',  expires})
            localStorage.setItem("authToken", data.authToken);
            console.log("access_token",data.access_token  )
            setMsg("SignIn successfully.");
            navigate('/');
          }
          
          
        } 
        catch (error) {
          console.error(error);
          setMsg('Invalid Credentials')
        navigate('/sign-up');
        dispatch(signInFailure(error));
    }
};


  return (
   
<div className="absolute inset-0 flex justify-center items-center h-screen " style={{ top: '4rem' }}>
    <div className="d-flex border border-5 justify-content-evenly shadow p-3 mb-5 bg-body rounded">
      <div className='max-w-lg mx-auto p-5 mt-5 d-none d-md-block'>

    <img src={unify}></img>
    <div className='mt-5'>
    <OAuth />

    </div>
      </div>
   
    <div className='max-w-lg p-5'  style={{backgroundColor:'lavender'}}>
      <h1 className='text-3xl text-center font-semibold my-7 mt-5'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
  
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
          />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
          />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        {formData.email !==undefined ?
      <button className="btn btn-outline-light text-black" >
      <Link to ={`/forgot-password/${formData.email}`}>  Forgot Password?</Link>
        
      </button>
      
      :
      <button className="btn btn-outline-light" >
      <Link to = '/sign-in' onClick={()=>{alert('Please Write Valid Email')}}>  Forgot Password?</Link>
        
      </button>
      

    }
        <button className='d-md-none'>

        <OAuth />
        </button>
      </form>
      <p className='text-red-700 mt-2'>{msg}</p>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-500'>Sign up</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>

    </div>

    
    </div>
    </div>
         
  );
}
