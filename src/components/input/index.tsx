import { RegisterOptions, UseFormRegister } from "react-hook-form";

type Props = {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
};

export function Input({
  type,
  name,
  placeholder,
  register,
  error,
  rules,
}: Props) {
  return (
    <div>
      <input
        className="w-full border-2 rounded-md h-11 px-2"
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="my-1 text-red-500"> {error} </p>}
    </div>
  );
}
