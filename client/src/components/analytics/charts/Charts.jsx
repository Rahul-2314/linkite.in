import React, { useState, useEffect } from "react";
import {
	AreaChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Area,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
	BarChart,
	Bar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
	LineChart,
	Line,
} from "recharts";
import './Charts.css';

function Charts({ analytics }) {
	const [clickData, setClickData] = useState([]);
	const [deviceData, setDeviceData] = useState([]);
	const [locationData, setLocationData] = useState([]);
	const [referrerData, setReferrerData] = useState([]);
	const [hourlyData, setHourlyData] = useState([]);

	useEffect(() => {
		if (analytics && analytics.analyticsData) {
			// clicks per day
			const formattedClicks = analytics.analyticsData.map((item) => ({
				name: new Date(item.clickedAt).toLocaleDateString(),
				clicks: 1,
			}));

			// clicks per day
			const aggregatedClicks = formattedClicks.reduce((acc, item) => {
				const existing = acc.find((entry) => entry.name === item.name);
				if (existing) {
					existing.clicks += 1;
				} else {
					acc.push(item);
				}
				return acc;
			}, []);

			setClickData(aggregatedClicks.reverse());

			// device analytics
			const deviceCounts = analytics.analyticsData.reduce((acc, entry) => {
				const userAgent = entry.userAgent || "Unknown";

				let deviceType = "Other";
				if (userAgent.includes("Windows")) deviceType = "Windows";
				else if (userAgent.includes("Macintosh")) deviceType = "Mac";
				else if (userAgent.includes("Linux") && !userAgent.includes("Android"))
					deviceType = "Linux";
				else if (userAgent.includes("Android")) deviceType = "Android";
				else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
					deviceType = "iOS";

				acc[deviceType] = (acc[deviceType] || 0) + 1;
				return acc;
			}, {});

			const formattedDevices = Object.entries(deviceCounts).map(
				([name, value]) => ({
					name,
					value,
				})
			);

			setDeviceData(formattedDevices);

			// location analytics
			const locationCounts = analytics.analyticsData.reduce((acc, entry) => {
				const location = entry.location || "Unknown";
				acc[location] = (acc[location] || 0) + 1;
				return acc;
			}, {});

			const formattedLocations = Object.entries(locationCounts)
				.map(([name, value]) => ({
					name,
					value,
				}))
				.sort((a, b) => b.value - a.value)
				.slice(0, 5);

			setLocationData(formattedLocations);

			// referrer analytics
			const referrerCounts = analytics.analyticsData.reduce((acc, entry) => {
				const referrer = entry.referrer || "Direct";
				acc[referrer] = (acc[referrer] || 0) + 1;
				return acc;
			}, {});

			const formattedReferrers = Object.entries(referrerCounts)
				.map(([name, value]) => ({
					name: name.includes("http") ? new URL(name).hostname : name,
					value,
				}))
				.sort((a, b) => b.value - a.value)
				.slice(0, 6);

			setReferrerData(formattedReferrers);

			// hourly analytics
			const hourCounts = Array(24).fill(0);

			analytics.analyticsData.forEach((entry) => {
				const hour = new Date(entry.clickedAt).getHours();
				hourCounts[hour]++;
			});

			const formattedHours = hourCounts.map((count, index) => ({
				hour: index,
				clicks: count,
			}));

			setHourlyData(formattedHours);
		}
	}, [analytics]);

	// Chart colors
	const COLORS = [
		"#8884d8",
		"#82ca9d",
		"#ffc658",
		"#ff7300",
		"#ff0000",
		"#00C49F",
	];

	return (
		<div className="analytics-dashboard">
			<header className="dashboard-header">
				<h1>Analytics Dashboard</h1>
				<p className="dashboard-summary">
					Total Clicks: <span>{analytics?.analyticsData?.length || 0}</span>
				</p>
			</header>

			<div className="dashboard-grid">
				<div className="chart-card engagement-chart">
					<h2>Engagement Over Time</h2>
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart
							data={clickData}
							margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
									<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
								</linearGradient>
							</defs>
							<XAxis dataKey="name" />
							<YAxis />
							<CartesianGrid strokeDasharray="3 3" />
							<Tooltip />
							<Area
								type="monotone"
								dataKey="clicks"
								stroke="#8884d8"
								fillOpacity={1}
								fill="url(#colorClicks)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>

				<div className="chart-card device-chart">
					<h2>Device Information</h2>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={deviceData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={80}
								fill="#8884d8"
								label
							>
								{deviceData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>

				<div className="chart-card location-chart">
					<h2>Top Locations</h2>
					<ResponsiveContainer width="100%" height={300}>
						<RadarChart cx="50%" cy="50%" outerRadius={80} data={locationData}>
							<PolarGrid />
							<PolarAngleAxis dataKey="name" />
							<PolarRadiusAxis />
							<Radar
								name="Locations"
								dataKey="value"
								stroke="#8884d8"
								fill="#8884d8"
								fillOpacity={0.6}
							/>
							<Tooltip />
						</RadarChart>
					</ResponsiveContainer>
				</div>

				<div className="chart-card referrer-chart">
					<h2>Traffic Sources</h2>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={referrerData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Bar dataKey="value" fill="#82ca9d" />
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div className="chart-card hourly-chart">
					<h2>Hourly Engagement</h2>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={hourlyData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="hour" />
							<YAxis />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="clicks"
								stroke="#ff7300"
								activeDot={{ r: 8 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}

export default Charts;
