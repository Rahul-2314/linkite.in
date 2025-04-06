import React from "react";
import "./premium.css";
import logo from "../../assets/media/pay-logo.png"

export default function Premium({profile, isUser, setShowLogin}) {

	const setupRazorpayTestPay = () => {
		if (!window.Razorpay) {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.async = true;
			script.onload = initializeRazorpay;
			document.body.appendChild(script);
		} else {
			initializeRazorpay();
		}
	};

	const initializeRazorpay = () => {
		const options = {
			key: "rzp_test_v4vc6ytdQY42eB", //razorpay test key
			amount: "49900",
			currency: "INR",
			name: "Linkite Premium",
			description: "Premium Subscription",
			// image: logo,
			handler: function (response) {
				console.log("Payment successful!");
			},
			prefill: {
				name: `${profile.fullname}`,
				email: `${profile.username}`,
			},
			notes: {
				address: "Linkite Corporate Office",
			},
			theme: {
				color: "#031f39",
			},
			modal: {
				ondismiss: function () {
					console.log("Payment dialog closed");
				},
			},
		};

		const razorpayInstance = new window.Razorpay(options);

		const token = localStorage.getItem("token");
		if(isUser && token) {
			razorpayInstance.open();
		}else {
			setShowLogin(true);
		}
	};

	return (
		<section id="premium">
			<div className="premium-header">
				<h1>-- Linkite Premium --</h1>
				<p className="subtitle">Elevate Your Link Management Experience</p>
			</div>
			<div className="plans">
				<div className="free">
					<div className="plan-header">
						<h2>Free Plan</h2>
						<p className="price">
							&#8377;0<span>/forever</span>
						</p>
					</div>
					<ul>
						<li>Limit: 50 URL per Month</li>
						<li>Basic Analytics</li>
						<li>Standard QR Code</li>
						<li>Extension Support</li>
						<li>Community Support</li>
					</ul>
				</div>

				<div className="premium">
					<div className="plan-header">
						<h2>Premium Plan</h2>
						<p className="price">
							&#8377;499<span>/month | (currently free)</span>
						</p>
					</div>
					<ul>
						<li>Unlimited URL Shortening</li>
						<li>Advanced Analytics</li>
						<li>Premium QR Codes</li>
						<li>Priority API Access</li>
						<li>24/7 Premium Support</li>
						<li>Team Management</li>
					</ul>
					<button className="subscribe" onClick={setupRazorpayTestPay}>
						Get Premium
						<span className="arrow">→</span>
					</button>
					<div className="badge">Special Offer &#127991;&#65039;</div>
				</div>
			</div>
		</section>
	);
}
