import DeckPageClient from "./components/DeckPageClient";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DeckPageClient id={id} />;
}
