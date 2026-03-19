const express = require('express');
const app = express();

app.get('/ask', async (req, res) => {
  const question = req.query.q;
  if (!question) return res.send('Usage: !ask your question');

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-4-maverick',
          messages: [
            {
              role: 'system',
content: 'You are a witty, knowledgeable Twitch chat assistant. Give accurate, engaging answers in under 300 characters.'
            },
            {
              role: 'user',
              content: question
            }
          ],
          max_tokens: 100
        })
      }
    );

    const data = await response.json();
    console.log(JSON.stringify(data));

    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) return res.send('No answer received.');

    res.send(answer.replace(/\n/g, ' ').substring(0, 400));
  } catch (e) {
    res.send('Error: ' + e.message);
  }
});

app.listen(process.env.PORT || 3000);
