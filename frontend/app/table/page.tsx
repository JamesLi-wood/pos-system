import Link from "next/link";
import ValidateToken from "../component/validateToken";

const Table = () => {
  return (
    <ValidateToken>
      <div>TABLE PAGE</div>
      <Link className="bg-red-500" href={"/"}>
        BACK
      </Link>
    </ValidateToken>
  );
};

export default Table;
