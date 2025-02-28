export interface SingularOptionsType {
  title: string;
  choices: string[];
}

export interface MultipleOptionsType {
  title: string;
  choices: {
    name: string;
    price: number;
  }[];
}

export interface MenuItemType {
  _id: string;
  name: string;
  description: string;
  price: number;
  singularOptions: SingularOptionsType[];
  multipleOptions: MultipleOptionsType;
}

export interface MenuType {
  name: string;
  data: MenuItemType[];
}

export interface OrderType {
  name: string;
  price: number;
  quantity: number;
  singularOptions: string[];
  multipleOptions: string[];
  specialRequests: string;
}

export interface TableContextType {
  menu: MenuType[];
  tableName: string;
  setInventory: Function;
  removeSlidedownContent: () => void;
  currentOrder: OrderType[];
  setCurrentOrder: React.Dispatch<React.SetStateAction<OrderType[]>>;
  currentPrice: number;
  setCurrentPrice: React.Dispatch<React.SetStateAction<number>>;
}

export interface TicketType {
  dateCreated: number;
  orderID: number;
  ticket: OrderType[];
}
