import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  return (
    <div>
      <p>Hello {user.email}</p>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
