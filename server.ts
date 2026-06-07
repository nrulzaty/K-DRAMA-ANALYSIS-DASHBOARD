import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client on server with the telemetry header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint for searching a new K-Drama
  app.post("/api/drama/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({ error: "Search query is required." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "Gemini API Key is not configured. Please add GEMINI_API_KEY in the Settings > Secrets panel." 
        });
      }

      const prompt = `Search and analyze the K-Drama: "${query}". Provide up-to-date accurate metadata, live ratings/scores, synopsis, main cast (Korean actors), and audience sentiment drivers. Be extremely realistic and faithful to the actual production and general public perception of the drama if it exists. If it is a fictional or unreleased drama, simulate realistic metrics. Output in high density analytics format.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert South Korean entertainment and broadcasting metrics analyst. You generate precise, detailed JSON data matching the requested schema for any requested K-Drama Show.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "id", "title", "tag", "score", "likes", "dislikes", 
              "status", "episodes", "averageViewership", "summary", 
              "network", "airTime", "castList", "drivers", "milestones"
            ],
            properties: {
              id: {
                type: Type.STRING,
                description: "A lowercase url-friendly unique identifier (e.g. lovely-runner or crash-landing)"
              },
              title: {
                type: Type.STRING,
                description: "The full official title of the drama in English casing (e.g., Lovely Runner)"
              },
              tag: {
                type: Type.STRING,
                description: "Primary genre / hook (e.g., TIME SLIP ROM-COM, SCI-FI ACTION, LEGAL DRAMA)"
              },
              score: {
                type: Type.STRING,
                description: "A rating index in the format X.Y/10 (e.g., 9.2/10 or 8.7/10)"
              },
              likes: {
                type: Type.INTEGER,
                description: "An approximate percentage of positive visual reactions (e.g., 85 to 98)"
              },
              dislikes: {
                type: Type.INTEGER,
                description: "Approximate percentage of negative/disappointed reactions. Note: likes + dislikes must equal 100."
              },
              status: {
                type: Type.STRING,
                description: "A striking, dramatic status quote from a leading character or a summarizing review phrase"
              },
              episodes: {
                type: Type.INTEGER,
                description: "Total number of standard broadcast episodes (usually 12, 16, or 20)"
              },
              averageViewership: {
                type: Type.STRING,
                description: "Average or peak viewership rating percentage with % symbol (e.g. 15.6% or 21.7% Peak)"
              },
              summary: {
                type: Type.STRING,
                description: "A dense, elegant, and structured 2-3 sentence overview of the plot, characters, and thematic core."
              },
              network: {
                type: Type.STRING,
                description: "Broadcasting network acronym (e.g., tvN, JTBC, SBS, MBC, KBS2, NETFLIX)"
              },
              airTime: {
                type: Type.STRING,
                description: "Weekly broadcast schedule day/time (e.g., Mon & Tue 20:50, Sat & Sun 21:10) or 'Full Drop' if streaming"
              },
              castList: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "The top 3 leading cast actors, e.g. ['Byeon Woo-seok', 'Kim Hye-yoon']"
              },
              drivers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["label", "percentage", "color"],
                  properties: {
                    label: {
                      type: Type.STRING,
                      description: "A core reason audience watches the drama (e.g. Masterful Pacing, Nostalgic Charm, Powerful Chemistry)"
                    },
                    percentage: {
                      type: Type.INTEGER,
                      description: "Audience vote weight percentage out of 100 for this driver"
                    },
                    color: {
                      type: Type.STRING,
                      description: "Visual theme indicator color (use either 'from-pink-500 to-rose-400' or 'from-purple-500 to-indigo-400')"
                    }
                  }
                },
                description: "Exactly 4 core viewer driver items describing why users love or watch this show."
              },
              milestones: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["episode", "event", "rating"],
                  properties: {
                    episode: {
                      type: Type.STRING,
                      description: "Broadcasting frame or week interval, e.g., Ep 1-4, Ep 5-8, Ep 9-12 or Finale Week"
                    },
                    event: {
                      type: Type.STRING,
                      description: "Key breakout plot catalyst or main viral milestone, e.g., Sweet confession or epic truth showdown"
                    },
                    rating: {
                      type: Type.STRING,
                      description: "Peak or average viewership percentage with %, e.g., 8.4% or 16.5%"
                    }
                  }
                },
                description: "Exactly 3 major broadcast milestones or viral events with ratings"
              }
            }
          },
        },
      });

      const parsedDrama = JSON.parse(response.text.trim());
      return res.json({ success: true, data: parsedDrama });
    } catch (err: any) {
      console.error("Gemini Search Error:", err);
      return res.status(500).json({ error: err?.message || "Failed to search and compile drama analytics. Please try again." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
