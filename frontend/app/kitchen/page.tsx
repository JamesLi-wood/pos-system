"use client"
import Link from "next/link";
import useValidateToken from "../hooks/useValidateToken";

const Kitchen = () => {
  useValidateToken();

  return (
    <div>
      <div>KITCHEN PAGE</div>
      <Link className="bg-red-500" href={"/"}>
        BACK
      </Link>
    </div>
  );
};

export default Kitchen;
