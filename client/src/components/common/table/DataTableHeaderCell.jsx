import React from "react"

const propsAreEqual = (prev, next) => JSON.stringify(prev.sort) === JSON.stringify(next.sort)

export default React.memo(function DataTableHeaderCell(props) { return props.children }, propsAreEqual)