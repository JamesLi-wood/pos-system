import Link from "next/link";
import useValidateToken from "../hooks/useValidateToken";

const Dashboard = () => {
  useValidateToken();

  return (
    <div>
      <div>DASHBOARD PAGE</div>
      <Link className="bg-red-500" href={"/"}>
        BACK
      </Link>
    </div>
  );
};

export default Dashboard;
