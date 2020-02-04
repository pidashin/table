import React from 'react'
import Table from '../src/table'

export default {
	title: 'Table'
}

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
			disableSorting: false,
			sorting: (a, b) => a - b
		}
	],
	data: makeData(25),
	showPagnation: true,
	pageSize: 10
}

export const light = () => <Table {...props} theme="light" />

export const dark = () => <Table {...props} theme="dark" />

export const customTheme = () => {
	const theme = {
		backgroundColor: '#E74C3C',
		borderColor: '#FFD700',
		color: '#FFD700'
	}

	return <Table {...props} theme={theme} />
}

export const disablePagnation = () => (
	<Table {...props} showPagnation={false} pageSize={undefined} />
)

const CustomCell = ({ columnId, value }) => {
	const tmpVal = columnId === 'price' ? `$ ${value}` : value
	return <div style={{ padding: '10px 20px' }}>{tmpVal}</div>
}

export const customCell = () => <Table {...props} renderCell={CustomCell} />

const CustomHeader = ({ header }) => {
	return <div style={{ padding: '10px 20px', backgroundColor: 'aqua' }}>{header}</div>
}

export const customHeaderCell = () => (
	<Table {...props} renderHeaderCell={CustomHeader} />
)
