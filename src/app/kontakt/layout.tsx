import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Kontakt",
  path: "/kontakt",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
