import { FC } from "react";

type Props = {
  label: string;
  min: number;
  max: number;
  currMin: string;
  currMax: string;
  setMinFilterValue: (value: string) => void;
  setMaxFilterValue: (value: string) => void;
};

const FilterInput: FC<Props> = ({
  label,
  min,
  max,
  currMin,
  currMax,
  setMinFilterValue,
  setMaxFilterValue,
}) => {
  // useEffect(() => {
  //   const parsedMinVal = parseFloat(minValue);
  //   if (
  //     !isNaN(parsedMinVal) &&
  //     parsedMinVal >= min &&
  //     parsedMinVal <= max &&
  //     parsedMinVal != currMin
  //   ) {
  //     setMinFilterValue(parsedMinVal);
  //   }
  //   const parsedMaxVal = parseFloat(maxValue);
  //   if (
  //     !isNaN(parsedMaxVal) &&
  //     parsedMaxVal >= min &&
  //     parsedMaxVal <= max &&
  //     parsedMaxVal != currMax
  //   ) {
  //     setMaxFilterValue(parsedMaxVal);
  //   }
  // }, [
  //   minValue,
  //   maxValue,
  //   min,
  //   max,
  //   setMinFilterValue,
  //   setMaxFilterValue,
  //   currMin,
  //   currMax,
  // ]);

  return (
    <div className="box-border">
      <p className="text-white font-medium text-md">{label}</p>
      <div className="flex w-full items-center gap-2">
        <p className="text-white flex-0 text-sm">Min.</p>
        <input
          className="text-white focus:outline-0 mt-1 border-b-white border-b-2 appearance-none flex-1 min-w-0 text-sm"
          value={currMin}
          min={min}
          max={max}
          onChange={(e) => setMinFilterValue(e.target.value)}
        />
        <p className="text-white flex-0 ml-4 text-sm">Max.</p>
        <input
          className="text-white focus:outline-0 mt-1 border-b-white border-b-2 appearance-none flex-1 min-w-0 text-sm box-border"
          min={min}
          max={max}
          value={currMax}
          onChange={(e) => setMaxFilterValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterInput;
