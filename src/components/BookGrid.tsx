import BookCard from "@/components/BookCard";

type BookWithRelations = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  likeCount: number;
  averageRating: number;
  authors: { id: string; name: string }[];
  categories: { id: string; name: string }[];
};

export default function BookGrid({ books }: { books: BookWithRelations[] }) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">No Books Found</h2>
        <p className="text-text-muted">Check back later for new additions.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} {...book} />
      ))}
    </div>
  );
}
