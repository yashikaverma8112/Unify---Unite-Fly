import React, { useState,useEffect } from 'react';
import './css/header.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../feature/userSlice';
import Modal from 'react-responsive-modal';
import { Avatar, Button, Input } from '@material-ui/core';
import { AccountBox, AddBox, ExpandMore, Home, ListAlt, LockOpen, People, PeopleAltOutlined, VpnKey } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { Link, useNavigate } from 'react-router-dom';
import {useCookies}  from "react-cookie";
import SignUp from '../components/auth/SignUp'
import Signin from '../components/auth/Signin'
import { signOutUserStart, deleteUserFailure, deleteUserSuccess } from '../feature/userSlice';
import {signOut} from '../feature/userSlice';
import ReactQuill from "react-quill";
import ModalContainer from './ModalContainer';
import logo from '../images/unify.png';
const Header = ({ posts}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const Close = <CloseIcon />
  const [, , removeCookie] = useCookies(['access_token']);
  const [loggedin, setLoggedin] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const HEADER_QUESTION= process.env.REACT_APP_HEADER_QUESTION;
  const handleSubmit = async () => {
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
  
  };

  const handleSignout = async () => {
   try{
      await axios.get('http://localhost:80/api/auth/signout')
      removeCookie('access_token');
      dispatch(signOut());
      setLoggedin(false);
    }
    catch(error){
      console.log(error)
    }
    navigate('/sign-in');
  };
  

  const handleSearch = async () => {
    try {
        const encodedQuery = encodeURIComponent(searchQuery);
        const response = await fetch(`http://localhost:80/api/questions/search/${encodedQuery}`);
        const data = await response.json();
        setSearchResults(data);
    } catch (error) {
        console.error(error);
    }
};

  // useEffect(() => {
  //   if (posts)
  //   // Initialize filtered posts with all posts on component mount
  //   setFilteredPosts(posts);
  // }, [posts]);
  
  return (
   <>
      {/* <h3 className='fst-italic fw-bold text-center text-dark  d-md-none'>Unify</h3> */}
    <header className="mt-0 bg-secondary text-dark w-100 " style={{position:"fixed" ,zIndex: 1, height:"70px"}}>
      <div className='bg-dark d-flex justify-content-center align-items-center d-md-none'>
            <img src={logo} style={{"margin":"0", "width":"65px", height:"25px"}} ></img>
      </div>
    <div className="mb-6">
    <div className="d-flex flex-wrap justify-content-around">
        {/* Left corner: Unify */}
        <h3 className="fst-italic fw-bold fs-1 d-none d-md-block">
          <Link to="/" className="text-light text-decoration-none">
            <img src={logo} style={{"margin":"0", "width":"155px", height:"55px"}}></img>
          </Link>
  
        </h3>

        {/* Centered navigation items */}
        <div className="nav col-lg-auto  3mb-md-0 fw-bold mt-0" >
          {(user?.currentUser?._id) ? (
            <>
            {console.log(user?.currentUser)}
          <Link to="/" className="nav-link px-2 link-light text-light  ">
            <Home style={{"height":"1.5em" ,"width":"1.5em","color":"whitesmoke", }}/>
          </Link>
              <Link to="/profile" className="nav-link px-2 link-light text-light">
                <AccountBox style={{"height":"1.5em" ,"width":"1.5em", "color":"whitesmoke"}} />
              </Link>
              <Link to="/Myposts" className="nav-link px-2 link-light text-light">
                <ListAlt  style={{"height":"1.5em","width":"1.5em","color":"whitesmoke"}}/>
              </Link>
              <Link to="/" onClick={() => setIsModalOpen(true)} className="nav-link px-2 link-light text-light">
              <AddBox style={{"height":"1.5em","width":"1.5em","color":"whitesmoke"}}/>
              </Link>
            </>
          ) :(
            <>
            <Link to="/" className="nav-link px-2 link-light text-light">
              
            <i class="fa fa-sign-in fs-5" aria-hidden="true">Home</i>
          </Link>
            <Link to="/sign-in" className="nav-link px-2 link-light text-light">
              
            <i class="fa fa-sign-in fs-5" aria-hidden="true">SignIn</i>
          </Link>
          <Link to="/sign-up"  className="nav-link px-2 link-light text-light">
            <i class="fa fa-sign-in fs-5" aria-hidden="true">SignUp</i>
          </Link>
            </>
          )}
        </div>

        {/* Right-aligned dropdown and search */}
        <div className="d-flex cols ">

          <div>
            {user?.currentUser?._id ?
            <>
            {/* <input type='text' placeholder='Search Question here....'  value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}/>
                 <button onClick={handleSearch}>Search</button> */}
            <Avatar src={user?.currentUser?.profilePicture} onClick={()=>navigate('/profile')}/>
            </>
            :
            <Avatar src={user?.currentUser?.profilePicture} onClick={()=>navigate('/sign-up')}/>
           
          }
            {/* <Link
              to="/"
              className="d-block link-light text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              >

           {loggedin===true 
           ? 
           <>
           <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
           <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
                <Button onClick={()=>navigate('/profile')}>
                <Link to="/profile" className="text-dark text-decoration-none">
                Profile
                </Link>
                </Button>
                <Button onClick={handleSignout}>Sign out</Button>
              </ul>
           </>
           :
           
           <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
           <Button onClick={() =>navigate('/sign-in')}>SignIn</Button>
           <Button onClick={()=>navigate('/sign-up')}>
            
           SignUp
           
           </Button>
           
           </ul>
           
           
           }
           
            </Link>
             */}
          </div>
        </div>
      </div>
    </div>





{/*
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
                }}
              >
                <div className="modal__title">
                  <h5>Add Question</h5>
                  <h5>Share Link</h5>
                  </div>
                <div className="modal__info">
                  <Avatar className="avatar" src={user?.currentUser?.profilePicture} />
                  <div className="modal__scope">
                    <PeopleAltOutlined />
                    
                    <p>Public</p>
                    <ExpandMore /> 
                    <p>{user?.currentUser?.username}</p>
                    </div>
                </div>
                <div className="modal__Field">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    type="text"
                    placeholder="Start your question with 'What', 'How', 'Why', etc. " />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <input
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      style={{
                        margin: '5px 0',
                        border: '1px solid lightgray',
                        padding: '10px',
                        outline: '2px solid #000',
                      }}
                      type="text"
                      placeholder="Optional: include a link that gives context" />
                    {inputUrl !== '' && (
                      <img
                        style={{
                          height: '40vh',
                          objectFit: 'contain',
                        }}
                        src={inputUrl}
                        alt="displayImage" />
                    )}
                    </div>
                </div>
                <div className="modal__buttons">
                  <button className="cancle" onClick={() => setIsModalOpen(false)}>
                    Cancel
                    </button>
                  <button className="add" onClick={handleSubmit}>
                    Add Question
                  </button>
                  </div>
              </Modal>
         */ }    

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
            <h1>Add Questions</h1>
            
            
            </div>
            <div className="modal__answer">
            <ReactQuill
            value={question}
            onChange={handleQuill}
            placeholder="Start Your Questions with Why , What, How , When ? "
              />
            </div>
            <div className="modal__button">
              <button className="cancle" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSubmit} type="submit" className="add">
              Add Questions
              </button>
              </div>
            </Modal> */}

              
    </header>
            </>
  );
};

export default Header;
