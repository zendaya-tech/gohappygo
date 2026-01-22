import { useEffect, useMemo, useRef, useState } from "react";
import type { Airline } from "~/services/airlineService";
import { searchAirlines } from "~/services/airlineService";

type AirlineComboBoxProps = {
  label: string;
  value?: string; // airline id
  onChange: (airline: Airline | null) => void;
  placeholder?: string;
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export default function AirlineComboBox({
  label,
  value,
  onChange,
  placeholder,
}: AirlineComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const requestIdRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const debouncedQuery = useDebouncedValue(query, 300);

  const load = async (reset: boolean) => {
    if (loading) return;
    if (!hasMore && !reset) return;
    setLoading(true);
    try {
      const currentId = ++requestIdRef.current;
      const currentPage = reset ? 1 : page;
      const res = await searchAirlines({
        name: debouncedQuery,
        page: currentPage,
        limit: 10,
      });
      if (requestIdRef.current !== currentId) return; // ignore stale results
      setItems((prev) => (reset ? res.items : [...prev, ...res.items]));
      setPage(currentPage + 1);
      setHasMore(currentPage < res.totalPages);
      setActiveIndex(res.items.length > 0 ? 0 : -1);
    } finally {
      setLoading(false);
    }
  };

  // Initial/open load and when query changes (debounced)
  useEffect(() => {
    if (!open) return;
    setHasMore(true);
    setPage(1);
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, open]);

  // Close on click outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!listRef.current && !inputRef.current) return;
      const inside =
        listRef.current?.contains(target) || inputRef.current?.contains(target);
      if (!inside) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Infinite scroll observer
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const io = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        load(false);
      }
    });
    io.observe(sentinel);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sentinelRef.current, page, hasMore]);

  const onPick = (airline: Airline) => {
    onChange(airline);
    setQuery(`${airline.name}`);
    setOpen(false);
  };

  // If parent passes an id as value, reflect as input display when closed
  const displayValue = useMemo(() => query, [query]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
              setOpen(true);
              return;
            }
            if (!open) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((idx) =>
                Math.min(idx < 0 ? 0 : idx + 1, items.length - 1)
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((idx) => Math.max(idx < 0 ? 0 : idx - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (activeIndex >= 0 && activeIndex < items.length)
                onPick(items[activeIndex]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-xl pl-3 pr-9 py-2 outline-none"
        />
        <button
          type="button"
          aria-label="Toggle dropdown"
          onClick={() => setOpen((o) => !o)}
          className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 hover"
        >
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {open && (
          <div
            ref={listRef}
            className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-72 overflow-auto"
          >
            {items.length === 0 && !loading && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Aucune compagnie trouvée
              </div>
            )}
            {items.map((airline, idx) => (
              <button
                key={`${airline.id}-${airline.iataCode}`}
                onClick={() => onPick(airline)}
                className={`w-full text-left px-3 py-2 text-sm text-gray-800 ${idx === activeIndex ? "bg-gray-100" : "hover"}`}
              >
                <div className="flex items-center gap-2">
                  {airline.logoUrl && (
                    <img
                      src={airline.logoUrl}
                      alt={airline.name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <div>
                    <div className="font-medium">
                      {airline.name}{" "}
                      <span className="text-gray-500">({airline.iataCode})</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {airline.icaoCode}
                    </div>
                  </div>
                </div>
              </button>
            ))}
            <div ref={sentinelRef} />
            {loading && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Chargement…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
