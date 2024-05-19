import { Avatar, Input } from "@material-ui/core";
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  ChatBubbleOutlined,
  Delete,
  Edit,
  MoreHorizOutlined,
  RepeatOneOutlined,
  ShareOutlined,
} from "@material-ui/icons";
import React, { useState ,useEffect} from "react";
import "./css/post.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CloseIcon from "@material-ui/icons/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactTimeAgo from "react-time-ago";
import axios from "axios";
import ReactHtmlParser from "html-react-parser";
import { useSelector } from "react-redux";
import { selectUser } from "../feature/userSlice";
import ModalContainer from "./ModalContainer";
import en from 'javascript-time-ago/locale/en';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import javascriptTimeAgo from 'javascript-time-ago';
import { useNavigate } from "react-router-dom";

// Initialize the 'en' (English) locale
const englishLocale = en;
javascriptTimeAgo.locale(englishLocale);

function LastSeen({ date }) {
  return (
    <div>
      <ReactTimeAgo date={date} locale="en-US" timeStyle="round" />
    </div>
  );
}

function Post({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalQuesOpen, setIsModalQuesOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const Close = <CloseIcon />;
  const [inputUrl, setInputUrl] = useState('');
  const [ansUrl, setAnsUrl] = useState('');
  const [upvotes, setUpvotes] = useState(post?.allAnswers[0]?.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post?.allAnswers[0]?.downvotes || 0);
  const [subBtn,setSubBtn] = useState('');
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const user = useSelector(selectUser);
const navigate = useNavigate();
  const handleQuill = (value) => {
    setAnswer(value);
  };
  // console.log(answer);

  const handleSubmit = async () => {
   
    if (post?._id && answer !== "") {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = {
      answer: answer,
      answerUrl: ansUrl,
      questionId: post?._id,
      user: user,
    };
    if (post?.allAnswers.length > 0) {
      // Update an existing answer
      const existingAnswerId = post.allAnswers[0]._id; // Assuming the first answer is the relevant one
      await axios
        .put(`${apiBaseUrl}/api/answers/${existingAnswerId}`, body, config)
        .then((res) => {
          setSubBtn("Update Answer");
          console.log(res.data);
          alert("Answer updated successfully");
          setIsModalOpen(false);
          navigate('/');
       
          window.location.href = '/';   
        })
        .catch((e) => {
          console.log(e);
        });
    } 
    else{

      await axios
        .post(`${apiBaseUrl}/api/answers`, body, config)
        .then((res) => {
          setSubBtn("Add Answer");
          console.log(res.data);
          alert("Answer added succesfully");
          setIsModalOpen(false);
         navigate('/')
         
         window.location.href = '/';  
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
};


  const deleteQuestion = async (questionId) => {
    // Make an API call to the Node.js server to delete the question
    await axios.delete(`${apiBaseUrl}/api/questions/${questionId}`)
      .then((res) => {
        console.log(res.data);
        /* eslint-disable no-restricted-globals */
        const confirmed = confirm("Do you want to Delete your question ?")
        if(confirmed){
          alert("Question deleted successfully");
        }
        navigate('/')
        window.location.href = '/';  
        
      })
      .catch((e) => {
        console.log(e);
      });
  };


  const deleteAns = async (answerId) => {
    await axios.delete(`${apiBaseUrl}/api/answers/${answerId}`)
      .then((res) => {
        console.log(res.data);
           /* eslint-disable no-restricted-globals */
           const confirmed = confirm("Do you want to Delete your answer ?")
           if(confirmed){
   
             alert("Answer deleted successfully");
            
           }
           navigate('/')
           window.location.href = '/';  
      })
      .catch((e) => {
        console.log(e);
      });
  }


  const handleEdit = () => {
    // Set initial values in the modal when the "Edit" button is clicked
    setAnswer(post?.allAnswers[0]?.answer); // Assuming the first answer is the relevant one
    setAnsUrl(post?.allAnswers[0]?.answerUrl);
    setIsModalOpen(true);
  };  

  const handleEditQues = () =>{
    setQuestion(post?.questionName);
    setInputUrl(post?.questionUrl);
    setIsModalQuesOpen(true);
  }

  const handleUpdateQues = async()=>{
   
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
      const existingQuestionId = post?._id;
      try {
        await axios.put(`${apiBaseUrl}/api/questions/${existingQuestionId}`, body, config);
        alert('Question Updated Successfully');
        window.location.href = '/';
      } catch (e) {
        console.log(e);
        alert('Error in adding Questions');
      }
    
  }


  const handleUpvote = async () => {
    const userId = user?.currentUser?._id
    try {
      const response = await axios.post('http://localhost:80/api/answers/upvote', { userId });
      setUpvotes(response.data.upvotes);
      setDownvotes(response.data.downvotes);
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };
  // const handleDownvote = async () => {
    
    
  //     // Check if the user has already downvoted
  //     if (post?.allAnswers[0] && post.allAnswers[0].downvotedBy && post.allAnswers[0].downvotedBy.includes(user?.currentUser?._id)) {
  //       console.log("User already downvoted");
  //       return;
  //     }
  //     if(!cntUpvote){

  //       try {
  //         const response = await axios.post(`http://localhost:80/api/answers/downvote/${post?.allAnswers[0]?._id}`);
  //       setDownvotes(response.data.downvotes);
  //       setCntUpvote(!cntUpvote);
  //       console.log("initial : ",(response.data.downvotes))
  //     } catch (error) {
  //       console.error('Error downvoting post:', error);
  //     }
  //   }

//};
     
const handleDownvote = async () => {
  const userId = user?.currentUser?._id;
  try {
    const response = await axios.post('http://localhost:80/api/answers/downvote', { userId });
    setUpvotes(response.data.upvotes);
    setDownvotes(response.data.downvotes);
  } catch (error) {
    console.error('Error downvoting:', error);
  }
};


const handleUserProfileClick = () => {
  const userId = post?.user?.currentUser?._id;
  if(userId===user?.currentUser?._id){
    navigate('/Myposts')
  }
  else {
      navigate(`/userProfile/${userId}`);
  }
};

    
  return (
    <div className="post">
      <div className="post__info">
      
        <Avatar src={post?.user?.currentUser?.profilePicture} />
        <div className="d-flex row m-1">
        <h4 onClick={handleUserProfileClick} style={{ cursor: 'pointer' }}>{post?.user?.currentUser?.username}</h4>

        <small className="text-secondary m-1">
          <LastSeen date={post?.createdAt} />
        </small>
        </div>
      </div>
      <div className="post__body">
        <div className="post__question">
          <p>{post?.questionName}</p>
          {user?.currentUser?._id
          ? 
          <button
          onClick={() => 
            {
                setIsModalOpen(true);
                setSubBtn('Add Answer')
                console.log(post?._id);
          }
        }
          className="post__btnAnswer "
        >
          Answer
        </button>
          :
          <button
          onClick={() => 
            {
               navigate('/sign-up')
          }
        }
          className="post__btnAnswer "
        >
          Answer
        </button>
          }
         
          {/* <Modal
            open={isModalOpen}
            closeIcon={Close}
            onClose={() => setIsModalOpen(false)}
            closeOnEsc
            center
            closeOnOverlayClick={false}
            styles={{
              overlay: {
                height: "auto",
              },
            }}
          >
            <div className="modal__question">
              <h1>{post?.questionName}</h1>
              <p>
                asked by <span className="name">Username</span> on{" "}
                <span className="name">
                  Date
                   {new Date(post?.createdAt).toLocaleString()} 
                </span>
              </p>
            </div>
            <div className="modal__answer">
              <ReactQuill
                value={answer}
                onChange={handleQuill}
                placeholder="Enter your answer"
              />
            </div>
            <div className="modal__button">
              <button className="cancle" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSubmit} type="submit" className="add">
                Add Answer
              </button>
            </div>
          </Modal> */}


          <Modal
            open={isModalOpen}
            closeIcon={Close}
            onClose={() => setIsModalOpen(false)}
            closeOnEsc
            center
            closeOnOverlayClick={false}
            styles={{
              overlay: {
                height: 'auto',
              },
              modal: {
          
                width: '100%',
                height :'80%',
                maxWidth: '600px', // Adjust the maximum width as needed
                borderRadius:'10px'
              },
            }}
          >
            <div className="modal__question fs-4 text-danger  " style={{ fontWeight: 'bold' }}>
              <h5>{post?.questionName}</h5>
              

              <p>
                asked by <span className="name">{post?.user?.currentUser?.username}</span> on{" "}
                <span className="name">
                  Date
                  {new Date(post?.createdAt).toLocaleString()}
                </span>
              </p>
              {/* <h5>Share Link</h5> */}
            </div>
            <div className="modal__info">
              <Avatar className="avatar" src={user?.currentUser?.profilePicture} />
              <p>{user?.currentUser?.username}</p>
              {/* <div className="modal__scope"> */}
                {/* <PeopleAltOutlined /> */}
                {/* <p>Public</p> */}
                {/* <ExpandMore /> */}
              {/* </div> */}
            </div>
            <div className="modal__Field">
              <input
                value={ansUrl}
                onChange={(e) => setAnsUrl(e.target.value)}
                style={{
                  margin: '5px 0',
                  border: '1px solid lightgray',
                  padding: '10px',
                  outline: '2px solid #000',
                }}
                type="text"
                placeholder="Optional: include a link that gives context" />
              {ansUrl !== '' && (
                <img
                  style={{
                    height: '40vh',
                    objectFit: 'contain',
                  }}
                  
                  src={ansUrl}
                  value={ansUrl}
                  onChange={(event)=>event.target.value}
                  alt="displayImage" />
              )}

              <div className="modal__answer">
                <ReactQuill
                  value={answer}
                  onChange={handleQuill}
                  placeholder="Enter your answer"
                />
              </div>

            </div>

            <div className="modal__button">
              <button className="cancle" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="add" onClick={handleSubmit}> {subBtn}
      {/* {post.allAnswers[0] ? "Update Answer" : "Add Answer"} */}
      {/* {post.allAnswers[0]?.user?.currentUser?._id===user?.currentUser?._id ? "Update Answer" : "Add Answer"} */}
    </button>
            </div>
          </Modal>




        </div>
        {post.questionUrl !== "" && <img src={post.questionUrl} alt="url" />}
      </div>
      <div className="post__footer">
    
        <ModalContainer
                 isOpen={isModalQuesOpen}
                 onClose={() => setIsModalQuesOpen(false)}
                 question={question}
                 inputUrl={inputUrl}
                 setQuestion={setQuestion}
                 setInputUrl={setInputUrl}
                 handleSubmit = {handleUpdateQues}
                 btnValue='Update Question'
               />

        <div className="post__footerLeft">

          {(post?.user?.currentUser?._id === user?.currentUser?._id)

            ?
            <>
              <Edit className="text-success" onClick={() => 
                handleEditQues()
               
              }/>
              <Delete onClick={() => deleteQuestion(post?._id)} className="text-danger"/>
            </>
            : null

          }

        </div>
      </div>
      <p
        style={{
          color: "rgba(0,0,0,0.5)",
          fontSize: "12px",
          fontWeight: "bold",
          margin: "10px 0px",
        }}
      >
        {post?.allAnswers.length} {" "}
        Answer(s)
      </p>

      <div
        style={{
          margin: "5px 0px 0px 0px ",
          padding: "5px 0px 0px 20px",
          borderTop: "1px solid lightgray",
        }}
        className="post__answer"
      >
        {post?.allAnswers?.map((_a) => (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                padding: "10px 5px",
                borderTop: "1px solid lightgray",
              }}
              className="post-answer-container"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#888",
                }}
                className="post-answered d-flex justify-content-between"
              >
                <div className="d-flex column">
                  <Avatar src={_a?.user?.currentUser?.profilePicture} />
                  <div className="d-flex row">

                  <span>{_a?.user?.currentUser?.username}</span>

                  <span>replied to {post?.user?.currentUser?.username} question</span>
                  </div>
                </div>

                <div
                  style={{
                    margin: "0px 10px"
                  }}
                  className="post-info "
                >

                  {(_a?.user?.currentUser?._id === user?.currentUser?._id)

                    ?
                    <>
                      <Edit className="text-success" onClick={()=>{
                        setSubBtn('Update Answer');
                         handleEdit()
                      }
                      }/>
                      <Delete onClick={() => deleteAns(_a?._id)} className="text-danger"/>
                    </>
                    : null

                  }

                  {/* <p>{_a?.user?.currentUser?.username}</p> */}
                  <span>
                    <LastSeen date={_a?.createdAt} />
                  </span>
                </div>
              </div>
              <div className="post-answer">{ReactHtmlParser(_a?.answer)}</div>
              <div>

                {_a.answerUrl !== "" && <img src={_a.answerUrl} alt="" />}
              </div>
            </div>
            <div className="post__footer">

              {/* <div className="post__footerAction">
              <p>{upvotes}</p>
              <AiFillLike color="blue" className="m-2" onClick={handleUpvote} />
              <p>{downvotes}</p>
          <AiFillDislike color="red"  className="m-2" onClick={handleDownvote}/>
            </div> */}
        </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default Post;
