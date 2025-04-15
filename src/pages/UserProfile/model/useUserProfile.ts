import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/app/providers/store'
import { IContact } from 'src/entities/course/model/types'
import { useUserCourses } from 'src/entities/course/model/useUserCourses'
import { fetchReviewsByContactId } from 'src/entities/feedback/model/fetchReviewsByContactId'
import { fetchContactById } from 'src/entities/user/model/fetchContact'
import {
	setLoading,
	setUserProfile,
} from 'src/entities/user/model/userProfileSlice'

export const useUserProfile = () => {
	const [contactData, setContactData] = useState<IContact>()

	const dispatch = useDispatch()
	const {
		userData,
		coursesData,
		feedbacks,
		isNotify,
		selectedOptionsProfile,
		uniValueProfile,
		loading,
		error,
	} = useSelector((state: RootState) => state.userProfile)

	const userCoursesData = useUserCourses(window.Telegram.WebApp.initData)

	useEffect(() => {
		const loadData = async () => {
			try {
				if (!userCoursesData) {
					dispatch(setLoading(true))
					return
				}

				const contactId = userData?.id
				if (!contactId) {
					throw new Error('Contact ID не найден')
				}

				const contact = await fetchContactById(contactId)
				const reviews = await fetchReviewsByContactId(contactId)

				setContactData(contact)

				dispatch(
					setUserProfile({
						userData: userCoursesData,
						feedbacks: reviews || [],
						isNotify: userCoursesData.notify || false,
						selectedOptionsProfile: contact.subjects || [],
						uniValueProfile: userCoursesData.university || '',
					})
				)
			} catch (error) {
				console.error('Ошибка загрузки данных:', error)
			} finally {
				dispatch(setLoading(false))
			}
		}

		loadData()
	}, [dispatch, userCoursesData, userData?.id])

	return {
		userData,
		coursesData,
		feedbacks,
		isNotify,
		selectedOptionsProfile,
		uniValueProfile,
		loading,
		contactData,
		error,
	}
}
