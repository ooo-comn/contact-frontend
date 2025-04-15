import { IContact } from '../../../entities/course/model/types'
import { API_BASE_URL } from '../../../shared/config/api'

const fetchGetCourses = async (): Promise<IContact[]> => {
	try {
		const response = await fetch(`${API_BASE_URL}/get-courses/`)
		const data = await response.json()
		return data || []
	} catch (error) {
		console.error('Error fetching data:', error)
		return []
	}
}

export default fetchGetCourses
