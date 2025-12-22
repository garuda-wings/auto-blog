const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const BLOG_TOPIC = process.env.BLOG_TOPIC || "Personal Finance";
const BLOG_MIN_WORDS = process.env.BLOG_MIN_WORDS || 800;
const BLOG_MAX_WORDS = process.env.BLOG_MAX_WORDS || 1200;


if (!OPENROUTER_API_KEY && process.env.NODE_ENV !== "test") {
    console.log("Missing OPENROUTER_API_KEY in environment variables.")
}

// Helper functions
function cleanTitle(rawTitle) {
    return rawTitle
        .replace(/^\s*\*\*Title:\*\*\s*/i, "")  // remove "**Title:**"
        .replace(/^"|"$/g, "")                  // remove surrounding quotes
        .replace(/\*\*/g, "")                   // remove any remaining bold **
        .trim();
}

function cleanContent(rawContent) {
    return rawContent
        .replace(/^\s*\*\*Content:\*\*\s*/i, "")  // remove "**Content:**"
        .replace(/\*\*/g, "")                      // remove bold **
        .trim();
}

async function generateArticle() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistralai/devstral-2512:free",
                messages: [
                    {
                        role: "system",
                        content: `
                    You are a professional financial blogger.
                    You write clear, practical, well-structured articles for a general audience.
                    Do NOT use markdown, labels, or formatting symbols.
                    Do NOT include the words "Title:" or "Content:".
                    `
                    },
                    {
                        role: "user",
                        content: `
                    Write a long-form blog article about ${BLOG_TOPIC}.

                    Requirements:
                    - Length: between ${BLOG_MIN_WORDS} and ${BLOG_MAX_WORDS} words.
                    - Generate a concise, clean title on the first line
                    - Then write the full article body in plain text
                    - Use short paragraphs
                    - Use plain text section headings
                    - Be educational, practical and clear
                    `
                    }
                ]

            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("AI ERROR:", data);
            return null;
        }

        const rawText = data.choices?.[0]?.message?.content || "";
        const lines = rawText.split("\n").filter(l => l.trim() !== "");

        const title = cleanTitle(lines[0] || "Untitled");
        const content = cleanContent(lines.slice(1).join("\n") || "No content");

        return { title, content };
    } catch (err) {
        console.error("AI ERROR:", err);
        return null;
    }
}

// TEST RUNNER
if (require.main === module) {
    (async () => {
        const article = await generateArticle();
        console.log(article || "AI generation failed");
    })();
}

module.exports = { generateArticle };
