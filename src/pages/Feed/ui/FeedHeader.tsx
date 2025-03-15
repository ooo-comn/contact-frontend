import { Link } from 'react-router-dom'
import styles from '../Feed.module.css'

const FeedHeader = () => {
	return (
		<div className={styles['feed__header']}>
			<h1 className={styles['feed__title']}>Курсы</h1>
			<Link to='connect-bot'>
				<button className={styles['feed__create-button']}>+</button>
			</Link>
		</div>
	)
}

export default FeedHeader
