import React from 'react';
import PropTypes from 'prop-types';
import './commentListItem.css';
import img from './like.png';

function CommentListItem({ _id, username, comment, userPic }) {

  return (
    <div className="card">
          <div className="imageContainer">
            <img src={userPic} alt={username} className="img-responsive" height="80px" width="80px"/>
          </div>

          <div className="cardContent">
            <h3>
            {username}
            </h3>
            <p>
            {comment}
            </p>
          </div>
    </div>
  );
}

CommentListItem.propTypes = {
    username: PropTypes.string,
    userId: PropTypes.string,
    comment: PropTypes.string,
    id: PropTypes.string,
    dateTime: PropTypes.string
};

export default CommentListItem;