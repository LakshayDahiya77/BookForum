import { logout } from "./actions";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <div>
      <p>Hello {user.email}</p>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
