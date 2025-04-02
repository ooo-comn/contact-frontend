import { ITelegramUser } from 'src/entities/course/model/types'
import { API_BASE_URL } from '../../../shared/config/api'

export const fetchUser = async (
	telegram_id: string
): Promise<ITelegramUser> => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/users/?telegram_id=${telegram_id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		if (!response.ok) {
			throw new Error(`Ошибка HTTP: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Ошибка при запросе к серверу:', error)
		throw error
	}
}
