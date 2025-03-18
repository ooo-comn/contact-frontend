import cn from 'classnames'
import { FC } from 'react'
import styles from './SubscriptionButton.module.css'

interface ISubscriptionButton {
	saleType: string
	imagePath: string
	isActive: boolean
	onClick: () => void
}

const SubscriptionButton: FC<ISubscriptionButton> = ({
	saleType,
	imagePath,
	isActive,
	onClick,
}) => {
	return (
		<button className={styles['subscription-button']} onClick={onClick}>
			<img
				className={cn(styles['subscription-button__icon'], {
					[styles['subscription-button__icon_isActive']]: isActive,
				})}
				src={imagePath}
				alt='Способ оплаты'
			/>
			<p className={styles['subscription-button__text']}>{saleType}</p>
		</button>
	)
}

export default SubscriptionButton
