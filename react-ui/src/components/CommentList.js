import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CommentListItem from './CommentListItem';
import CommentInput from './CommentInput';
import sortComments from '../selectors/selector';
import './commentList.css';
import 'whatwg-fetch';

const CommentList = (props) => {

  const [data, setData] = useState({});
    let pollInterval = null;

  useEffect(() => {

    //checks backend for new comment submitions every 2 seconds
    loadCommentsFromServer();

    if (!pollInterval) {
      pollInterval = setInterval(loadCommentsFromServer, 2000);
    }

    if (pollInterval) clearInterval(pollInterval);
  });

  const loadCommentsFromServer = () => {
    fetch('/api/comments/')
      .then(data => data.json())
      .then((res) => {
        if (!res.success) setData({ error: res.error });
        else setData({ data: sortComments(res.data) });
      });
  }

  const [username, setUsername] = useState("");
  const [usernameExists, setUsernameExists] = useState(false)

  const handleInputChange = (event) => {
    event.persist();
    setUsername(event.target.value);
  }

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if(username.length >= 1) setUsernameExists(true)

}

  return (
    <div className="cardContainer">
      {
        usernameExists ===  false &&
        <form onSubmit={handleOnSubmit} 
          className="inputUsername">
          <input
          type="comment"
          name="comment"
          placeholder="Username or Email"
          value={username}
          onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>
      }

      { usernameExists &&
        <div>
          <CommentInput 
          username = {username}
          />
          
        { 
          data && data.data && data.data.map(comment => (
          comment.username && comment.comment &&
          <CommentListItem {...comment} key={comment._id}/>
        ))
        }

        { 
          data.data && props.comment && props.comment.map(comment => (
          comment.username && comment.comment &&
          <CommentListItem {...comment} key={comment._id}/>
        ))
        }
        </div>
      }
    </div>
  );
};

CommentList.propTypes = {
  comment: PropTypes.arrayOf(PropTypes.shape({
    userName: PropTypes.string,
    userId: PropTypes.string,
    comment: PropTypes.string,
    id: PropTypes.string,
    dateTime: PropTypes.string
  })),
};

export default CommentList;