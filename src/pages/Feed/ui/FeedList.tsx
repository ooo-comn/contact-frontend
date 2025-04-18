import { lazy, Suspense } from 'react'
import LoadingCard from 'src/shared/card/LoadingCard'
import { IContact } from '../../../entities/course/model/types'
import styles from '../Feed.module.css'

const CardList = lazy(() => import('../../../widgets/cardList/CardList'))

interface FeedListProps {
	filteredCourses: IContact[]
	isPending: boolean
}

const FeedList = ({ filteredCourses, isPending }: FeedListProps) => {
	console.log(filteredCourses)

	return (
		<Suspense
			fallback={
				<div className={styles['feed__loading']}>
					<LoadingCard />
					<LoadingCard />
					<LoadingCard />
				</div>
			}
		>
			{isPending ? (
				<div className={styles['feed__loading']}>
					<LoadingCard />
					<LoadingCard />
					<LoadingCard />
				</div>
			) : (
				<CardList contacts={filteredCourses} />
			)}
		</Suspense>
	)
}

export default FeedList
