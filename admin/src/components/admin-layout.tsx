"use client";

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import {
  AlertCircle,
  BarChart3,
  Package,
  Store,
  Gift
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useLanguage } from "./language-provider";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationKeys = [
  {
    nameKey: "dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    nameKey: "products",
    href: "/admin/products",
    icon: Package,
  },
  {
    nameKey: "markets",
    href: "/admin/markets",
    icon: Store,
  },
  {
    nameKey: "benefits",
    href: "/admin/benefits",
    icon: Gift,
  },
  {
    nameKey: "reports",
    href: "/admin/reports",
    icon: AlertCircle,
  },
];

export function AdminLayoutComponent({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations('common');
  const { locale } = useLanguage();

  const navigation = navigationKeys.map(item => ({
    ...item,
    name: t(`navigation.${item.nameKey}`)
  }));

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-primary px-4 shadow-sm sm:px-6">
        <div className="flex items-center rounded-sm border-2 border-black bg-white px-2 py-0.5">
          <Link href="/admin" className="text-lg font-extrabold text-primary">
            <img
              src="/logo.png"
              alt="SmartPreço"
              className="w-24 object-cover h-10"
            />
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background drop-shadow-sm md:block">
          <div className="border-b p-4">
            <h2 className="font-semibold text-primary">{t('navigation.admin')}</h2>
            <div className="mt-1 text-xs text-muted-foreground">
              {locale === 'pt-BR' ? '🇧🇷 Português' : '🇺🇸 English'}
            </div>
          </div>
          <nav className="flex flex-col gap-2 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary/10 hover:text-secondary",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "" : "text-muted-foreground",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 bg-background/50 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
