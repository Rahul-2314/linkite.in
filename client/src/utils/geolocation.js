// src/utils/geolocation.js

const cache = new Map();

export async function fetchGeolocation(ip, retries = 3, delay = 1000) {
	if (cache.has(ip)) {
		return cache.get(ip);
	}

	const fetchWithRetry = async (attemptsLeft) => {
		try {
			const response = await fetch(`https://ipapi.co/${ip}/json/`);
			if (!response.ok) throw new Error("Failed to fetch");
			const data = await response.json();
			cache.set(ip, data);
			return data;
		} catch (error) {
			if (attemptsLeft <= 1) {
				console.error("Geolocation fetch failed for IP:", ip);
				return null;
			}
			await new Promise((res) => setTimeout(res, delay));
			return fetchWithRetry(attemptsLeft - 1);
		}
	};

	return fetchWithRetry(retries);
}
