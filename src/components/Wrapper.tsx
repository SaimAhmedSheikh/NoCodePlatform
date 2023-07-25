import React from "react";

type WrapperProps = {
  onClick: React.MouseEventHandler;
  selected: boolean
} & React.PropsWithChildren;

const Wrapper = ({ children, onClick, selected }: WrapperProps) => {
  return (
    <div
      className="border border-transparent hover:border-red-500"
      onClick={onClick}
      style={{ borderWidth: selected ? '2px' : '1px' }}
    >
      {children}
    </div>
  );
};

export default Wrapper;
