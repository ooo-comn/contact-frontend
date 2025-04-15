import { useEffect, useState } from 'react'
import { fetchReviewsByContactId } from 'src/entities/feedback/model/fetchReviewsByContactId'
import { fetchUserById } from 'src/entities/user/model/fetchUserById'
import { calculateRating } from '../../entities/course/lib/calculateRating'
import {
	IContact,
	IReview,
	ITelegramUser,
} from '../../entities/course/model/types'
import ContactCard from '../../features/courses/components/ContactCard/ContactCard'
import styles from './CardList.module.css'

const CardList: React.FC<{ contacts: IContact[] }> = ({ contacts }) => {
	console.log('courses', contacts)
	console.log('courses.length', contacts.length)
	const [users, setUsers] = useState<Record<number, ITelegramUser>>({})
	const [reviews, setReviews] = useState<Record<number, IReview[]>>({})

	useEffect(() => {
		const loadUsersAndReviews = async () => {
			const loadedUsers: Record<number, ITelegramUser> = {}
			const loadedReviews: Record<number, IReview[]> = {}

			for (const contact of contacts) {
				if (contact.user_id) {
					try {
						const user = await fetchUserById(contact.user_id)
						loadedUsers[contact.user_id] = user
					} catch (error) {
						console.error(
							`Ошибка при загрузке пользователя ${contact.user_id}:`,
							error
						)
					}
				}

				if (contact.id) {
					try {
						const contactReviews = await fetchReviewsByContactId(contact.id)
						loadedReviews[contact.id] = contactReviews
					} catch (error) {
						console.error(
							`Ошибка при загрузке отзывов для контакта ${contact.id}:`,
							error
						)
					}
				}
			}

			setUsers(loadedUsers)
			setReviews(loadedReviews)
		}

		if (contacts.length > 0) {
			loadUsersAndReviews()
		}
	}, [contacts])

	return (
		<div className={styles['card-list']}>
			{Object.keys(users).length > 0 ? (
				contacts.map((item, index) => {
					const user = item.user_id ? users[item.user_id] : undefined
					const contactReviews = reviews[item.id ?? 0] || []
					const averageRate =
						contactReviews.length > 0 ? calculateRating(contactReviews) : 0

					return (
						<ContactCard
							key={index}
							itemCard={item}
							userPhoto={user?.photo_url ?? ''}
							amountOfSales={item?.customer_count ?? 0}
							averageRate={averageRate}
							userName={user?.first_name ?? ''}
							userSecondName={user?.last_name ?? ''}
							university={user?.university ?? ''}
							count={contactReviews.length}
						/>
					)
				})
			) : (
				<div className={styles['card-list__main-wrapper-empty-courses']}>
					<div className={styles['card-list__wrapper-empty-courses-texts']}>
						<h2 className={styles['card-list__empty-courses-title']}>
							Такого контакта нет :(
						</h2>
						<p className={styles['card-list__empty-courses-text']}>
							Попробуй написать по-другому
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default CardList
