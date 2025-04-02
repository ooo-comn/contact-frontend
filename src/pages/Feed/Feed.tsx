import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useUserCoursesData from '../../entities/user/model/useUserCourses'
import NavBar from '../../shared/components/NavBar/NavBar'
import styles from './Feed.module.css'
import { useFeed } from './model/useFeed'
import FeedFilters from './ui/FeedFilters'
import FeedHeader from './ui/FeedHeader'
import FeedList from './ui/FeedList'
import FeedSearch from './ui/FeedSearch'

const Feed = () => {
	var BackButton = window.Telegram.WebApp.BackButton

	if (BackButton.isVisible) {
		BackButton.hide()
	}

	const navigate = useNavigate()
	const [activeFilter, setActiveFilter] = useState('Все контакты')

	const userId = window.Telegram.WebApp.initDataUnsafe.user.id
	const { userCourses } = useUserCoursesData(userId, navigate)

	const {
		inputValue,
		setInputValue,
		filteredData,
		isPending,
		startTransition,
	} = useFeed(activeFilter, userCourses)

	console.log('userCoursesFeed', userCourses)
	console.log(activeFilter)

	return (
		<div className={styles['feed']}>
			<FeedHeader />
			<FeedSearch
				inputValue={inputValue}
				onChange={e => startTransition(() => setInputValue(e.target.value))}
			/>
			<FeedFilters onFilterChange={setActiveFilter} />
			<FeedList filteredCourses={filteredData} isPending={isPending} />
			<Link
				to='/subscription'
				className={styles['feed__link-create-subscription']}
			>
				<button className={styles['feed__create-subscription']}>
					Оформить подписку
				</button>
			</Link>
			<NavBar />
		</div>
	)
}

export default Feed
