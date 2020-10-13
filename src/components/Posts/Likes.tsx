import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import './Likes.scss'
interface IProps {
	post: IPost;
	likes: ILikes;
	currentUser: ICurrentUser;
	addLike: (post_id: number, liker_id: number) => void;
  removeLike: (post_id: number, liker_id: number) => void;
}

interface IPost {
  avatar: string;
  studentrating: string;
  text_body: string;
  active: boolean;
  time_posted: Date;
  stack: any;
  username: string;
  post_id: number;
  id: number;
  owner_id: number;
}

interface ILikes {
  [index: number]: { id: number; liker_id: number; name: string };
}

interface ICurrentUser {
	id: number;
}

export default function Likes(props: IProps) {
	const postLikes = props.likes.filter(
    (like) => props.post.post_id === like.post_id
  );

	const likeSum = postLikes.length;
	
	const myLikes = postLikes.filter(
		(like) => props.currentUser.id === like.liker_id
	);

	const iAlreadyLikeThis = myLikes.length > 0;

	return (
		<div>
			 <div className="likes">
				{iAlreadyLikeThis ? (
					<FontAwesomeIcon 
					onClick={() => props.removeLike(props.post.post_id, props.currentUser.id)}
					className="unlove"
					icon={fasHeart} size="1x" />
				) : (                  
					<FontAwesomeIcon 
						onClick={() => props.addLike(props.post.post_id, props.currentUser.id)}
						className="love"
						icon={farHeart} size="1x" />
				)}

				<div className="likes-comments">
					{/* LIKE COUNT */}

					{iAlreadyLikeThis && likeSum > 1 ? 
						<p onClick={() => props.removeLike(props.post.post_id, props.currentUser.id)}>
						<b>You and {likeSum - 1} others</b></p> : ""}

					{!iAlreadyLikeThis && likeSum > 1 ? 
						<p onClick={() => props.addLike(props.post.post_id, props.currentUser.id)}>
						<b>{likeSum}  likes</b></p> : ""}

					{iAlreadyLikeThis && likeSum === 1 ? 
						<p                       onClick={() => props.removeLike(props.post.post_id, props.currentUser.id)}>
						<b>You like this</b></p> : ""}

					{!iAlreadyLikeThis && likeSum === 1 ? 
					<p onClick={() => props.addLike(props.post.post_id, props.currentUser.id)}><b>{likeSum} like</b></p> : ""}
					
				</div>
			</div>
		</div>
	);
};
