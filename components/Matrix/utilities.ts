import { compareItems, rankItem } from "@tanstack/match-sorter-utils"
import { ColumnOrderState, FilterFn, SortingFn, sortingFns } from "@tanstack/react-table"

const reOrderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  )
  return [...columnOrder]
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })
  return itemRank.passed
}
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export { reOrderColumn, fuzzyFilter, fuzzySort };