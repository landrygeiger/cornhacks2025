import {
  CelestialBodyFilterConfig,
  defaultFilterConfig,
  FilterForm,
} from "../hooks/useCelestialBodies";
import FilterInput from "./FilterInput";
import { updateProperty, validAndInRange } from "../utils/pure";

const parseForm = (form: FilterForm): CelestialBodyFilterConfig => ({
  minMass: parseInt(form.minMass),
  maxMass: parseInt(form.maxMass),
  minDistance: parseInt(form.minDistance),
  maxDistance: parseInt(form.maxDistance),
  minRadius: parseInt(form.minRadius),
  maxRadius: parseInt(form.maxRadius),
  showExoPlanets: form.showExoPlanets,
  showSolarSystem: form.showSolarSystem,
});

type Props = {
  setFilterForm: React.Dispatch<React.SetStateAction<FilterForm>>;
  filterForm: FilterForm;
  setFilterConfig: React.Dispatch<
    React.SetStateAction<CelestialBodyFilterConfig>
  >;
};

const CelestialBodyFilterMenu = ({
  setFilterConfig,
  setFilterForm,
  filterForm,
}: Props) => {
  const updateForm = updateProperty(setFilterForm);

  const isFormClean =
    validAndInRange(
      filterForm.minMass,
      defaultFilterConfig.minMass,
      defaultFilterConfig.maxMass
    ) &&
    validAndInRange(
      filterForm.maxMass,
      defaultFilterConfig.minMass,
      defaultFilterConfig.maxMass
    ) &&
    validAndInRange(
      filterForm.minRadius,
      defaultFilterConfig.minRadius,
      defaultFilterConfig.maxRadius
    ) &&
    validAndInRange(
      filterForm.maxRadius,
      defaultFilterConfig.minRadius,
      defaultFilterConfig.maxRadius
    ) &&
    validAndInRange(
      filterForm.minDistance,
      defaultFilterConfig.minDistance,
      defaultFilterConfig.maxDistance
    ) &&
    validAndInRange(
      filterForm.maxDistance,
      defaultFilterConfig.minDistance,
      defaultFilterConfig.maxDistance
    );

  return (
    <div className="fixed top-4 right-4 bg-gray-800 py-2 px-4 rounded-2xl shadow-md shadow-gray-950 z-50 w-72">
      <div className="flex flex-col gap-4 mb-2">
        <FilterInput
          label="Mass"
          min={defaultFilterConfig.minMass}
          max={defaultFilterConfig.maxMass}
          currMin={filterForm.minMass}
          currMax={filterForm.maxMass}
          setMaxFilterValue={updateForm("maxMass")}
          setMinFilterValue={updateForm("minMass")}
        />
        <FilterInput
          label="Radius"
          min={defaultFilterConfig.minRadius}
          max={defaultFilterConfig.maxRadius}
          currMin={filterForm.minRadius}
          currMax={filterForm.maxRadius}
          setMaxFilterValue={updateForm("maxRadius")}
          setMinFilterValue={updateForm("minRadius")}
        />
        <FilterInput
          label="Distance"
          min={defaultFilterConfig.minDistance}
          max={defaultFilterConfig.maxDistance}
          currMin={filterForm.minDistance}
          currMax={filterForm.maxDistance}
          setMaxFilterValue={updateForm("maxDistance")}
          setMinFilterValue={updateForm("minDistance")}
        />
        <div className="flex flex-row-reverse">
          {/* TODO add checkboxes */}
          <button
            onClick={() => {
              console.log("filters applied");
              return setFilterConfig(parseForm(filterForm));
            }}
            disabled={!isFormClean}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelestialBodyFilterMenu;
