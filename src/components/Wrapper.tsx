import React from "react";

type WrapperProps = {
  onClick: React.MouseEventHandler;
} & React.PropsWithChildren;

const Wrapper = ({ children, onClick }: WrapperProps) => {
  return (
    <div
      className="border border-transparent hover:border-red-500"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Wrapper;
