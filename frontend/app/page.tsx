import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>
        <Link href="/auth">AUTH</Link>
      </div>
      <div>
        <Link href="/table">TABLE</Link>
      </div>
      <div>
        <Link href="/kitchen">KITCHEN</Link>
      </div>
      <div>
        <Link href="/dashboard">DASHBOARD</Link>
      </div>
    </div>
  );
}
