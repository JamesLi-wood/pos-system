import { useState, useEffect } from "react";
import { MenuType } from "../types";

export default function useFetchRestaurantData() {
  const [menu, setMenu] = useState<MenuType[]>([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetchData = async () => {
    setLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/order/menu`
    );

    if (response.ok) {
      const data = await response.json();
      setMenu(data.menu);
      setTables(data.tables);
    }

    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      await refetchData();
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { menu, tables, loading, refetchData };
}
