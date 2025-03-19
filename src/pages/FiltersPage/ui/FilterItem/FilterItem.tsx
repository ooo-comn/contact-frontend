import { FC } from 'react'
import { Link } from 'react-router-dom'
import StarFeedbackIcon from '../../../../shared/assets/course/StarFeedback.svg'
import CheckIcon from '../../../../shared/assets/wallet/CheckIcon.svg'
import LinkArrow from '../../../../shared/assets/wallet/LinkArrow.svg'
import styles from './FilterItem.module.css'

interface IFilterItem {
	filterItemType: 'checkbox' | 'link' | 'button'
	text: string
	isNotify?: boolean
	isNotifyFAQ?: any
	checked?: boolean
	path?: string
	handleCheckboxChange?: () => void
}

const FilterItem: FC<IFilterItem> = ({
	text,
	filterItemType,
	isNotify,
	isNotifyFAQ,
	checked,
	handleCheckboxChange,
	path,
}) => {
	const content = (
		<div className={styles['filter-item']}>
			{filterItemType === 'button' && (
				<div className={styles['filter-item__button-content']}>
					<img
						className={styles['filter-item__icon']}
						src={StarFeedbackIcon}
						alt='Фильтр'
					/>
					<p className={styles['filter-item__text']}>{text}</p>
				</div>
			)}

			{filterItemType !== 'button' && (
				<p className={styles['filter-item__text']}>{text}</p>
			)}

			{filterItemType === 'button' ? (
				<div className={styles['filter-item__toggle']}>
					<input
						className={styles['filter-item__toggle-input']}
						type='checkbox'
						id='toggle'
						checked={isNotify}
						onChange={isNotifyFAQ}
					/>
					<label
						className={styles['filter-item__toggle-label']}
						htmlFor='toggle'
					></label>
				</div>
			) : filterItemType === 'checkbox' ? (
				<label className={styles['filter-item__checkbox-label']}>
					<input
						type='checkbox'
						checked={checked}
						onChange={handleCheckboxChange}
						className={styles['filter-item__checkbox-input']}
					/>
					<span
						className={`${styles['filter-item__checkbox-custom']} ${
							checked ? styles['filter-item__checkbox-custom--checked'] : ''
						}`}
					>
						{checked && (
							<img
								className={styles['filter-item__checkbox-icon']}
								src={CheckIcon}
								alt='✔'
							/>
						)}
					</span>
				</label>
			) : (
				<img
					className={styles['filter-item__link-icon']}
					src={LinkArrow}
					alt='Фильтр'
				/>
			)}
		</div>
	)

	return path ? <Link to={path}>{content}</Link> : content
}

export default FilterItem
