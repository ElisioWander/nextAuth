import { ChangeEvent, forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface InputProps {
  setValue: (e) => void;
  name: string;
  labelName?: string;
  type: string;
  error: FieldError
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement ,InputProps> = ({name, labelName, setValue, type, error}) => {
  return (
    <>
      <label htmlFor={name}>{labelName}</label>
      <input
        type={type}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
      />
    </>
  );
}

export const Input = forwardRef(InputBase);
