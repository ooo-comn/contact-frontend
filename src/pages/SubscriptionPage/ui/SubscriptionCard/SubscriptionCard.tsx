import { FC } from 'react'
import PhoneIcon from '../../../../shared/assets/course/Phone.svg'
import styles from './SubscriptionCard.module.css'

interface ISubscriptionCard {
	contactsCount: string
	price: number
}

const SubscriptionCard: FC<ISubscriptionCard> = ({ contactsCount, price }) => {
	return (
		<div className={styles['subscription-card']}>
			<div className={styles['subscription-card__icon-wrapper']}>
				<img
					className={styles['subscription-card__icon']}
					src={PhoneIcon}
					alt='Стоимость подписки'
				/>
			</div>
			<div className={styles['subscription-card__info']}>
				<p className={styles['subscription-card__contacts-count']}>
					{contactsCount}
				</p>
				<p className={styles['subscription-card__price']}>
					{price} рублей на месяц
				</p>
			</div>
		</div>
	)
}

export default SubscriptionCard
