import { Avatar } from '@material-ui/core'
import React,{useState, useEffect} from 'react'
import './css/unifyBox.css'
import { useSelector } from "react-redux";
import { selectUser } from "../feature/userSlice";
import ModalContainer from './ModalContainer';
import { useNavigate } from 'react-router-dom';


const UnifyBox = () => {

  const [inputUrl, setInputUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const user = useSelector(selectUser);
  const handleSubmit = async () =>{
    setIsModalOpen(true)
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

