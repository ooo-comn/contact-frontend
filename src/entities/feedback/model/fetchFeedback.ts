import { API_BASE_URL } from '../../../shared/config/api'

export const fetchFeedbacks = async () => {
	try {
		const response = await fetch(`${API_BASE_URL}/reviews/`)
		const data = await response.json()
		return data.feedback || []
	} catch (error) {
		console.error('Error fetching data:', error)
		return []
	}
}
