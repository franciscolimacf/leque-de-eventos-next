"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// O routerLinkActive com ariaCurrentWhenActive. Saber o endereço atual é
// coisa do navegador: por isso ele também é Client Component.
export default function LinkDoMenu({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const atual = usePathname() === href;
  return (
    <Link href={href} aria-current={atual ? "page" : undefined}>
      {children}
    </Link>
  );
}
