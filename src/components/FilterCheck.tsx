import { FC } from "react";

type Props = {
  label: string;
  curr: boolean;
  setVal: (val: boolean) => void;
  className?: string;
};

const FilterCheck: FC<Props> = ({ label, curr, setVal, className }) => {
  return (
    <div className={className}>
      <p className="text-white font-medium text-md">{label}</p>
      <input type="checkbox" checked={curr} onChange={() => setVal(!curr)} />
    </div>
  );
};

export default FilterCheck;
