import React, { useEffect, useState } from 'react'
import UnifyBox from './UnifyBox'
import Post  from './Post'
import './css/feed.css'
import axios from 'axios'

const Feed = () => {
  const [posts,setPosts] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  useEffect (()=>{
    console.log(process.env.REACT_APP_API_BASE_URL);
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/questions`)
         .then((res)=>{
           console.log(res.data.reverse());
           setPosts(res.data);
         })
         .catch((e)=>{
          console.log(e)
         })
  },[])



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
  return (
    <div className='feed' >
   
      <UnifyBox />
      {/* <input type='text' placeholder='Search Question here....'  value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}/>
                 <button onClick={handleSearch}>Search</button> */}
      {
        posts.map((post,index)=>
        (<Post key ={index}
          post={post}/>))
      }
    </div>
  )
}

export default Feed