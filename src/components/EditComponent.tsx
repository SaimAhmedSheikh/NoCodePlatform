import { ComponentType } from "@/models/Types";
import { Dispatch, SetStateAction } from "react";
import Tabs from "./Tabs";
import { Button, Label, TextInput } from "flowbite-react";
import ColorPicker from "./ColorPicker";

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

  const update = (key: string, value: any) => {
    const newComp: ComponentType = {
      ...selectedComponent,
      [key]: value,
    } as ComponentType
    setSelectedComponent(newComp)
    handleUpdateComponent(newComp)
  }
  return (
    <div className="w-1/4 h-full min-h-screen bg-gray-100 p-4">
      {/* <Tabs /> */}
      <h2 className="font-bold text-lg mb-3">Properties</h2>

      <h3 className="font-bold text-base mb-2">Text</h3>

      <form className="flex max-w-md flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="value"
              value="Value"
              className="text-gray-600"
            />
          </div>
          <TextInput
            id="value"
            placeholder="Enter here"
            required
            type="text"
            value={selectedComponent?.data}
            onChange={(e) =>{
              update('data', e.target.value)
            }}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="textColor"
              value="Color"
              className="text-gray-600"
            />
          </div>
          <ColorPicker 
            value={selectedComponent?.props?.color}
            onPickColor={(color) => {
              update('props', {
                color: color.hex
              })
            }
          }
          />
        </div>
      </form>

    </div>
  );
};

export default EditComponent;
