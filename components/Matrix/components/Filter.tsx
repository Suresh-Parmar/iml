import { Column, Table } from "@tanstack/react-table"
import { useEffect, useMemo } from "react"
import { DebouncedInput } from "./DebouncedInput"
import { IconFilterMinus, IconFilterPlus, IconListSearch } from "@tabler/icons-react"
import { Box, Flex } from "@mantine/core"
import React from "react"

export function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
  const columnObjectFromTable = useMemo(() => column, [column]);
  const tableObjectFromTable = useMemo(() => table, [table]);
  const firstValue = useMemo(() => tableObjectFromTable.getPreFilteredRowModel().flatRows[0]?.getValue(columnObjectFromTable.id), [columnObjectFromTable.id, tableObjectFromTable]);
  const columnFilterValue = columnObjectFromTable.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(columnObjectFromTable.getFacetedUniqueValues().keys()).sort(),
    [columnObjectFromTable, firstValue]
  )

  return typeof firstValue === 'number' ? (
    <Box px={0} mx={0} mb={"xs"} w={"100%"}>
      <Flex gap={"xs"} w={"100%"} direction={"row"} justify={"space-between"} align={"center"}>
        <DebouncedInput
          type="number"
          min={Number(columnObjectFromTable.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(columnObjectFromTable.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            columnObjectFromTable.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`${columnObjectFromTable.getFacetedMinMaxValues()?.[0]
            ? `(${columnObjectFromTable.getFacetedMinMaxValues()?.[0]})`
            : ''
            }`}
          icon={<IconFilterMinus size={"1.5rem"} />}
        />
        <DebouncedInput
          type="number"
          min={Number(columnObjectFromTable.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(columnObjectFromTable.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            columnObjectFromTable.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`${columnObjectFromTable.getFacetedMinMaxValues()?.[1]
            ? `(${columnObjectFromTable.getFacetedMinMaxValues()?.[1]})`
            : ''
            }`}
          icon={<IconFilterPlus size={"1.5rem"} />}
        />
      </Flex>
    </Box>
  ) : (
    <Box px={0} mx={0} mb={"xs"} w={"100%"}>
      <datalist id={columnObjectFromTable.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => columnObjectFromTable.setFilterValue(value)}
        placeholder={`Search (${columnObjectFromTable.getFacetedUniqueValues().size})`}
        icon={<IconListSearch size={"1.5rem"} />}
        list={columnObjectFromTable.id + 'list'}
      />
    </Box>
  )
}