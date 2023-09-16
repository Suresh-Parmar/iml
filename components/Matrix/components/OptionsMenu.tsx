import { ActionIcon, Button, Checkbox, Menu, Text } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconArrowsSort, IconSelector, IconSettings, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { Column, Header, Table } from "@tanstack/react-table";
import { MatrixRowType } from "..";
import { Filter } from "./Filter";

export const OptionsMenu = ({ table, header, column }: { table: Table<MatrixRowType>, header: Header<MatrixRowType, unknown>, column: Column<MatrixRowType, unknown> }) => {
  return (
    <Menu shadow="md" width={230}>
      <Menu.Target>
        <ActionIcon ml={"xl"}>
          <IconAdjustmentsHorizontal size="1.5rem" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown w={"100%"} py={"xs"}>
        <Menu.Label>Visibility</Menu.Label>
        <Menu.Item py={"xs"} w={"100%"}>
          <Checkbox
            checked={column.getIsVisible()}
            onChange={column.getToggleVisibilityHandler()}
            label={column.getIsVisible() ? "Visible" : "Hidden"}
          />
        </Menu.Item>
        <Menu.Label>Sorting</Menu.Label>
        <Menu.Item
          py={"xs"}
          w={"100%"}
          icon={
            {
              asc: <IconSortAscending size={"1.5rem"} />,
              desc: <IconSortDescending size={"1.5rem"} />,
            }[header.column.getIsSorted() as string]
            ?? <IconArrowsSort size={"1.5rem"} />
          }
          onClick={header.column.getToggleSortingHandler()}
        >
          {{
            asc: 'Ascending',
            desc: 'Descending',
          }[header.column.getIsSorted() as string] ?? "Default"}
        </Menu.Item>
        <Menu.Item>
          {header.column.getCanFilter() ? (
            <div>
              <Filter column={header.column} table={table} />
            </div>
          ) : null}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}