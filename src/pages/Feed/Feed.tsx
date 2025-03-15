import styles from './Feed.module.css'
import FeedHeader from './ui/FeedHeader'

const Feed = () => {
	var BackButton = window.Telegram.WebApp.BackButton

	if (BackButton.isVisible) {
		BackButton.hide()
	}

	return (
		<div className={styles['feed']}>
			<FeedHeader />
			<div>Салам</div>
		</div>
	)
}

export default Feed
