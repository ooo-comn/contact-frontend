import { ITelegramUser } from 'src/entities/course/model/types'
import { BASE_URL } from '../../../shared/config/api'

export const fetchUserById = async (userId: number): Promise<ITelegramUser> => {
	const response = await fetch(
		`https://${BASE_URL}.ru/users/?user_id=${userId}`
	)

	if (!response.ok) {
		throw new Error(
			`Ошибка при получении данных пользователя: ${response.status}`
		)
	}

	const data: ITelegramUser = await response.json()

	if (Array.isArray(data) && data.length > 0) {
		return data
	}

	throw new Error('Пользователь не найден')
}
