import Link from "next/link";
import ValidateToken from "../component/validateToken";

const Dashboard = () => {
  return (
    <ValidateToken>
      <div>DASHBOARD PAGE</div>
      <Link className="bg-red-500" href={"/"}>
        BACK
      </Link>
    </ValidateToken>
  );
};

export default Dashboard;
