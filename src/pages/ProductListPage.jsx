import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

/**
 * Product listing with:
 *  - Search
 *  - Category filter (derived from products)
 *  - Sort (default, price asc, price desc, rating)
 *  - Results update interactively (no other file changes)
 */

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetch("https://dummyjson.com/products?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        const list = Array.isArray(d.products) ? d.products : [];
        setProducts(list);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setProducts([]);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // derive categories from products (memoized)
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
      if (p.brand) set.add(p.brand); // optional: include brand as choices
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  // filtration pipeline
  const filtered = useMemo(() => {
    let res = products;

    // search
    if (q?.trim()) {
      const term = q.trim().toLowerCase();
      res = res.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term)) ||
          (p.brand && p.brand.toLowerCase().includes(term))
      );
    }

    // category filter
    if (category && category !== "all") {
      res = res.filter((p) => p.category === category || p.brand === category);
    }

    // sort
    if (sort === "price-asc") {
      res = res.slice().sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      res = res.slice().sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      res = res.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return res;
  }, [products, q, category, sort]);

  return (
    <div className="product-list-page">
      <div className="page-header-row">
        <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
          <h2 style={{ margin: 0 }}>Products</h2>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              className="input search-input"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select
              className="select-input input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ minWidth: 160 }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>

            <select
              className="select-input input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ minWidth: 160 }}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="status info">Loading products…</div>
      ) : filtered.length === 0 ? (
        <div className="status info">No products found for your search / filters.</div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={(prod) =>
                addToCart({
                  id: prod.id,
                  title: prod.title,
                  price: prod.price,
                  thumbnail: prod.thumbnail || (prod.images && prod.images[0]),
                })
              }
              onView={(id) => {
                // if you later add product detail, navigate; for now keep same page
                navigate("/products");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}