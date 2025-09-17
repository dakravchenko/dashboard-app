import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
        <h1>Unauthorized</h1>
        <p>You do not have permission to access this page.</p>
        <Link href="/dashboards" style={{ color: "#1976d2", textDecoration: "underline" }}>To main page</Link>
        </div>
    );
}