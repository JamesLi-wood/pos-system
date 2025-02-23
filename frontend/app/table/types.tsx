export interface SingularOptionsData {
  title: string;
  choices: Array<string>;
}

export interface MultipleOptionsData {
  title: string;
  choices: {
    name: string;
    price: number;
  }[];
}

export interface MenuItemData {
  _id: string;
  name: string;
  price: number;
  description: string;
  singularOptions: SingularOptionsData[];
  multipleOptions: MultipleOptionsData;
}

export interface MenuData {
  name: string;
  data: MenuItemData[];
}

export interface OrderItem {
  id: number;
  name: string;
}

export interface TableContextType {
  menu: MenuData[];
  tableName: string;
  setInventory: Function;
  removeSlidedownContent: () => void;
  currentOrder: OrderItem[];
  setCurrentOrder: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  currentPrice: number;
  setCurrentPrice: React.Dispatch<React.SetStateAction<number>>;
}
