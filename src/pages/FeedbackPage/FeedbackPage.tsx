import { FC, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { calculateRating } from 'src/entities/course/lib/calculateRating'
import { IReview, ITelegramUser } from 'src/entities/course/model/types'
import { fetchFeedbacks } from 'src/entities/feedback/model/fetchFeedback'
import handlePublish from 'src/entities/feedback/model/handlePublish'
import { fetchUserById } from 'src/entities/user/model/fetchUserById'
import StarFeedbackIcon from 'src/shared/assets/course/StarFeedback.svg'
import BottomSheet from 'src/shared/components/BottomSheet/BottomSheet'
import MainButton from 'src/shared/components/MainButton/MainButton'
import ModalNotification from 'src/shared/components/ModalNotification/ModalNotification'
import StarRating from 'src/shared/components/StarRating/StarRating'
import Camera from '../../shared/assets/feedback/Camera.svg'
import EmptyStar from '../../shared/assets/feedback/EmptyStar.svg'
import FillStar from '../../shared/assets/feedback/FillStar.svg'
import { BASE_URL } from '../../shared/config/api'
import styles from './FeedbackPage.module.css'
import FeedbackCard from './ui/FeedbackCard/FeedbackCard'

const FeedbackPage: FC<{ isFullCourses: boolean }> = ({ isFullCourses }) => {
	window.scrollTo(0, 0)

	const location = useLocation()
	const isUserFeedback = location.pathname.startsWith('/user-feedback/')

	const navigate = useNavigate()
	const { id } = useParams()
	const [feedbacks, setFeedbacks] = useState<IReview[]>([])
	const [users, setUsers] = useState<Record<number, ITelegramUser>>({})
	const [isOpen, setIsOpen] = useState(false)
	const [userRating, setUserRating] = useState(0)
	const [revValue, setRevValue] = useState('')
	const [modalFillOpen, setModalFillOpen] = useState(false)
	const [currentUser, setCurrentUser] = useState<ITelegramUser | null>(null)

	console.log('userRating', userRating)
	var BackButton = window.Telegram.WebApp.BackButton
	BackButton.show()
	BackButton.onClick(function () {
		BackButton.hide()
	})
	window.Telegram.WebApp.onEvent('backButtonClicked', function () {
		window.history.back()
		// navigate(`/course/${id}`)
	})

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (isFullCourses) {
					const feedbackData = await fetchFeedbacks(id || '')
					setFeedbacks(feedbackData)

					const authorIds = feedbackData
						.map(review => review.author_id)
						.filter((id): id is number => typeof id === 'number')

					const usersData = await Promise.all(
						authorIds.map(authorId => fetchUserById(authorId))
					)

					const usersMap = usersData.reduce((acc, user) => {
						acc[user.id] = user
						return acc
					}, {} as Record<number, ITelegramUser>)

					setUsers(usersMap)
				}
			} catch (error) {
				console.error('Error loading data:', error)
			}
		}

		fetchData()
	}, [id, isFullCourses])

	useEffect(() => {
		const tg = window.Telegram.WebApp
		const user = tg.initDataUnsafe?.user
		if (user) {
			setCurrentUser({
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				photo_url: user.photo_url,
				balance: user.balance,
				description: user.description,
				is_active: user.is_active,
				is_staff: user.is_staff,
				notify: user.notify,
				registrated: user.registrated,
				telegram_id: user.telegram_id,
				university: user.university,
				username: user.username,
				verified: user.verified,
			})
		}
	}, [])

	const averageRate = useMemo(() => {
		return feedbacks.length > 0 ? calculateRating(feedbacks) : 0
	}, [feedbacks])

	const stars = Array.from({ length: 5 }, (_, i) =>
		i < averageRate ? FillStar : EmptyStar
	)

	const handleOkBtnClick = () => {
		setModalFillOpen(false)
		window.document.body.style.overflow = 'visible'
		document.documentElement.style.overflow = 'visible'
	}

	const handleRevChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target

		setRevValue(value)
	}

	const handlePublishClick = () => {
		handlePublish(revValue, userRating, id, setModalFillOpen, navigate)
		window.document.body.style.overflow = 'hidden'
		document.documentElement.style.overflow = 'hidden'
	}

	return (
		<div className={styles['feedback-page']}>
			<div className={styles['feedback-page__header']}>
				<div className={styles['feedback-page__title-wrapper']}>
					<h1 className={styles['feedback-page__title']}>Отзывы</h1>
					<p className={styles['feedback-page__count']}>{feedbacks.length}</p>
				</div>
				<div className={styles['feedback-page__rating']}>
					<h2 className={styles['feedback-page__rating-value']}>
						{averageRate}
					</h2>
					<div className={styles['feedback-page__rating-info']}>
						<div className={styles['feedback-page__rating-bar']}>
							{stars.map((star, index) => (
								<img
									key={index}
									className={styles['feedback-page__star']}
									src={star}
									alt='Рейтинг звезда'
								/>
							))}
						</div>
						<p className={styles['feedback-page__rating-text']}>
							Мнение пользователей
						</p>
					</div>
				</div>
			</div>
			<div className={styles['feedback-page__list']}>
				{feedbacks.length > 0 ? (
					feedbacks.map((item, index) => (
						<FeedbackCard
							date={item.created_at}
							path={
								users[item.author_id]?.photo_url
									? `https://${BASE_URL}.ru${users[item.author_id]?.photo_url}`
									: ''
							}
							text={item.comment || ''}
							university={users[item.author_id]?.university || ''}
							username={`${users[item.author_id]?.first_name || ''} ${
								users[item.author_id]?.last_name || ''
							}`}
							rating={item.rating}
							key={index}
						/>
					))
				) : (
					<div className={styles['feedback-page__wrapper-empty']}>
						<div className={styles['feedback-page__wrapper-empty-star']}>
							<img
								src={StarFeedbackIcon}
								alt=''
								className={styles['feedback-page__empty-img']}
							/>
						</div>
						<div className={styles['feedback-page__wrapper-empty-text']}>
							<h2 className={styles['feedback-page__empty-title']}>
								Пока нет отзывов и оценок
							</h2>
							{!isUserFeedback && (
								<p className={styles['feedback-page__empty-text']}>
									Курс пока что без отзывов, и&nbsp;мы&nbsp;будем очень рады,
									если ты&nbsp;станешь первым, кто его попробует! Купи сейчас
									и&nbsp;поделись своими впечатлениями с&nbsp;нами
								</p>
							)}
						</div>
					</div>
				)}
			</div>
			{!isUserFeedback && (
				<div className={styles['feedback-page__button']}>
					<MainButton
						onClickEvent={() => setIsOpen(true)}
						text='Оставить отзыв'
					/>
				</div>
			)}

			{!isFullCourses && (
				<BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
					<div className={styles['feedback-page__modal-title-wrapper']}>
						<h2 className={styles['feedback-page__modal-title']}>
							Оставить отзыв
						</h2>
						<div className={styles['feedback-page__modal-info-wrapper']}>
							<div className={styles['feedback-page__modal-info']}>
								<div className={styles['feedback-page__modal-user']}>
									<img
										src={
											currentUser?.photo_url
												? `https://${BASE_URL}.ru${currentUser.photo_url}`
												: ''
										}
										alt=''
									/>
									<h3 className={styles['feedback-page__modal-name']}>
										{currentUser?.first_name || ''}{' '}
										{currentUser?.last_name || ''}
									</h3>
								</div>
								<div className={styles['feedback-page__modal-course']}>
									<p className={styles['feedback-page__modal-course-name']}>
										{currentUser?.last_name || 'Не указано'}
									</p>
									<p
										className={styles['feedback-page__modal-course-university']}
									>
										{currentUser?.university || 'Не указано'}
									</p>
								</div>
							</div>

							<div className={styles['feedback-page__modal-image']}>
								{currentUser?.photo_url ? (
									<img
										src={`https://${BASE_URL}.ru${
											currentUser?.photo_url || ''
										}`}
										alt='Аватар курса'
										className={styles['feedback-page__modal-image-img']}
									/>
								) : (
									<div className={styles['feedback-page__modal-placeholder']}>
										<img
											src={Camera}
											alt=''
											className={styles['feedback-page__modal-placeholder-img']}
										/>
										<p
											className={
												styles['feedback-page__modal-placeholder-text']
											}
										>
											Обложка отсутствует
										</p>
									</div>
								)}
							</div>
						</div>

						<div className={styles['feedback-page__modal-rating']}>
							<h2 className={styles['feedback-page__modal-rating-title']}>
								Как вам курс?
							</h2>

							<StarRating onRate={rating => setUserRating(rating)} />
						</div>

						<div className={styles['feedback-page__modal-comment']}>
							<h2 className={styles['feedback-page__modal-rating-title']}>
								Комментарий
							</h2>
							<textarea
								className={styles['feedback-page__modal-textarea']}
								name=''
								id=''
								value={revValue}
								onChange={handleRevChange}
							></textarea>
						</div>

						<div className={styles['feedback-page__modal-actions']}>
							<button
								className={styles['feedback-page__modal-cancel']}
								onClick={() => setIsOpen(false)}
							>
								Отменить
							</button>
							<button
								className={styles['feedback-page__modal-submit']}
								onClick={handlePublishClick}
							>
								Отправить
							</button>
						</div>
					</div>
				</BottomSheet>
			)}
			{modalFillOpen && (
				<ModalNotification
					text='Заполните все обязательные поля'
					title='Внимание'
					onClose={handleOkBtnClick}
				/>
			)}
		</div>
	)
}

export default FeedbackPage
