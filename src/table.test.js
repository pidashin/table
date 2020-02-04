import React from 'react'
import {
	render,
	fireEvent,
	getByText as _getByText,
	queryByText as _queryByText
} from '@testing-library/react'
import Table from './table.js'

test('should render a table node', () => {
	const { container } = render(<Table />)

	const table = container.firstChild.getElementsByTagName('table')[0]

	expect(table).toBeInTheDocument()
})

const makeData = count => {
	const result = [],
		max = 10000,
		min = 100
	for (let i = 1; i <= count; i++) {
		result.push({
			id: i,
			desc: `sample product ${i}`,
			price: Math.floor(Math.random() * (max - min + 1) + min)
		})
	}

	return result
}

describe('theme feature', () => {
	test('default use light theme', () => {
		const { container } = render(<Table />)

		const table = container.firstChild.getElementsByTagName('table')[0]

		//#f5f5f5 is equal to rgb(245, 245, 245)
		expect(table.style.backgroundColor).toBe('rgb(245, 245, 245)')
	})

	test('support light and dark themes', () => {
		const { container, rerender } = render(<Table theme="light" />)

		const table = container.firstChild.getElementsByTagName('table')[0]

		//#f5f5f5 is equal to rgb(245, 245, 245)
		expect(table.style.backgroundColor).toBe('rgb(245, 245, 245)')

		rerender(<Table theme="dark" />)

		//#191919 is equal to rgb(25, 25, 25)
		expect(table.style.backgroundColor).toBe('rgb(25, 25, 25)')
	})

	test('support custom theme', () => {
		const bgColor = 'rgb(255, 215, 0)'
		const customTheme = {
			backgroundColor: bgColor
		}

		const { container } = render(<Table theme={customTheme} />)

		const table = container.firstChild.getElementsByTagName('table')[0]

		expect(table.style.backgroundColor).toBe(bgColor)
	})
})

