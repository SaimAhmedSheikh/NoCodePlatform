const tabs = ["General", "Custom"];

const Tabs = () => {
  return (
    <div className={`flex `}>
      {tabs.map((tab, index) => {
        return <div key={`${tab}-${index}`}>{tab}</div>;
      })}
    </div>
  );
};

export default Tabs;
