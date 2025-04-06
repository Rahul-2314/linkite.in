import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";
import fourOfour_pic from "../../assets/media/404-com.png";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="notfound-container">
			<div className="notfound-content">
				<img src={fourOfour_pic} alt="404" className="notfound-img" />
				<div className="notfound-text">
					<h1>404 - Page Not Found</h1>
					<p>
						Sorry, the page you're looking for doesn't exist or has been moved.
					</p>
					<button className="notfound-btn" onClick={() => navigate("/")}>
						Go Back Home
					</button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