describe('pagnation', () => {
	test('support pagnation', () => {
		const props = {
			columns: [
				{
					header: 'No.',
					accessor: 'id'
				},
				{
					header: 'Product Description',
					accessor: 'desc'
				},
				{
					header: 'Price',
					accessor: 'price'
				}
			],
			data: makeData(30),
			pageSize: 10
		}

		const { getByText, container } = render(<Table {...props} />)

		const goToFirstPage = getByText('<<'),
			previousPage = getByText('<'),
			nextPage = getByText('>'),
			goToLastPage = getByText('>>'),
			indication = getByText('1 of 3')

		expect(goToFirstPage).toBeInTheDocument()
		expect(previousPage).toBeInTheDocument()
		expect(nextPage).toBeInTheDocument()
		expect(goToLastPage).toBeInTheDocument()
		expect(indication).toBeInTheDocument()

		//click test
		fireEvent.click(nextPage)
		let expectFirstRowData = props.data[10]

		const firstRowCells = container.firstChild
			.getElementsByTagName('tbody')[0]
			.getElementsByTagName('tr')[0]
			.getElementsByTagName('td')
		expect(
			_getByText(firstRowCells[0], new RegExp(expectFirstRowData.id))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[1], new RegExp(expectFirstRowData.desc))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[2], new RegExp(expectFirstRowData.price))
		).toBeInTheDocument()
		expect(getByText('2 of 3')).toBeInTheDocument()

		fireEvent.click(goToLastPage)
		expectFirstRowData = props.data[20]

		expect(
			_getByText(firstRowCells[0], new RegExp(expectFirstRowData.id))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[1], new RegExp(expectFirstRowData.desc))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[2], new RegExp(expectFirstRowData.price))
		).toBeInTheDocument()
		expect(getByText('3 of 3')).toBeInTheDocument()

		fireEvent.click(previousPage)
		expectFirstRowData = props.data[10]

		expect(
			_getByText(firstRowCells[0], new RegExp(expectFirstRowData.id))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[1], new RegExp(expectFirstRowData.desc))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[2], new RegExp(expectFirstRowData.price))
		).toBeInTheDocument()
		expect(getByText('2 of 3')).toBeInTheDocument()

		fireEvent.click(goToFirstPage)
		expectFirstRowData = props.data[0]

		expect(
			_getByText(firstRowCells[0], new RegExp(expectFirstRowData.id))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[1], new RegExp(expectFirstRowData.desc))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[2], new RegExp(expectFirstRowData.price))
		).toBeInTheDocument()
		expect(getByText('1 of 3')).toBeInTheDocument()
	})

	test('support custom pagnation', () => {
		const props = {
			columns: [
				{
					header: 'No.',
					accessor: 'id'
				},
				{
					header: 'Product Description',
					accessor: 'desc'
				},
				{
					header: 'Price',
					accessor: 'price'
				}
			],
			data: makeData(30),
			pageSize: 10
		}

		const mockPagnation = jest
			.fn()
			.mockReturnValue(<div>mockPagnation</div>)

		const { getByText } = render(
			<Table {...props} renderPagination={mockPagnation} />
		)

		expect(getByText('mockPagnation')).toBeInTheDocument()
		const receivedProps = mockPagnation.mock.calls[0][0]
		expect(typeof receivedProps).toBe('object')

		expect(receivedProps).toHaveProperty('gotoFirstPage')
		expect(typeof receivedProps.gotoFirstPage).toBe('function')

		expect(receivedProps).toHaveProperty('previousPage')
		expect(typeof receivedProps.previousPage).toBe('function')

		expect(receivedProps).toHaveProperty('nextPage')
		expect(typeof receivedProps.nextPage).toBe('function')

		expect(receivedProps).toHaveProperty('gotoLastPage')
		expect(typeof receivedProps.gotoLastPage).toBe('function')

		expect(receivedProps).toHaveProperty('gotoPage')
		expect(typeof receivedProps.gotoPage).toBe('function')

		expect(receivedProps).toHaveProperty('isFirstPage', true)
		expect(receivedProps).toHaveProperty('isLastPage', false)
		expect(receivedProps).toHaveProperty('currentPage', 1)
		expect(receivedProps).toHaveProperty('totalPages', 3)
	})

	test('disable pagnation', () => {
		const props = {
			columns: [
				{
					header: 'No.',
					accessor: 'id'
				},
				{
					header: 'Product Description',
					accessor: 'desc'
				},
				{
					header: 'Price',
					accessor: 'price'
				}
			],
			data: makeData(30),
			pageSize: 10,
			showPagnation: false
		}

		const { queryByText } = render(<Table {...props} />)

		const goToFirstPage = queryByText('<<'),
			previousPage = queryByText('<'),
			nextPage = queryByText('>'),
			goToLastPage = queryByText('>>'),
			indication = queryByText('1 of 3')

		expect(goToFirstPage).not.toBeInTheDocument()
		expect(previousPage).not.toBeInTheDocument()
		expect(nextPage).not.toBeInTheDocument()
		expect(goToLastPage).not.toBeInTheDocument()
		expect(indication).not.toBeInTheDocument()
	})
})

