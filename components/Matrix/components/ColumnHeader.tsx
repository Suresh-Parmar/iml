import { Flex, Paper, Title, rem, useMantineTheme, ActionIcon } from "@mantine/core";
import { Dispatch, FC, SetStateAction } from "react";
import { flexRender, Header, Column, ColumnResizeMode } from "@tanstack/react-table";
import { useDrag, useDrop } from "react-dnd";
import { IconEye, IconEyeOff, IconFilter, IconFilterOff, IconGripVertical } from "@tabler/icons-react";
import { MatrixRowType } from "..";
import { reOrderColumn } from "../utilities";
import { Filter } from "./Filter";

const ColumnHeader: FC<{
  columnResizeMode: ColumnResizeMode;
  header: Header<MatrixRowType, unknown>;
  table: any;
  showFilter: boolean;
  setShowFilter?: Dispatch<SetStateAction<boolean>>;
  hideFilterIcon?: boolean;
  hideVisibleIcon?: boolean;
}> = ({ header, table, showFilter, setShowFilter, hideFilterIcon, hideVisibleIcon }) => {
  const theme = useMantineTheme();
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;
  const [, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn: Column<MatrixRowType>) => {
      const newColumnOrder = reOrderColumn(draggedColumn.id, column.id, columnOrder);
      setColumnOrder(newColumnOrder);
    },
  });
  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: "column",
  });
  return (
    <th
      ref={dropRef}
      colSpan={header.colSpan}
      key={header.id}
      style={{
        width: header.getSize(),
        height: "100%",
        opacity: isDragging ? 0.5 : 1,
        whiteSpace: "nowrap",
        padding: 0,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      }}
    >
      {header.isPlaceholder ? null : (
        <Flex
          ref={previewRef}
          sx={(theme) => ({
            border: `${rem(1)} solid ${theme.colorScheme === "dark" ? "#373a40" : "#dee2e6"}`,
          })}
          miw={"100%"}
          h={"100%"}
          w={"100%"}
          direction={"column"}
          wrap={"nowrap"}
          justify={"stretch"}
          align={"stretch"}
        >
          <Paper withBorder w={"100%"} h={"100%"} px={0} radius={0}>
            <Flex direction={"row"} justify={"space-between"} align={"center"}>
              <Title order={5} my={"xs"} mx={"sm"} w={"100%"}>
                {/* {
                    header.id === "actions"
                      ? flexRender(header.column.columnDef.header, header.getContext()) */}
                <Flex direction={"column"} justify={"center"} align={"center"} w={"100%"}>
                  {header.column.getCanFilter() && showFilter ? <Filter column={header.column} table={table} /> : null}
                  <Flex w={"100%"} direction={"row"} justify={"space-between"} align={"center"}>
                    <Flex
                      direction={"row"}
                      justify={"center"}
                      align={"center"}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <ActionIcon ref={dragRef} mr={"xs"}>
                        <IconGripVertical size="1.5rem" />
                      </ActionIcon>
                      <Title order={5}>{flexRender(header.column.columnDef.header, header.getContext())}</Title>
                    </Flex>
                    <Flex ml={"xl"} direction={"row"} justify={"center"} align={"center"}>
                      {/* <ActionIcon
                        ml={'xs'}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {{
                          asc: <IconSortAscending size={'1.5rem'} />,
                          desc: <IconSortDescending size={'1.5rem'} />,
                        }[header.column.getIsSorted() as string] ?? (
                          <IconArrowsSort size={'1.5rem'} />
                        )}
                      </ActionIcon> */}
                      {!hideVisibleIcon ? (
                        <ActionIcon ml={"xs"} onClick={column.getToggleVisibilityHandler()}>
                          {column.getIsVisible() ? <IconEyeOff size={"1.5rem"} /> : <IconEye size={"1.5rem"} />}
                        </ActionIcon>
                      ) : null}
                      {!hideFilterIcon ? (
                        <ActionIcon ml={"xs"} onClick={() => setShowFilter?.(!showFilter)}>
                          {showFilter ? <IconFilterOff size={"1.5rem"} /> : <IconFilter size={"1.5rem"} />}
                        </ActionIcon>
                      ) : null}
                      {/* <ActionIcon
                              {...{
                                onMouseDown: header.getResizeHandler(),
                                onTouchStart: header.getResizeHandler(),
                                style: {
                                  transform:
                                    columnResizeMode === 'onEnd' &&
                                      header.column.getIsResizing()
                                      ? `translateX(${table.getState().columnSizingInfo.deltaOffset
                                      }px)`
                                      : '',
                                },
                              }}
                            >
                              <IconArrowsHorizontal size="1.5rem" />
                            </ActionIcon> */}
                    </Flex>
                  </Flex>
                </Flex>
                {/* } */}
              </Title>
            </Flex>
          </Paper>
        </Flex>
      )}
    </th>
  );
};

export default ColumnHeader;
