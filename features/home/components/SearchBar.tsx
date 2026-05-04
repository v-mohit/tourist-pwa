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
import clsx from "clsx";

export interface SearchBarHandle {
  setValue: (value: string) => void;
}

interface SearchBarProps {
  onSelect?: () => void;
  variant?: "hero" | "modal";
}

const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(({ onSelect, variant = "hero" }, ref) => {
  const router = useRouter()
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    setValue(value: string) {
      setQuery(value);
      setTimeout(() => inputRef.current?.focus(), 0);
    },
  }));

  // ✅ Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Group by category
  function groupByCategory(data: any[]) {
    const map: Record<string, any[]> = {}
    const cities: Record<string, any> = {}

    data.forEach((place) => {
      const attr = place.attributes

      const name = attr.name
      const cityName = attr.city?.data?.attributes?.name
      const citySlug = attr.city?.data?.attributes?.cityDetail?.data?.attributes?.slug
      const cityIcon = attr.city?.data?.attributes?.image?.data?.attributes?.url

      const slug =
        attr.placeDetail?.data?.attributes?.slug || null

      const categories = attr.categories?.data || []

      if (cityName && citySlug) {
        if (!cities[cityName]) {
          cities[cityName] = {
            name: cityName,
            slug: citySlug,
            icon: cityIcon,
            isCity: true,
          }
        }
      }

      categories.forEach((cat: any) => {
        const catName = cat.attributes.Name
        const icon = cat.attributes.icon?.data?.attributes?.url

        if (!map[catName]) map[catName] = []

        map[catName].push({
          name,
          city: cityName,
          icon,
          slug,
          isCity: false,
        })
      })
    })

    const result: Record<string, any[]> = { ...map }
    const cityList = Object.values(cities)
    if (cityList.length > 0) {
      result["Cities"] = cityList
    }

    return result
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
          pageSize: 20, // Increased size for better results
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

    if (item.isCity) {
      router.push(`/citydetail/${item.slug}`)
    } else {
      router.push(`/place-detail/${item.slug}`)
    }
    
    if (onSelect) onSelect();
  }

  return (
    <div ref={containerRef} className={clsx("relative w-full", variant === "modal" ? "search-modal-box" : "search-hero-box")}>
      <div className={clsx("hero-search", variant === "modal" && "search-modal-input-container")}>
        <input
          ref={inputRef}
          type="text"
          placeholder="🔍 Search forts, wildlife, museums..."
          className={clsx(variant === "modal" && "text-black")}
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
                    {!item.isCity && item.city && (
                      <span>
                        <img src="/icons/google-maps.png" width={10} height={10} alt="Location" className="loc-ico mr-1" />
                        {item.city}
                      </span>
                    )}
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
