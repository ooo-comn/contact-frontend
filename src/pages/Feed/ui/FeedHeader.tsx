import { Link } from 'react-router-dom'
import PhoneIcon from '../../../shared/assets/course/Phone.svg'
import styles from '../Feed.module.css'

const FeedHeader = () => {
	return (
		<div className={styles['feed__header']}>
			<h1 className={styles['feed__title']}>Контакты</h1>
			<Link to='connect-bot'>
				<button className={styles['feed__create-button']}>
					<p className={styles['feed__create-button-count']}>10</p>
					<img
						src={PhoneIcon}
						alt='Количество оставшихся номеров'
						className={styles['feed__create-button-img']}
					/>
				</button>
			</Link>
		</div>
	)
}

export default FeedHeader
