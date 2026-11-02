import { AuthGuard } from "@/components/auth-guard";
import { ProfilePage } from "@/components/auth-pages";

export default function ProfileRoute() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}
