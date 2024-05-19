import React from 'react'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../feature/userSlice';
import { useNavigate } from 'react-router-dom';
const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const AUTH_GOOGLE = process.env.REACT_APP_AUTH_GOOGLE;
    const handleGoogleClick = async () => {
    
    try{
        const providerr = new GoogleAuthProvider();
        const auth = getAuth(app);
        const result = await signInWithPopup(auth,providerr);
        const res = await fetch(AUTH_GOOGLE,{
            method:'POST',
            headers:{
                'Content-Type' :'application/json',
            },
            body: JSON.stringify({
                name:  result.user.displayName,
                email : result.user.email,
                photo : result.user.photoURL

            })
        }
        );
        navigate('/');
        const data = await res.json();

        dispatch(signInSuccess(data));
    }
    catch(error){
        console.log(error);
    }
}

  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>Continue with Google</button>
  )
}

export default OAuth