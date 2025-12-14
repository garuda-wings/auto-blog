import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticleById } from "../api/client";
import banner from "../images/banner.jpg";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getArticleById(id).then(setArticle).catch(console.error);
  }, [id]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      setProgress((scrollTop / height) * 100);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!article) return <p>Loading...</p>;

  return (
    <div>
      <div className="hero">
        <img src={banner} alt="Banner" loading="lazy" />
        <h1>{article.title}</h1>
      </div>
      
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <div style={{ padding: 24 }}>
        <div className="card">
          <p style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {article.content}
          </p>
        </div>

        <div className="share">
          <a
            className="share-button share-x"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on  𝕏
          </a>

          <a
            className="share-button share-linkedin"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on LinkedIn
          </a>
        </div>


        <Link to="/" style={{ display: "inline-block", marginTop: "20px" }}>
          Back to articles
        </Link>
      </div>
    </div>
  );
}
