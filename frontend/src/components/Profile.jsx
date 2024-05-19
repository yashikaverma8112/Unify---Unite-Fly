import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../feature/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { selectUser } from '../feature/userSlice';
import axios from 'axios';
import { Avatar } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { useCookies } from "react-cookie";
import { cookie } from 'express-validator';
import Cookies from 'js-cookie';
export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const user = useSelector(selectUser);
  const navigate =  useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [cookies, setCookie] = useCookies(['access_token']);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
    const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${apiBaseUrl}/api/user/update/${user?.currentUser?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        console.log(data);
        return;
      }
      else{
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        alert("User Updated Successfully")
        navigate('/')

      }
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${apiBaseUrl}/api/user/delete/${user?.currentUser?._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
          /* eslint-disable no-restricted-globals */
      const confirmed = confirm("Do you want to Delete your account ?")
      if(confirmed){

        alert("Account deleted successfully");
       
        dispatch(deleteUserSuccess(data));
        dispatch(signOut())
        navigate('/sign-in')
      }
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      const res =  await fetch(`${apiBaseUrl}/api/auth/signout`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        
    });
      console.log(1);
      // let expires = new Date(0);
      console.log(res.ok)
      localStorage.removeItem('authToken');
      console.log("authToken",res.access_token)
      // Cookies.remove('access_token');
      // setCookie('access_token','none', { path: '/',  expires});  
      console.log(2);
      dispatch(signOut())
      navigate('/sign-in')
    } 
    catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="absolute inset-0 flex justify-center items-center h-screen " style={{ top: '4rem' }}>
        <div className="d-flex border border-5 justify-content-evenly shadow p-3 mb-5 bg-body rounded" style={{width:""}}>
      <div className='max-w-lg mx-auto p-5 rounded-4 d-none d-md-block' style={{backgroundColor:'lavender'}}>

     <Avatar src={formData.profilePicture||user?.currentUser?.profilePicture} onClick={() => fileRef.current.click()} className='self-center cursor-pointer rounded-full object-cover mx-4 d-none d-md-block' style={{width:"120px" , height:"120px"}}/>
     <p className='text-sm self-center'> 
          {imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>

            <p className='fs-3 mt-3 mx-3 fw-bold d-none d-md-block'>{user?.currentUser?.username}</p>
            <p className='mx-3 d-none d-md-block'>{user?.currentUser?.email}</p>

        <div className='flex row justify-content-between mt-5 d-none d-md-block'>
        <span
          onClick={handleDeleteAccount}
          className='text-white-700 cursor-pointer btn-danger btn'
        >
          Delete Account
        </span>
       
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer btn-seconday btn'>
          Sign out
          <span><ExitToApp /></span>
        </span>
         
      </div>
    <div className='mt-5'>
 
    </div>
      </div>
     
    
    <div className='p-5 max-w-lg mx-auto' >
      <h1 className='text-red-700 font-semibold fs-4 text-center my-7 mt-3 d-none d-md-block'>Update Your Profile !!</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5x'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        {/* 
      firebase storage rules:  
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */}
        {/* <img
          // src={formData.profilePicture || currentUser.profilePicture}
          src=''
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        /> */}
        <Avatar src={formData.profilePicture||user?.currentUser?.profilePicture} onClick={() => fileRef.current.click()} className='self-center cursor-pointer rounded-full object-cover mt-2 d-md-none' style={{width:"90px" , height:"90px"}}/>
          <p className='text-sm self-center'> 
          {imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>
       
        <input
          defaultValue={user?.currentUser?.username}
          type='text'
          id='username'
          placeholder='Username'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          defaultValue={user?.currentUser?.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5 d-md-none'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-700 cursor-pointer'
        >
          Delete Account
        </span>
       
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          
          Sign out
          <span><ExitToApp /></span>
        </span>
         
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User is updated successfully!'}
      </p>
    </div>
    </div>
    </div>
  );
}