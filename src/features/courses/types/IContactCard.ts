import { ICourse } from '../../../entities/course/model/types'

export interface IContactCard {
	itemCard: ICourse
	userPhoto: string | null
	amountOfSales?: number
	userName: string | null
	userSecondName: string | null
	university: string | null
	averageRate?: number | null
	count?: number
}
