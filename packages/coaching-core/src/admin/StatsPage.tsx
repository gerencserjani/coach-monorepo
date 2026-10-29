import { useState, type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/endpoints";
import type { StatsRange } from "../api/models";
import { formatHuf } from "./utils";

const RANGE_OPTIONS: { value: StatsRange; label: string }[] = [
  { value: "7d", label: "7 nap" },
  { value: "30d", label: "30 nap" },
  { value: "90d", label: "90 nap" },
  { value: "all", label: "Összes" },
];

export default function StatsPage(): ReactElement {
  const [range, setRange] = useState<StatsRange>("30d");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats", range],
    queryFn: () => adminApi.stats(range),
  });

  return (
    <div>
      <h1 className="mb-1 text-xl text-ink">Statisztika</h1>
      <p className="mb-4 max-w-md text-sm text-ink-soft">
        A visszamondott foglalások nem számítanak bele -- a bevétel egy becsült
        érték, a szolgáltatások mindenkori díjából kiszámolva.
      </p>

      <div className="mb-4 flex gap-2">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setRange(option.value)}
            className={[
              "rounded-full border px-3 py-1 text-sm transition-colors duration-200",
              range === option.value
                ? "border-ink bg-ink text-bg"
                : "border-line text-ink-soft hover:border-accent hover:text-accent",
            ].join(" ")}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-soft">Betöltés…</p>
      ) : (
        <div className="grid max-w-md grid-cols-2 gap-4">
          <div className="rounded-xl border border-line bg-bg-card p-4">
            <div className="text-sm text-ink-soft">Foglalások</div>
            <div className="text-2xl text-ink">{stats?.bookingCount ?? 0}</div>
          </div>
          <div className="rounded-xl border border-line bg-bg-card p-4">
            <div className="text-sm text-ink-soft">Becsült bevétel</div>
            <div className="text-2xl text-ink">
              {formatHuf(stats?.revenueHuf ?? 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
