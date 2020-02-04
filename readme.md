# Features

-   theme
-   pagination
-   sorting
-   custom cell

# Basic Usage

```javascript
import ReactDOM from 'react-dom'

const columns = [
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
	}
]

const data = [
	{id: 1, desc: 'sample product 1', price: 100},
	{id: 2, desc: 'sample product 2', price: 200},
	{id: 3, desc: 'sample product 3', price: 300},
]

ReactDom.render(<Table columns={columns} data={data}>, document.getElementById('root'))
```

# table property

| property         | description                                                                                                     | type            | required |
| ---------------- | --------------------------------------------------------------------------------------------------------------- | --------------- | -------- |
| columns          | define columns inside each row. see Column.                                                                     | array of Column | yes      |
| data             | data to display in the table                                                                                    | array of Object | yes      |
| pageSize         | define how many rows to display in each page. Default is equal to data's length. (display all data in one page) | number          |          |
| theme            | define theme to use in table. Default is `light`, see Theme                                                     | string or Theme |          |
| showPagnation    | define whether to display pagnation or not. Default is `true`                                                   | bool            |          |
| renderPagination | use for custom pagination. see renderPagnation                                                                  | react component |          |
| renderHeaderCell | use for custom header. see renderHeaderCell                                                                     | react component |          |
| renderCell       | use for custom cell. see renderCell                                                                             | react component |          |

# Column

The following properties are supported on Column object.

-   `header: String | Number` 
    - Required 
    - This string/number will be used to display as Header
-   `accessor: String`
    -   Required
    -   This string is used to build the data model for your column
    -   The column's value will be looked up on the original row via that key. Ex: if your accessor is `price` then its value woud be read from `row['price']`.
-   `disableSorting: Bool`
    -   Optional
    -   Defined whether to disable sort or not. Default is `false`
    -   If set to `true`, the sort function will be disable even you pass the sorting function to column.
-   `sorting: String | Function`
    -   Optional
    -   Define the sorting logic when sortBy this column
    -   String options: `basic`. Other string will be invalid. Basic will use `alphanumeric` sorting.
    -   If a `function` is passed, it'll receive two arguments, and you should determin the order by return 0, 1 or -1. Ex: `(a, b) => a - b` where a is column value in rowA and b is column value in rowB.
    -   Only consider sorting using `aesc` sort.
    -   Column with sorting defined will be clickable, click to sort `aesc`, and for second click to sort `desc`. For third click will cancel sorting.

# Theme

Theme following properties are supported on Theme object.

-   `backgroundColor: String`
    -   Optional
    -   Define the background color of the table.
    -   Default is `#f5f5f5`
    -   Support both hex code and rgb code
-   `borderColor: String`
    -   Optional
    -   Define the corder color of the table
    -   Default is `#191919`
    -   Support both hex code and rgb code
-   `color: String`
    -   Optional
    -   Define the text color of the table
    -   Default is `#191919`
    -   Support both hex code and rgb code

# renderPagination

This property is for custom pagination.

-   Optional
-   The pagination component will receive properties from table as below:

    -   `gotoFirstPage: Function`
        -   This function is used to navigate to first page.
    -   `previousPage: Function`
        -   This function is used to navigate to previous page.
    -   `nextPage: Function`
        -   This function is used to navigate to next page.
    -   `gotoLastPage: Function`
        -   This function is used to navigate to last page.
    -   `gotoPage: Function`
        -   Pass pageIdx when call this function to navigate to that page. Ex: `gotoPage(3)` will go to page 3.
    -   `isFirstPage: Bool`
        -   Indicate whether current page is first page or not.
    -   `isLastPage: Bool`
        -   Indicate whether current page is last page or not.
    -   `currentPage: Number`
        -   Indicate current page number
    -   `totalPages: Number`
        -   Indicate total page number

-   Example

```javascript
const Pagination = ({
	gotoFirstPage,
	previousPage,
	nextPage,
	gotoLastPage,
	gotoPage,
	isFirstPage,
	isLastPage,
	currentPage,
	totalPages
}) => {
	//implement custom pagination
}

//Then pass it to table
<Table renderPagination={Pagination} />
```

# renderHeaderCell

This property is for custom header cell.

-   Optional
-   The header cell component will receive properties from table as below:
    -   `header: String|Number`
        -   The same as your `header` property in `Column` object.
    -   `isSortingHead: Bool`
        -   Indicate whether currently is sortBy this header or not.
    -   `sortOrder: null| "aesc" | "desc"`
        -   Indicate which sortOrder is currently being used.
        -   You could use this property to render different arrow for aesc and desc. Ex: `▲ ▼`
-   Example

```javascript
const HeaderCell = ({ header, isSortingHead, sortOrder }) => {
	//implement custom header cell
}

//Then pass it to table
<Table renderHeaderCell={HeaderCell} />
```

# renderCell

This property is for custom table cell

-   Optional
-   The cell component will receive properties from table as below:
    -   `row: Object`
        -   The same as the object in `data` you pass to table.
    -   `rowIndex: Number`
        -   Indicate row index. Starts from 0.
    -   `columnId: String`
        -   The same as `accessory` in `Column` object.
    -   `value: Any`
        -   Equals to `row[columnId]`. Indicate the value to used for this cell.
-   Example

```javascript
const Cell = ({ row, rowIndex, columnId, value }) => {
	//implement custom cell
}

//Then pass it to table
<Table renderCell={Cell} />
```
