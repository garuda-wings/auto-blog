const axios = require("axios");

const BASE_URL = "http://localhost:5000/articles";

async function testEndpoints() {
  try {
    console.log("1. Fetch all articles:");
    let res = await axios.get(BASE_URL);
    console.log(res.data);

    console.log("\n2. Fetch article by ID (1):");
    try {
      res = await axios.get(`${BASE_URL}/1`);
      console.log(res.data);
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
    }

    console.log("\n3. Generate new AI article:");
    res = await axios.post(`${BASE_URL}/gen`);
    console.log(res.data);

    console.log("\n4. Fetch all articles again:");
    res = await axios.get(BASE_URL);
    console.log(res.data);
  } catch (err) {
    console.error("Test failed:", err.response ? err.response.data : err.message);
  }
}

testEndpoints();


/**
 * Function:
 * Fetch all articles from /articles
 * Try to fetch article 1
 * Generate a new AI article via your /articles/gen endpoint
 * Fetch all articles again to verify the new article was saved
 */