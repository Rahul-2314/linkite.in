import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Zoom, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Charts from "./charts/Charts";
import { fetchLinkAnalytics } from "../../services/api";
import "./analytics.css";
import checkmark from "../../assets/media/orange-checkmark.svg";

function Analytics() {
	const [analytics, setAnalytics] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [copied, setCopied] = useState(false);
	const [isQrLoading, setIsQrLoading] = useState(true);
	const [isExporting, setIsExporting] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const { shortUrl } = useParams();
	const qrRef = useRef(null);

	const API_BASE_URL =
		import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

	const fetchAnalytics = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchLinkAnalytics(shortUrl);
			setAnalytics(data);
			setIsQrLoading(false);
		} catch (error) {
			const errorMessage =
				error.response?.status === 404
					? "Link not found"
					: error.response?.status === 403
					? "You don't have access to this link"
					: "Failed to load analytics data";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (shortUrl) {
			fetchAnalytics();
		}

		return () => {
			setAnalytics([]);
			setLoading(true);
		};
	}, [shortUrl]);

	const copyURL = async () => {
		try {
			await navigator.clipboard.writeText(`${API_BASE_URL}/${shortUrl}`);
			setCopied(true);
			toast.success("URL copied to clipboard!");
			setTimeout(() => setCopied(false), 3000);
		} catch (err) {
			toast.error("Failed to copy URL");
		}
	};

	const formatDateTime = (dateString) => {
		if (!dateString) return "Not available";
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "Not available";
		return date.toLocaleString();
	};

	const downloadQR = () => {
		const qrImg = qrRef.current;
		if (!qrImg) {
			toast.error("QR Code not available");
			return;
		}
		const link = document.createElement("a");
		link.href = qrImg.src;
		link.download = `QRCode-${shortUrl}.png`;
		link.click();
		toast.info("QR Code downloaded");
	};

	const exportData = async () => {
		setIsExporting(true);
		try {
			const dataStr = JSON.stringify(analytics, null, 2);
			const dataBlob = new Blob([dataStr], { type: "application/json" });
			const url = URL.createObjectURL(dataBlob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `analytics-${shortUrl}.json`;
			link.click();
			URL.revokeObjectURL(url);
			toast.success("Analytics data exported successfully");
		} catch (error) {
			toast.error("Failed to export data");
		} finally {
			setIsExporting(false);
		}
	};

	const downloadReport = async () => {
		setIsDownloading(true);
		try {
			setTimeout(() => {
				window.print();
				toast.success("Report downloaded successfully");
				setIsDownloading(false);
			}, 1500);
		} catch (error) {
			toast.error("Failed to generate report");
			setIsDownloading(false);
		}
	};

	if (loading) {
		return (
			<div
				className="loading_loader"
				aria-live="polite"
				aria-label="Loading analytics data"
			>
				<i className="fa-solid fa-spinner fa-spin"></i>
			</div>
		);
	}

	if (error) {
		return (
			<div className="error-container" aria-live="assertive">
				<i className="fas fa-exclamation-circle"></i>
				<h3>Error loading analytics</h3>
				<p>{error}</p>
				<button
					onClick={fetchAnalytics}
					className="retry-btn"
					aria-label="Retry loading analytics"
				>
					<i className="fas fa-redo"></i> Retry
				</button>
			</div>
		);
	}

	return (
		<div className="analytics-container">
			<h1 className="analytics-header">--MyAnalytics : Advance Analytics--</h1>

			<div className="stats-cards">
				<div className="stat-card">
					<div className="stat-icon">
						<i className="fas fa-mouse-pointer"></i>
					</div>
					<div className="stat-details">
						<h3>Total Clicks</h3>
						<p className="stat-value">{analytics.clicks || 0}</p>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon">
						<i className="fas fa-calendar-alt"></i>
					</div>
					<div className="stat-details">
						<h3>Created On</h3>
						<p className="stat-value">{formatDateTime(analytics.createdAt)}</p>
					</div>
				</div>
			</div>

			<div className="link-details-card">
				<h2>
					<i className="fas fa-link"></i>Link Information
				</h2>

				<div className="link-item">
					<div className="link-label">
						<i className="fas fa-link"></i> Short URL
					</div>
					<div className="link-value">
						<a
							href={`${API_BASE_URL}/${analytics.shortUrl}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							{API_BASE_URL}/{analytics.shortUrl}
						</a>
						<button
							className={`copy-btn ${copied ? "copied" : ""}`}
							onClick={copyURL}
							aria-label="Copy short URL to clipboard"
						>
							{copied ? (
								<i className="fas fa-check"></i>
							) : (
								<i className="fas fa-copy"></i>
							)}
						</button>
					</div>
					<div className="verify">
						<img loading="lazy" src={checkmark} alt="checkmark" />
						<p className="vtext">Verified by Google.</p>
					</div>
				</div>

				<div className="link-item">
					<div className="link-label">
						<i className="fas fa-external-link-alt"></i> Original URL
					</div>
					<div className="link-value">
						<a
							href={analytics.originalUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="original-url"
							title={analytics.originalUrl}
						>
							{analytics.originalUrl}
						</a>
					</div>
				</div>

				<div className="qr-container">
					<h3>
						<i className="fas fa-qrcode"></i> QR Code
					</h3>
					{isQrLoading ? (
						<div className="qr-loading">
							<i className="fa-solid fa-spinner fa-spin"></i>
						</div>
					) : analytics.qrCode ? (
						<>
							<div className="qr-wrapper">
								<img
									ref={qrRef}
									src={analytics.qrCode}
									alt="QR Code for short URL"
									className="qrCode"
									loading="lazy"
									onError={() => setIsQrLoading(false)}
									onLoad={() => setIsQrLoading(false)}
								/>
								<i
									className="fas fa-download"
									onClick={downloadQR}
									aria-label="Download QR Code"
								></i>
							</div>
						</>
					) : (
						<p className="qr-not-available">QR Code not available</p>
					)}
				</div>
			</div>

			<div className="analytics-content">
				<h2 className="analytics-header-main">
					<i className="fas fa-chart-bar"></i> Performance Analytics
				</h2>
				<Charts analytics={analytics} />
			</div>

			<div className="actions-container">
				<button
					className="action-btn"
					onClick={exportData}
					disabled={isExporting}
					aria-label="Export raw analytics data"
				>
					{isExporting ? (
						<>
							<i className="fa-solid fa-spinner fa-spin"></i> Exporting...
						</>
					) : (
						<>
							<i className="fas fa-file-download"></i> Export Raw Data
						</>
					)}
				</button>
				<button
					className="action-btn"
					onClick={downloadReport}
					disabled={isDownloading}
					aria-label="Download analytics report as PDF"
				>
					{isDownloading ? (
						<>
							<i className="fa-solid fa-spinner fa-spin"></i> Generating PDF...
						</>
					) : (
						<>
							<i className="fas fa-file-pdf"></i> Download Report
						</>
					)}
				</button>
			</div>

			<div className="end-analytics">
				-----------------------------------------------------
			</div>
			<strong>
				<ToastContainer position="bottom-right" transition={Zoom} />
			</strong>
		</div>
	);
}

export default Analytics;
