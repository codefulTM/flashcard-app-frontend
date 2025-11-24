import ProtectedRoute from "../components/ProtectedRoute";

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