describe('sorting', () => {
	test('click header to sort', () => {
		const props = {
			columns: [
				{
					header: 'No.',
					accessor: 'id'
				},
				{
					header: 'Product Description',
					accessor: 'desc'
				},
				{
					header: 'Price',
					accessor: 'price',
					sorting: (a, b) => a - b
				}
			],
			data: makeData(25),
			showPagnation: true,
			pageSize: 10
		}

		const { container, getByText } = render(<Table {...props} />)

		//click to sort (aesc)
		fireEvent.click(getByText(/Price/))

		let tmpData = Array.from(props.data)
		tmpData.sort((a, b) => {
			return a.price - b.price
		})

		let firstRowData = tmpData[0]

		const firstRowCells = container.firstChild
			.getElementsByTagName('tbody')[0]
			.getElementsByTagName('tr')[0]
			.getElementsByTagName('td')
		expect(
			_getByText(firstRowCells[0], new RegExp(firstRowData.id))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[1], new RegExp(firstRowData.desc))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[2], new RegExp(firstRowData.price))
		).toBeInTheDocument()

		//click again to sort (desc)
		fireEvent.click(getByText(/Price/))

		tmpData = Array.from(props.data)
		tmpData.sort((a, b) => {
			return b.price - a.price
		})

		firstRowData = tmpData[0]
		expect(
			_getByText(firstRowCells[0], new RegExp(firstRowData.id))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[1], new RegExp(firstRowData.desc))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[2], new RegExp(firstRowData.price))
		).toBeInTheDocument()

		//click again to cancel sort
		fireEvent.click(getByText(/Price/))

		firstRowData = props.data[0]
		expect(
			_getByText(firstRowCells[0], new RegExp(firstRowData.id))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[1], new RegExp(firstRowData.desc))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[2], new RegExp(firstRowData.price))
		).toBeInTheDocument()
	})

	test('disable sorting', () => {
		const props = {
			columns: [
				{
					header: 'No.',
					accessor: 'id'
				},
				{
					header: 'Product Description',
					accessor: 'desc'
				},
				{
					header: 'Price',
					accessor: 'price',
					disableSorting: true,
					sorting: (a, b) => a - b
				}
			],
			data: makeData(25),
			showPagnation: true,
			pageSize: 10
		}

		const { container, getByText } = render(<Table {...props} />)

		//click header should not do sorting
		fireEvent.click(getByText(/Price/))

		let tmpData = Array.from(props.data)
		tmpData.sort((a, b) => {
			return a.price - b.price
		})

		let firstRowData = tmpData[0]

		const firstRowCells = container.firstChild
			.getElementsByTagName('tbody')[0]
			.getElementsByTagName('tr')[0]
			.getElementsByTagName('td')

		//sorted first data should not exist
		expect(
			_queryByText(firstRowCells[0], new RegExp(firstRowData.id))
		).not.toBeInTheDocument()
		expect(
			_queryByText(firstRowCells[1], new RegExp(firstRowData.desc))
		).not.toBeInTheDocument()
		expect(
			_queryByText(firstRowCells[2], new RegExp(firstRowData.price))
		).not.toBeInTheDocument()

		//default first data should exist
		firstRowData = props.data[0]
		expect(
			_getByText(firstRowCells[0], new RegExp(firstRowData.id))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[1], new RegExp(firstRowData.desc))
		).toBeInTheDocument()
		expect(
			_getByText(firstRowCells[2], new RegExp(firstRowData.price))
		).toBeInTheDocument()
	})
})

test('support custom cell', () => {
	const mockCell = jest.fn().mockReturnValue(<div>mockCell</div>)
	const props = {
		columns: [
			{
				header: 'No.',
				accessor: 'id'
			},
			{
				header: 'Product Description',
				accessor: 'desc'
			},
			{
				header: 'Price',
				accessor: 'price',
				sorting: (a, b) => a - b
			}
		],
		data: makeData(3),
		pageSize: 10
	}

	const { getAllByText } = render(<Table {...props} renderCell={mockCell} />)
	expect(getAllByText(/mockCell/)[0]).toBeInTheDocument()

	const receivedProps = mockCell.mock.calls[0][0]
	expect(typeof receivedProps).toBe('object')
	
	expect(receivedProps).toHaveProperty('rowIndex', 0)
	expect(receivedProps).toHaveProperty('row', props.data[0])
	expect(receivedProps).toHaveProperty('columnId', 'id')
	expect(receivedProps).toHaveProperty('value', props.data[0].id)
})

test('support custom header cell', () => {
	const mockHeaderCell = jest.fn().mockReturnValue(<div>mockHeaderCell</div>)
	const props = {
		columns: [
			{
				header: 'No.',
				accessor: 'id'
			},
			{
				header: 'Product Description',
				accessor: 'desc'
			},
			{
				header: 'Price',
				accessor: 'price',
				sorting: (a, b) => a - b
			}
		],
		data: makeData(3),
		pageSize: 10
	}

	const { getAllByText } = render(<Table {...props} renderHeaderCell={mockHeaderCell} />)
	expect(getAllByText(/mockHeaderCell/)[0]).toBeInTheDocument()

	const receivedProps = mockHeaderCell.mock.calls[0][0]
	expect(typeof receivedProps).toBe('object')
	
	expect(receivedProps).toHaveProperty('header', props.columns[0].header)
	expect(receivedProps).toHaveProperty('isSortingHead', false)
	expect(receivedProps).toHaveProperty('sortOrder', null)
})
