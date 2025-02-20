"use client";

const Order = ({
  menu,
  tableName,
  setInventory,
}: {
  menu: Array<object>;
  tableName: string;
  setInventory: Function;
}) => {
  return (
    <div>
      <div>ORDER</div>
      <button
        className="bg-red-500"
        onClick={() => {
          setInventory(false);
        }}
      >
        BACK
      </button>
    </div>
  );
};

export default Order;
