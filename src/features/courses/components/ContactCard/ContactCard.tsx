import { FC } from 'react'
import ButtonHeart from 'src/shared/assets/course/ButtonHeart.svg'
import ButtonSend from 'src/shared/assets/course/ButtonSend.svg'
import BuyersIcon from 'src/shared/assets/course/Buyers.svg'
import StarFeedbackIcon from 'src/shared/assets/course/StarFeedback.svg'
import { BASE_URL } from 'src/shared/config/api'
import { IContactCard } from '../../types/IContactCard'
import styles from './ContactCard.module.css'

const ContactCard: FC<IContactCard> = ({
	itemCard,
	userPhoto,
	amountOfSales,
	userName,
	userSecondName,
	university,
	averageRate,
	count,
}) => {
	if (!itemCard) return null

	return (
		<div className={styles['contact-card']}>
			<div className={styles['contact-card__header']}>
				<div className={styles['contact-card__user-info']}>
					<img
						className={styles['contact-card__user-avatar']}
						src={`url(https://${BASE_URL}.ru${userPhoto})`}
						alt='Аватарка юзера'
					/>
					<div className={styles['contact-card__user-details']}>
						<h2 className={styles['contact-card__user-name']}>
							{userName} {userSecondName}
						</h2>
						<div className={styles['contact-card__stats']}>
							<div className={styles['contact-card__stat-item']}>
								<img
									className={styles['contact-card__stat-icon']}
									src={BuyersIcon}
									alt='Количество покупок контакта'
								/>
								<p className={styles['contact-card__stat-text']}>
									Купили: {amountOfSales}
								</p>
							</div>
							<div className={styles['contact-card__stat-item']}>
								<img
									className={styles['contact-card__stat-icon']}
									src={StarFeedbackIcon}
									alt='Отзывы'
								/>
								<p className={styles['contact-card__stat-text']}>
									{averageRate}
								</p>
								<p className={styles['contact-card__stat-text']}>({count})</p>
							</div>
						</div>
					</div>
				</div>
				<div className={styles['contact-card__actions']}>
					<button className={styles['contact-card__action-button']}>
						<img
							className={styles['contact-card__action-icon']}
							src={ButtonHeart}
							alt='Добавить в избранное'
						/>
					</button>
					<button className={styles['contact-card__action-button']}>
						<img
							className={styles['contact-card__action-icon']}
							src={ButtonSend}
							alt='Поделиться контактом'
						/>
					</button>
				</div>
			</div>
			<h2 className={styles['contact-card__university']}>{university}</h2>
			<div className={styles['contact-card__subjects']}>
				<p className={styles['contact-card__subjects-title']}>Предметы</p>
				<div className={styles['contact-card__subjects-list']}>Предметы</div>
			</div>
			<button className={styles['contact-card__buy-button']}>
				Купить контакт
			</button>
		</div>
	)
}

export default ContactCard
