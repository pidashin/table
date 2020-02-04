import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

const Pagination = ({
	gotoFirstPage,
	previousPage,
	nextPage,
	gotoLastPage,
	isFirstPage,
	isLastPage,
	currentPage,
	totalPages,
	gotoPage
}) => {
	return (
		<div>
			<button
				onClick={gotoFirstPage}
				style={{ marginRight: '5px' }}
				disabled={isFirstPage}
			>
				{'<<'}
			</button>
			<button
				onClick={previousPage}
				style={{ marginRight: '5px' }}
				disabled={isFirstPage}
			>
				{'<'}
			</button>
			<button
				onClick={nextPage}
				style={{ marginRight: '5px' }}
				disabled={isLastPage}
			>
				{'>'}
			</button>
			<button
				onClick={gotoLastPage}
				style={{ marginRight: '5px' }}
				disabled={isLastPage}
			>
				{'>>'}
			</button>
			<span>
				Page{' '}
				<strong>
					{currentPage} of {totalPages}
				</strong>
			</span>
			<div>
				<span>go To Page</span>
				<input
					type="number"
					defaultValue={currentPage}
					onChange={e => gotoPage(e.target.value)}
				/>
			</div>
		</div>
	)
}

Pagination.propTypes = {
	gotoFirstPage: PropTypes.func.isRequired,
	previousPage: PropTypes.func.isRequired,
	nextPage: PropTypes.func.isRequired,
	gotoLastPage: PropTypes.func.isRequired,
	isFirstPage: PropTypes.bool.isRequired,
	isLastPage: PropTypes.bool.isRequired,
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	gotoPage: PropTypes.func.isRequired
}

