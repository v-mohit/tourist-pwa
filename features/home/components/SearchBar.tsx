"use client";

import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { graphqlClient } from "@/services/client";
import { FetchHomeSearchDocument } from "@/generated/graphql";
import { useRouter } from 'next/navigation'

export interface SearchBarHandle {
  setValue: (value: string) => void;
}

const SearchBar = forwardRef<SearchBarHandle>((_, ref) => {
  const router = useRouter()
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    setValue(value: string) {
      setQuery(value);
      setTimeout(() => inputRef.current?.focus(), 0);
    },
  }));

  // ✅ Group by category
 function groupByCategory(data: any[]) {
  const map: Record<string, any[]> = {}

  data.forEach((place) => {
    const attr = place.attributes

    const name = attr.name
    const city = attr.city?.data?.attributes?.name

    const slug =
      attr.placeDetail?.data?.attributes?.slug || null

    const categories = attr.categories?.data || []

    categories.forEach((cat: any) => {
      const catName = cat.attributes.Name
      const icon = cat.attributes.icon?.data?.attributes?.url

      if (!map[catName]) map[catName] = []

      map[catName].push({
        name,
        city,
        icon,
        slug, // ✅ add this
      })
    })
  })

  return map
}

  // ✅ Debounced API call
  useEffect(() => {
    if (!query.trim()) {
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        const res: any = await graphqlClient.request(FetchHomeSearchDocument, {
          searchKey: query,
          page: 1,
          pageSize: 10,
        });

        const places = res?.places?.data || [];
        const grouped = groupByCategory(places);

        setResults(grouped);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400); // 🔥 debounce time

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

function handleSelect(item: any) {
  if (!item.slug) return

  setShowDropdown(false)
  setQuery(item.name)

  router.push(`/place-detail/${item.slug}`) // ✅ navigate
}

  return (
    <div className="hero-search-wrap">
      <div className="hero-search">
        <input
          ref={inputRef}
          type="text"
          placeholder="🔍 Search forts, wildlife, museums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
        />

        <button className="hero-sbtn">Search</button>
      </div>

      {/* ✅ Dropdown */}
      {showDropdown && (
        <div className="search-dropdown">
          {loading && <div className="dropdown-loading">Searching...</div>}

          {!loading &&
            Object.entries(results).map(([category, items]: any) => (
              <div key={category} className="dropdown-section">
                <h4 className="dropdown-title">
                  {items[0]?.icon && (
                    <img src={`${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${items[0].icon}`} className="cat-icon" />
                  )}
                  {category}
                </h4>

                {items.slice(0, 4).map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="dropdown-item"
                    onClick={() => handleSelect(item)}
                  >
                    <strong>{item.name}</strong>
                    <span>{item.city}</span>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";
export default SearchBar;
