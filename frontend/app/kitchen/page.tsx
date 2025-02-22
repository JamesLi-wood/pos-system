import Link from "next/link";
import ValidateToken from "../components/validateToken";

const Kitchen = () => {
  return (
    <div>
      <ValidateToken />
      <div>KITCHEN PAGE</div>
      <Link className="bg-red-500" href={"/"}>
        BACK
      </Link>
    </div>
  );
};

export default Kitchen;
