import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Avatar } from '@material-ui/core';
import Post from './Post';
import { selectUser } from '../feature/userSlice';
import { useSelector } from 'react-redux';
const UserProfile = () => {
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [questionData, setQuestionData] = useState([]);
    const user = useSelector(selectUser);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${apiBaseUrl}/api/user/userprofile/${userId}`);
                setUserProfile(res.data);
                console.log(res.data);
            } catch (error) {
                console.error('Error:', error);
            }

          };
          const fetchUserPost = async () =>{
            axios.get(`${apiBaseUrl}/api/questions`)
            .then((res) => {
              console.log(res.data.reverse());
              setQuestionData(res.data);
            })
            .catch((e) => {
              console.log(e);
            });
          }

        // Check if userId is valid before fetching the user profile
        if (userId) {
            fetchUserProfile();
            fetchUserPost();
        }
    }, [userId]);

    const filteredQuestions = questionData.filter(
      (post) => userId === post?.user?.currentUser?._id
    );
  

    return (
        <div className="absolute inset-0 justify-center items-center h-screen " style={{ top: '4rem' }}>
          <div className="d-flex row  justify-content-evenly p-3  mb-5 bg-body rounded">
          <div className='max-w-lg mx-auto p-3 rounded-4 d-flex column' style={{backgroundColor:'lavender'}}>

          <Avatar src={userProfile?.profilePicture} className='self-center cursor-pointer rounded-full object-cover ' style={{width:"5em" , height:"5em"}}/>
          <div>

            <p className='fs-4 mt-3 mx-3 fw-bold '>{userProfile?.username}</p>
            <p className='mx-3 '>{userProfile?.email}</p>
           <p className='mx-3 mt-3 '>{filteredQuestions.length} Questions</p> 
          </div>

            </div>
            <div className=''>

{filteredQuestions.length > 0 ? (
  filteredQuestions.map((post, index) => (
    <div className='max-w-lg mx-auto'>
   
    <Post key={index} post={post} />
    </div>


   
  ))
  ) : (
    <div>No questions posted yet</div>
)}
    </div>

            {/* Add more profile details as needed */}
          </div>
        </div>
    );
};

export default UserProfile;
