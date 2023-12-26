import React from "react"

const propsAreEqual = (prev, next) => prev.value === next.value

export default React.memo(function DataTableCell(props) { return props.children }, propsAreEqual)