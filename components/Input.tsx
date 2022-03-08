import { ChangeEvent, forwardRef, ForwardRefRenderFunction } from "react";

interface InputProps {
  setValue: (e) => void;
  name: string;
  labelName?: string;
  type: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement ,InputProps> = ({name, labelName, setValue, type}) => {
  return (
    <>
      {labelName && <label htmlFor={name}>{labelName}</label>}
      <input
        type={type}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
        }
      />
    </>
  );
}

export const Input = forwardRef(InputBase);
