import { ChangeEvent } from "react";

interface InputTestProps {
  name: string;
  labelName: string;
  type: string;
  setValue: (e) => void;
}

export function Input({ name, labelName, type, setValue }: InputTestProps) {
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
