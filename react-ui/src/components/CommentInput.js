import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './commentInput.css';

const CommentInput = props => {
        
    const [comment, setComment] = useState("");
    const username = props.username;
    
    const handleInputChange = (event) => {
        event.persist();
        setComment(event.target.value);
      }

    const handleOnSubmit = (event) => {
        event.preventDefault();
        if(comment.length >= 1) {
        if (!username || !comment) return;
        fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, comment, userPic: 'https://i2.wp.com/www.refreshmarketing.co.uk/wp-content/uploads/2014/10/linked-in-profile-anonymous.jpg' }),
        }).then(res => res.json()).then((res) => {
          if (!res.success) console.log(res.error);
          else setComment("")
      });
     }
    }

    return (

  <form onSubmit={handleOnSubmit} className="inputRoot">
    <textarea
      type="comment"
      name="comment"
      placeholder="Add a public comment"
      value={comment}
      onChange={handleInputChange}
    />
    <button type="submit">Submit</button>
  </form>
)};

CommentInput.propTypes = {
  text: PropTypes.string,
  author: PropTypes.string,
};

export default CommentInput;