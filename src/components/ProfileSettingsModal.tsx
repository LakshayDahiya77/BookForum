"use client";

import Form from "next/form";
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/buttons/simpleButton";
import { deleteAvatar, updateAvatar, updateProfileSettings } from "@/app/profile/actions";

type ProfileSettingsModalProps = {
  user: {
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
};

export default function ProfileSettingsModal({ user }: ProfileSettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-accent text-background shadow-md transition-colors hover:bg-accent-hover"
        aria-label="Edit profile settings"
        title="Edit profile settings"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-text-primary">Profile Settings</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-text-muted transition-colors hover:text-accent"
                aria-label="Close profile settings"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
              <section className="rounded-xl border border-border bg-background p-4 sm:p-5">
                <h3 className="mb-4 text-lg font-semibold text-text-primary">Profile Picture</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-surface shadow-sm">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-text-muted">
                          {(user.name || "U")[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-text-muted">Current profile image</p>
                  </div>

                  <div className="space-y-3">
                    <Form action={updateAvatar} className="space-y-2">
                      <input
                        type="file"
                        name="avatarFile"
                        accept="image/*"
                        required
                        className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-text-muted file:mr-2 file:rounded file:border-0 file:bg-accent file:px-2 file:py-1 file:text-background hover:file:bg-accent-hover"
                      />

                      <Button type="submit" variant="primary" size="sm">
                        Update Avatar
                      </Button>
                    </Form>

                    {user.avatarUrl && (
                      <Form action={deleteAvatar}>
                        <Button
                          type="submit"
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            if (!confirm("Remove your current profile picture?")) {
                              e.preventDefault();
                            }
                          }}
                          className="inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Avatar
                        </Button>
                      </Form>
                    )}

                    <p className="text-xs text-text-muted">Accepted: JPG, PNG, WEBP up to 5MB.</p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-border bg-background p-4 sm:p-5">
                <h3 className="mb-4 text-lg font-semibold text-text-primary">Account Details</h3>
                <Form action={updateProfileSettings} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="mb-1 block text-sm font-semibold text-text-primary">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={user.name || ""}
                        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="mb-1 block text-sm font-semibold text-text-primary">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={user.email}
                        required
                        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text-primary">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        autoComplete="current-password"
                        placeholder="Required to change password"
                        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text-primary">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        autoComplete="new-password"
                        placeholder="Leave blank to keep"
                        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-border pt-4">
                    <Button type="submit" variant="primary" size="sm" className="font-semibold">
                      Save Profile Settings
                    </Button>
                  </div>
                </Form>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
