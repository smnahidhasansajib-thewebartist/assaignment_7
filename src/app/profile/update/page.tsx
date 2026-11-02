import { AuthGuard } from "@/components/auth-guard";
import { UpdateProfilePage } from "@/components/auth-pages";

export default function UpdateProfileRoute() {
  return (
    <AuthGuard>
      <UpdateProfilePage />
    </AuthGuard>
  );
}
