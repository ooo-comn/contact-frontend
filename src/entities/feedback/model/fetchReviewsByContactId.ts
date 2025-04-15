import { IReview } from 'src/entities/course/model/types'
import { BASE_URL } from '../../../shared/config/api'

export const fetchReviewsByContactId = async (
	contactId: number
): Promise<IReview[]> => {
	const response = await fetch(
		`https://${BASE_URL}.ru/reviews/?contact_id=${contactId}`
	)
	if (!response.ok) {
		throw new Error('Ошибка при получении отзывов')
	}
	return response.json()
}
