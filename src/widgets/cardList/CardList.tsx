import { calculateRating } from '../../entities/course/lib/calculateRating'
import { ICourse } from '../../entities/course/model/types'
import ContactCard from '../../features/courses/components/ContactCard/ContactCard'
import styles from './CardList.module.css'

const CardList: React.FC<{ courses: ICourse[] }> = ({ courses }) => {
	console.log('courses', courses)
	console.log('courses.length', courses.length)

	return (
		<div className={styles['card-list']}>
			{courses.length > 0 ? (
				courses.map((item, index) => {
					const averageRate = item.feedback?.length
						? calculateRating(item.feedback)
						: 0

					return (
						<ContactCard
							key={index}
							itemCard={item}
							userPhoto={item.user.photo_url ?? ''}
							amountOfSales={item.amount_of_students ?? 0}
							averageRate={averageRate}
							userName={item.user.first_name ?? ''}
							userSecondName={item.user.last_name ?? ''}
							university={item.university ?? ''}
							count={item.feedback?.length}
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
