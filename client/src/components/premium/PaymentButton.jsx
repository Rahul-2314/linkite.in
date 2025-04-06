import React from "react";

function PaymentButton() {
	return (
		<form>
			<script
				src="https://checkout.razorpay.com/v1/payment-button.js"
				data-payment_button_id="pl_QFTPOWZCu5MYkb"
				async
			></script>
		</form>
	);
}

export default PaymentButton;
