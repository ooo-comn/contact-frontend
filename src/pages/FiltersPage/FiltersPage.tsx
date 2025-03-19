import { FC, useState } from 'react'
import styles from './FiltersPage.module.css'
import FilterItem from './ui/FilterItem/FilterItem'

const FiltersPage: FC = () => {
	window.scrollTo(0, 0)

	var BackButton = window.Telegram.WebApp.BackButton
	BackButton.show()
	BackButton.onClick(function () {
		BackButton.hide()
	})
	window.Telegram.WebApp.onEvent('backButtonClicked', function () {
		window.history.back()
	})

	const [workTypeFilters, setWorkTypeFilters] = useState<{
		[key: string]: boolean
	}>({})
	const [universityFilters, setUniversityFilters] = useState<{
		[key: string]: boolean
	}>({})
	const [sortFilters, setSortFilters] = useState<{ [key: string]: boolean }>({})

	const [checked, setChecked] = useState(false)

	const handleCheckboxChange = () => {
		setChecked(prev => !prev)
	}

	const handleFilterChange = (section: string, filterName: string) => {
		switch (section) {
			case 'workType':
				setWorkTypeFilters(prev => ({
					...prev,
					[filterName]: !prev[filterName],
				}))
				break
			case 'university':
				setUniversityFilters(prev => ({
					...prev,
					[filterName]: !prev[filterName],
				}))
				break
			case 'sort':
				setSortFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }))
				break
		}
	}

	const handleApplyFilters = () => {
		const appliedFilters = {
			workType: workTypeFilters,
			university: universityFilters,
			sort: sortFilters,
			rating: checked,
		}

		console.log('Applied filters:', appliedFilters)
	}

	// const handleReset = () => {
	// 	setWorkTypeFilters({})
	// 	setUniversityFilters({})
	// 	setSortFilters({})
	// 	setChecked(false)
	// }

	return (
		<div className={styles['filters-page']}>
			<div className={styles['filters-page__header']}>
				<h1 className={styles['filters-page__title']}>Фильтры</h1>
				<button
					className={styles['filters-page__reset-button']}
					onClick={handleApplyFilters}
				>
					Сбросить
				</button>
			</div>

			<div className={styles['filters-page__content']}>
				<div className={styles['filters-page__section']}>
					<p className={styles['filters-page__section-title']}>Предмет</p>
					<FilterItem
						filterItemType='link'
						text='Все предметы'
						path='/subjects'
					/>
				</div>

				<div className={styles['filters-page__section']}>
					<p className={styles['filters-page__section-title']}>Тип работы</p>
					<div className={styles['filters-page__checkbox-group']}>
						<FilterItem
							filterItemType='checkbox'
							text='Online помощь'
							isNotify={workTypeFilters['Online помощь']}
							isNotifyFAQ={() =>
								handleFilterChange('workType', 'Online помощь')
							}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='Решение задач'
							isNotify={workTypeFilters['Решение задач']}
							isNotifyFAQ={() =>
								handleFilterChange('workType', 'Решение задач')
							}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='Дипломная работа'
							isNotify={workTypeFilters['Дипломная работа']}
							isNotifyFAQ={() =>
								handleFilterChange('workType', 'Дипломная работа')
							}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='Курсовая работа'
							isNotify={workTypeFilters['Курсовая работа']}
							isNotifyFAQ={() =>
								handleFilterChange('workType', 'Курсовая работа')
							}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='Реферат'
							isNotify={workTypeFilters['Реферат']}
							isNotifyFAQ={() => handleFilterChange('workType', 'Реферат')}
						/>
					</div>
					<button className={styles['filters-page__show-all-button']}>
						Все типы работ
					</button>
				</div>

				<div className={styles['filters-page__section']}>
					<p className={styles['filters-page__section-title']}>Университет</p>
					<div className={styles['filters-page__checkbox-group']}>
						<FilterItem
							filterItemType='checkbox'
							text='МГУ имени М. В. Ломоносова'
							isNotify={universityFilters['МГУ имени М. В. Ломоносова']}
							isNotifyFAQ={() =>
								handleFilterChange('university', 'МГУ имени М. В. Ломоносова')
							}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='НИУ ВШЭ'
							isNotify={universityFilters['НИУ ВШЭ']}
							isNotifyFAQ={() => handleFilterChange('university', 'НИУ ВШЭ')}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='МГТУ имени Баумана'
							isNotify={universityFilters['МГТУ имени Баумана']}
							isNotifyFAQ={() =>
								handleFilterChange('university', 'МГТУ имени Баумана')
							}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='МГИМО'
							isNotify={universityFilters['МГИМО']}
							isNotifyFAQ={() => handleFilterChange('university', 'МГИМО')}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='МФТИ'
							isNotify={universityFilters['МФТИ']}
							isNotifyFAQ={() => handleFilterChange('university', 'МФТИ')}
						/>
					</div>
					<button className={styles['filters-page__show-all-button']}>
						Все университеты
					</button>
				</div>

				<div className={styles['filters-page__section']}>
					<p className={styles['filters-page__section-title']}>Отзывы</p>
					<FilterItem
						filterItemType='button'
						text='Курсы с рейтингом 4 и 5 звёзд'
						checked={checked}
						handleCheckboxChange={handleCheckboxChange}
					/>
				</div>

				<div className={styles['filters-page__section']}>
					<p className={styles['filters-page__section-title']}>Сортировать</p>
					<div className={styles['filters-page__checkbox-group']}>
						<FilterItem
							filterItemType='checkbox'
							text='По умолчанию'
							isNotify={sortFilters['По умолчанию']}
							isNotifyFAQ={() => handleFilterChange('sort', 'По умолчанию')}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='По дате'
							isNotify={sortFilters['По дате']}
							isNotifyFAQ={() => handleFilterChange('sort', 'По дате')}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='Дешевле'
							isNotify={sortFilters['Дешевле']}
							isNotifyFAQ={() => handleFilterChange('sort', 'Дешевле')}
						/>
						<FilterItem
							filterItemType='checkbox'
							text='Дороже'
							isNotify={sortFilters['Дороже']}
							isNotifyFAQ={() => handleFilterChange('sort', 'Дороже')}
						/>
					</div>
				</div>
			</div>

			<button className={styles['filters-page__button-save']}>Применить</button>
		</div>
	)
}

export default FiltersPage
