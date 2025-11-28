// app/page.tsx
import HomeLang from "./[lang]/page";

export default function Root() {
  return <HomeLang params={{ lang: "pt" }} />;
}
