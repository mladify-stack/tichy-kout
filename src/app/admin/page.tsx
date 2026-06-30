"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS_LABELS, formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  recipientName: string | null;
  recipientEmail: string | null;
  totalCents: number;
  createdAt: string;
  items: { message: string; postcard: { name: string } }[];
  shippingAddress: { street: string; city: string; postalCode: string } | null;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "ALL") params.set("status", filter);
    if (search) params.set("search", search);

    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
    }
    setLoading(false);
  }, [filter, search]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/ucet/prihlaseni");
      return;
    }
    if (status === "authenticated") {
      if (session.user.role !== "ADMIN") {
        router.push("/ucet");
        return;
      }
      fetchOrders();
    }
  }, [status, session, router, fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    if (res.ok) fetchOrders();
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">Načítání…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Administrace</h1>
        <Button asChild variant="outline">
          <a href="/api/admin/orders/export" download>
            Export CSV
          </a>
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Input
          placeholder="Hledat objednávku…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
          className="max-w-xs"
          aria-label="Vyhledávání objednávek"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stav" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Všechny stavy</SelectItem>
            <SelectItem value="NEW">Nová</SelectItem>
            <SelectItem value="PRINTED">Vytištěná</SelectItem>
            <SelectItem value="SHIPPED">Odeslaná</SelectItem>
            <SelectItem value="DELIVERED">Doručená</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={fetchOrders}>
          Filtrovat
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-3 pr-4">Číslo</th>
              <th className="pb-3 pr-4">Příjemce</th>
              <th className="pb-3 pr-4">Pohled</th>
              <th className="pb-3 pr-4">Cena</th>
              <th className="pb-3 pr-4">Stav</th>
              <th className="pb-3">Akce</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/40">
                <td className="py-3 pr-4 font-mono text-xs">{order.orderNumber}</td>
                <td className="py-3 pr-4">
                  {order.recipientName}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {order.shippingAddress?.city}
                  </span>
                </td>
                <td className="py-3 pr-4 max-w-[200px] truncate">
                  {order.items[0]?.postcard.name}
                </td>
                <td className="py-3 pr-4">{formatPrice(order.totalCents)}</td>
                <td className="py-3 pr-4">
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </td>
                <td className="py-3">
                  <Select
                    value={order.status}
                    onValueChange={(v) => updateStatus(order.id, v)}
                  >
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">Nová</SelectItem>
                      <SelectItem value="PRINTED">Vytištěná</SelectItem>
                      <SelectItem value="SHIPPED">Odeslaná</SelectItem>
                      <SelectItem value="DELIVERED">Doručená</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && !loading && (
        <p className="mt-8 text-center text-muted-foreground">
          Žádné objednávky nenalezeny.
        </p>
      )}

      <p className="mt-8">
        <Link href="/ucet" className="text-sm text-muted-foreground hover:underline">
          ← Zpět na účet
        </Link>
      </p>
    </div>
  );
}
