import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

// export const getArticles = () =>
//   axios.get(`${API_BASE}/articles`).then((res) => res.data);

export const getArticleById = (id) =>
  axios.get(`${API_BASE}/articles/${id}`).then((res) => res.data);

export async function getArticles({ page, limit, search }) {
  const params = new URLSearchParams({
    page,
    limit,
    search,
  });

  const res = await fetch(`http://localhost:5000/articles?${params}`);
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}