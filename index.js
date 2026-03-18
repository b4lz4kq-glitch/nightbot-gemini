const express = require('express');
const app = express();

app.get('/ask', async (req, res) => {
  const question = req.query.q;
  if (!question) return res.send('Usage: !ask your question');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: question }] }] })
    }
  );

  const data = await response.json();
  let answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer.';
  answer = answer.replace(/\n/g, ' ').substring(0, 400);
  res.send(answer);
});

app.listen(process.env.PORT || 3000);
