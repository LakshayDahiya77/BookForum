"use client";

import { useState, useMemo } from "react";
import Form from "next/form";
import { updateAuthor, deleteAuthor } from "@/app/admin/authors/actions";
import { Button } from "@/components/buttons/simpleButton";
import { Edit2, Trash2, Search, X } from "lucide-react";

type AuthorRow = {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
};

type AuthorManagerProps = {
  initialAuthors: AuthorRow[];
};

export default function AuthorManager({ initialAuthors }: AuthorManagerProps) {
  const [search, setSearch] = useState("");
  const [editingAuthor, setEditingAuthor] = useState<AuthorRow | null>(null);

  const filteredAuthors = useMemo(() => {
    if (!search.trim()) return initialAuthors;
    const lowerSearch = search.toLowerCase();
    return initialAuthors.filter((a) => a.name.toLowerCase().includes(lowerSearch));
  }, [search, initialAuthors]);

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border w-full max-w-xl flex flex-col max-h-200 overflow-hidden">
      <div className="p-8 pb-4 shrink-0">
        <h2 className="text-2xl font-bold text-text-primary mb-6 border-b border-border pb-4">
          All Authors
        </h2>
        <div className="relative mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            className="w-full bg-background border border-border rounded-md py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none"
            placeholder="Search authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-8 pb-8 overflow-y-auto flex-1">
        {filteredAuthors.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {filteredAuthors.map((author) => (
              <li
                key={author.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg bg-background hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {author.photoUrl ? (
                    <img
                      src={author.photoUrl}
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted text-xs shrink-0">
                      N/A
                    </div>
                  )}
                  <span className="text-sm font-semibold text-text-primary truncate">
                    {author.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => setEditingAuthor(author)}
                    variant="ghost"
                    size="sm"
                    className="p-2 h-auto text-text-muted hover:text-accent border border-transparent hover:border-accent/20"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-muted text-center py-4 italic text-sm">
            {initialAuthors.length === 0
              ? "No authors created yet."
              : "No authors matched your search."}
          </p>
        )}
      </div>

      {editingAuthor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface shrink-0">
              <h3 className="text-xl font-bold text-text-primary">Edit Author</h3>
              <button
                onClick={() => setEditingAuthor(null)}
                className="text-text-muted hover:text-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <Form action={updateAuthor} className="flex flex-col gap-5">
                <input type="hidden" name="id" value={editingAuthor.id} />

                <div className="flex items-start gap-4">
                  {editingAuthor.photoUrl ? (
                    <img
                      src={editingAuthor.photoUrl}
                      alt={editingAuthor.name}
                      className="w-16 h-16 rounded-full object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted text-xs shrink-0">
                      N/A
                    </div>
                  )}
                  <div className="flex-1 flex flex-col gap-3 min-w-0">
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingAuthor.name}
                        required
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">Bio</label>
                      <textarea
                        name="bio"
                        rows={3}
                        defaultValue={editingAuthor.bio || ""}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none resize-y"
                        placeholder="Short biography"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Update Photo (Optional)
                  </label>
                  <input
                    type="file"
                    name="photoFile"
                    accept="image/*"
                    className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs text-text-muted file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-accent file:text-background hover:file:bg-accent-hover cursor-pointer"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                  <Form action={deleteAuthor}>
                    <input type="hidden" name="id" value={editingAuthor.id} />
                    <Button
                      type="submit"
                      variant="danger"
                      onClick={(e) => {
                        if (!confirm("Are you sure you want to delete this author?")) {
                          e.preventDefault();
                        } else {
                          setEditingAuthor(null);
                        }
                      }}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </Form>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditingAuthor(null)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={() => setTimeout(() => setEditingAuthor(null), 50)}
                    className="px-6 py-2 text-xs font-bold uppercase tracking-widest"
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
