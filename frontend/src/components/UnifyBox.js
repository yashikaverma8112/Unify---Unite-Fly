import { Avatar } from '@material-ui/core'
import React,{useState, useEffect} from 'react'
import './css/unifyBox.css'
import { useSelector } from "react-redux";
import { selectUser } from "../feature/userSlice";
import ModalContainer from './ModalContainer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UnifyBox = () => {

  const [inputUrl, setInputUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const user = useSelector(selectUser);
  const handleSubmit = async () =>{
    const HEADER_QUESTION= process.env.REACT_APP_HEADER_QUESTION;
    
    setIsModalOpen(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = {
        questionName: question,
        questionUrl: inputUrl,
        user: user,
      };
      if (question !== '') {
  
        try {
          await axios.post(HEADER_QUESTION, body, config);
          alert('Question Added Successfully');
          window.location.href = '/';
        } catch (e) {
          console.log(e);
          alert('Error in adding Questions');
        }
      }
   
  
  }
  return (
    <div className='unifyBox'>
        <div className="unifyBox_info">
          <Avatar src={user?.currentUser?.profilePicture}/>
        </div>
        <ModalContainer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        question={question}
        setQuestion ={setQuestion}
        inputUrl={inputUrl}
        setInputUrl={setInputUrl} 
        handleSubmit={handleSubmit}
        btnValue='Add Question'
        />
        {(user?.currentUser?._id)
          ?
      <div className="unifyBox_content" onClick={() => handleSubmit()}>
        <h5>What is your Question or link ?</h5>
      </div>
          :
      <div className="unifyBox_content" onClick={() => {navigate('/sign-up')}}>
        <h5>What is your Question or link ?</h5>
      </div>
      
        }
    </div>
  )
}

export default UnifyBox