const Cell = ({ value }) => <div style={{ padding: '5px 10px' }}>{value}</div>
Cell.propTypes = {
	row: PropTypes.object.isRequired,
	rowIndex: PropTypes.number.isRequired,
	columnId: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

const HeaderCell = ({ header, isSortingHead, sortOrder }) => {
	return (
		<div style={{ padding: '10px 5px' }}>
			{header}
			{isSortingHead && sortOrder
				? sortOrder === 'aesc'
					? '▲'
					: '▼'
				: null}
		</div>
	)
}
HeaderCell.propTypes = {
	header: PropTypes.string.isRequired,
	isSortingHead: PropTypes.bool.isRequired,
	sortOrder: PropTypes.oneOf([null, 'aesc', 'desc'])
}

const defaultThemes = {
	dark: {
		backgroundColor: '#191919',
		borderColor: '#f5f5f5',
		color: '#f5f5f5'
	},
	light: {
		backgroundColor: '#f5f5f5',
		borderColor: '#191919',
		color: '#191919'
	}
}

const regA = /[^a-zA-Z]/g,
	regN = /[^0-9]/g
const sortAlphaNum = (a, b) => {
	const tmpA = a.toString(),
		tmpB = a.toString()
	const aA = tmpA.replace(regA, '')
	const bA = tmpB.replace(regA, '')

	if (aA === bA) {
		const aN = parseInt(tmpA.replace(regN, ''), 10)
		const bN = parseInt(tmpB.replace(regN, ''), 10)
		return aN === bN ? 0 : aN > bN ? 1 : -1
	} else {
		return aA > bA ? 1 : -1
	}
}

const Table = ({
	className,
	columns,
	data,
	theme,
	pageSize,
	renderPagination,
	showPagnation,
	renderCell,
	renderHeaderCell
}) => {
	const theme_apply =
		typeof theme === 'string'
			? defaultThemes[theme] || defaultThemes.light
			: typeof theme === 'object'
			? Object.assign({}, defaultThemes.light, theme)
			: defaultThemes.light
	const { backgroundColor, borderColor, color } = theme_apply

	const colStyle = {
		border: `1px solid ${borderColor}`,
		borderCollapse: 'collapse',
		color
	}

	const [source, setSource] = useState(data)
	const [sortBy, setSortBy] = useState(null)
	const [sortOrder, setSortOrder] = useState(null)

	const handleSort = (accessor, compareFN) => {
		const tmpSortOrder =
			sortOrder === null ? 'aesc' : sortOrder === 'aesc' ? 'desc' : null

		let tmpSource = Array.from(data)
		if (tmpSortOrder) {
			tmpSource.sort((a, b) => {
				const colA = a[accessor],
					colB = b[accessor]
				const result = compareFN(colA, colB)

				return tmpSortOrder === 'aesc' ? result : -result
			})
		}

		setSortBy(accessor)
		setSortOrder(tmpSortOrder)
		setSource(tmpSource)
	}

	const HeaderCellComp = renderHeaderCell

	const titles = [],
		accessors = []
	columns.forEach((item, idx) => {
		const { header, accessor, disableSorting = false, sorting } = item

		accessors.push(accessor)

		const isSortingValid =
			(typeof sorting === 'string' && sorting === 'basic') ||
			typeof sorting === 'function'
		const canSort = !disableSorting && isSortingValid
		const compareFN = canSort
			? typeof sorting === 'function'
				? sorting
				: sortAlphaNum
			: null

		const isSortingHead = sortBy === accessor

		titles.push(
			<th
				key={idx}
				style={Object.assign({}, colStyle, {
					cursor: canSort ? 'pointer' : 'default'
				})}
				onClick={
					canSort
						? () => {
								handleSort(accessor, compareFN)
						  }
						: null
				}
			>
				<HeaderCellComp
					header={header}
					isSortingHead={isSortingHead}
					sortOrder={sortOrder}
				/>
			</th>
		)
	})

	const [pageIdx, setPageIdx] = useState(0),
		pageSize_apply = pageSize || data.length || 0,
		lastPageIdx =
			pageSize_apply !== 0
				? Math.floor(data.length / pageSize_apply) -
				  (data.length % pageSize_apply > 0 ? 0 : 1)
				: 0

	const pageSource = source.slice(
		pageIdx * pageSize_apply,
		pageIdx * pageSize_apply + pageSize_apply
	)

	const gotoFirstPage = useCallback(() => {
		setPageIdx(0)
	}, [])
	const previousPage = useCallback(() => {
		setPageIdx(prev => {
			return Math.max(prev - 1, 0)
		})
	}, [])
	const nextPage = useCallback(() => {
		setPageIdx(prev => {
			return Math.min(prev + 1, lastPageIdx)
		})
	}, [])

	const gotoLastPage = useCallback(() => {
		setPageIdx(lastPageIdx)
	}, [])

	const gotoPage = useCallback(pageIdx => {
		setPageIdx(
			pageIdx && !isNaN(pageIdx)
				? Math.min(Math.max(pageIdx - 1, 0), lastPageIdx)
				: 0
		)
	}, [])

	const paginationProps = {
		gotoFirstPage,
		previousPage,
		nextPage,
		gotoLastPage,
		isFirstPage: pageIdx === 0,
		isLastPage: pageIdx === lastPageIdx,
		currentPage: pageIdx + 1,
		totalPages: lastPageIdx + 1,
		gotoPage
	}

	const PagnationComp = renderPagination

	const CellComp = renderCell

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center'
			}}
			className={className || ''}
		>
			<table
				style={{
					border: `1px solid ${borderColor}`,
					borderCollapse: 'collapse',
					color,
					backgroundColor
				}}
			>
				<thead>
					<tr>{titles}</tr>
				</thead>
				<tbody>
					{pageSource.map((item, idx) => {
						return (
							<tr key={idx}>
								{accessors.map((accessor, idx2) => {
									return (
										<td key={idx2} style={colStyle}>
											<CellComp
												row={item}
												rowIndex={idx}
												columnId={accessor}
												value={item[accessor] || ''}
											/>
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
			<br />
			{showPagnation && <PagnationComp {...paginationProps} />}
		</div>
	)
}

Table.defaultProps = {
	theme: defaultThemes.light,
	columns: [],
	data: [],
	renderPagination: Pagination,
	showPagnation: true,
	renderCell: Cell,
	renderHeaderCell: HeaderCell
}

Table.propTypes = {
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			header: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				.isRequired,
			accessor: PropTypes.string.isRequired,
			disableSorting: PropTypes.bool,
			sorting: PropTypes.func
		})
	),
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	pageSize: PropTypes.number,
	theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	renderPagination: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
	showPagnation: PropTypes.bool,
	renderCell: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
	renderHeaderCell: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
}

export default Table
