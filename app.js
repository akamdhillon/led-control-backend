require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-colors', async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "give me RGB values for the best color that corresponds with the prompt provided. Do not provide any additional information, only numbers separated by commas",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-3.5-turbo-0125",
      });

    res.json(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
