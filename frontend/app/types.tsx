export interface RequiredOptionsType {
  title: string;
  choices: {
    name: string;
    price: number;
  }[];
}

export interface AdditionalOptionsType {
  name: string;
  price: number;
}

export interface MenuItemType {
  _id: string;
  name: string;
  description: string;
  price: number;
  requiredOptions: RequiredOptionsType[];
  additionalOptions: AdditionalOptionsType[];
}

export interface MenuType {
  name: string;
  data: MenuItemType[];
}

export interface OrderType {
  name: string;
  price: number;
  quantity: number;
  requiredOptions: string[];
  additionalOptions: string[];
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
  name: string | null;
  phoneNumber: string | null;
}
