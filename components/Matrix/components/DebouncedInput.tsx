import { ActionIcon, Input, Tooltip } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function DebouncedInput({
  icon,
  placeholder,
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  icon: JSX.Element;
  placeholder: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange && onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      // {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      icon={icon}
      placeholder={placeholder}
      radius={"sm"}
      rightSection={
        <Tooltip label="Clear" position="top-end" withArrow>
          <ActionIcon
            onClick={() => {
              setValue("");
            }}
          >
            <IconX size="1rem" style={{ display: "block", opacity: 0.5 }} />
          </ActionIcon>
        </Tooltip>
      }
    />
    // <input  />
  );
}
