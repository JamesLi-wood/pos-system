import Link from "next/link";
import ValidateToken from "../components/validateToken";

const Kitchen = () => {
  return (
    <ValidateToken>
      <div>KITCHEN PAGE</div>
      <Link className="bg-red-500" href={"/"}>
        BACK
      </Link>
    </ValidateToken>
  );
};

export default Kitchen;
