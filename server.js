import express, { json } from 'express';
import fetch from 'node-fetch'; // Use `node-fetch` for making API requests
import cors from 'cors';
import dotenv from 'dotenv';  // Load the .env file

dotenv.config(); // Load the .env file

const app = express();
const port = 3000;

// Middleware to parse JSON and handle CORS
app.use(json());
app.use(cors());

// Route to handle OpenAI API requests
app.post('/api/generate', async (req, res) => {
    const { userMessage } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // or "gpt-4"
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 100
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error.message);
        }

        res.json({
            response: data.choices[0].message.content
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
