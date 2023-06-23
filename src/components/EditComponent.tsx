import { ComponentType } from "@/models/Types";
import { Dispatch, SetStateAction } from "react";

interface EditComponentProps {
  selectedComponent: ComponentType | undefined;
  setSelectedComponent: Dispatch<SetStateAction<ComponentType | undefined>>;
  handleUpdateComponent(
    selectedComponent: ComponentType | undefined
  ): Promise<void>;
}

const EditComponent = ({
  selectedComponent,
  setSelectedComponent,
  handleUpdateComponent,
}: EditComponentProps) => {
  return (
    <div className="flex-1 h-full min-h-screen bg-gray-300 text-white p-10	o">
      <div className="flex">
        <label id="classNames" className="text-black mr-2">
          Classes
        </label>
        <input
          name="classNames"
          className="text-black"
          value={selectedComponent?.className}
          onChange={(e) =>
            setSelectedComponent(
              (prev) =>
                ({
                  ...prev,
                  className: e.target.value,
                } as ComponentType)
            )
          }
        />
      </div>
      <div className="flex">
        <label id="text" className="text-black mr-2">
          Text
        </label>
        <input
          name="text"
          className="text-black"
          value={selectedComponent?.data}
          onChange={(e) =>
            setSelectedComponent(
              (prev) =>
                ({
                  ...prev,
                  data: e.target.value,
                } as ComponentType)
            )
          }
        />
      </div>

      <button
        className="text-white p-2 bg-black mt-2"
        onClick={async (e) => await handleUpdateComponent(selectedComponent)}
      >
        Save the code
      </button>
    </div>
  );
};

export default EditComponent;
