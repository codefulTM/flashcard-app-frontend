import FlashcardReviewer from "../components/FlashcardReviewer";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FlashcardReviewer deckId={id} />;
}
