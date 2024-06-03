import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../feature/userSlice';
import Post from './Post';
import Profile from './Profile';
export const MyQuestions = () => {
  const [questionData, setQuestionData] = useState([]);
  const user = useSelector(selectUser);
  const MYQUESTION = process.env.REACT_APP_MYQUESTION;

  useEffect(() => {
    axios.get(MYQUESTION)
      .then((res) => {
        console.log(res.data.reverse());
        setQuestionData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // Filter questions based on the condition
  const filteredQuestions = questionData.filter(
    (post) => user?.currentUser?._id === post?.user?.currentUser?._id
  );

  return (
    <div className="container min-vh-100 flex justify-center items-center column " >

     <div style={{marginTop:"92px"}} >
    <div>
      <h5 className='text-secondary fw-bold'>{filteredQuestions.length} Questions Posted By You </h5>
    </div>
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((post, index) => (
        

          <Post key={index} post={post} />
       
     
         
        ))
        ) : (
          <div>No questions posted yet</div>
      )}
          </div>
          {/* <div style={{ margin:"112px", height : "fit-content", width:"400px"}} className='p-3 border mb-5 bg-secondary rounded '>
            <Profile />
          </div> */}
    </div>
  );
};
