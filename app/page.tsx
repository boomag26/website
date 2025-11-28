// app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  // Página raiz "/" redireciona para "/pt"
  redirect("/pt");
}
