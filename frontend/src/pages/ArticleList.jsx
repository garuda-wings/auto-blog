import React, { useEffect, useState } from "react";
import { getArticles } from "../api/client";
import { Link } from "react-router-dom";
import banner from "../images/banner.jpg";

const PAGE_SIZE = 10;
const MIN_LOADING_TIME = 300; // minimum loading time in ms

export default function ArticleList({ search }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const noResults = !loading && articles.length === 0;

  useEffect(() => {
    setLoading(true);

    const start = Date.now();

    getArticles({ page, limit: PAGE_SIZE, search })
      .then((res) => {
        const elapsed = Date.now() - start;
        const remaining = MIN_LOADING_TIME - elapsed;

        const finalize = () => {
          setArticles(res.items);
          setTotal(res.total);
          setLoading(false);
        };

        if (remaining > 0) {
          setTimeout(finalize, remaining);
        } else {
          finalize();
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div>
      <div className="hero">
        <img src={banner} alt="Banner" loading="lazy" />
        <h1>Articles</h1>
      </div>

      <div style={{ padding: 24 }}>
        {/* Skeletons */}
        {loading &&
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-title" />
              <div className="skeleton-text" />
              <div className="skeleton-text short" />
            </div>
          ))}

        {/* No results state */}
        {noResults && (
          <div className="no-results">
            <h2>No articles found</h2>
            {search ? (
              <p>
                No articles match <strong>“{search}”</strong>.
                Try a different keyword.
              </p>
            ) : (
              <p>There are no articles yet.</p>
            )}
          </div>
        )}

        {/* Articles */}
        {!loading &&
          articles.map((article, index) => (
            <div
              key={article.id}
              className="article-card"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <h2>
                <Link to={`/article/${article.id}`}>{article.title}</Link>
              </h2>

              <p>{article.excerpt}</p>

              <Link to={`/article/${article.id}`}>Read more</Link>
            </div>
          ))}
      </div>

      <div className="pagination">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
