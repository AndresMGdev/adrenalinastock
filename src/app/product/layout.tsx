import { MenuPhone } from "@/components/MenuProduct";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MenuPhone />
    </>
  );
}