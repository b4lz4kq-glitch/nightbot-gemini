const express = require('express');
const app = express();

app.get('/ask', async (req, res) => {
  const question = req.query.q;
  if (!question) return res.send('Usage: !ask your question');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.AIzaSyD8oZTn-zbZEFgyddynSykqc4QVaWpaZ3c}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }]
        })
      }
    );

    const data = await response.json();
    console.log(JSON.stringify(data));

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) return res.send('No answer received. Check API key.');

    res.send(answer.replace(/\n/g, ' ').substring(0, 400));
  } catch (e) {
    res.send('Error: ' + e.message);
  }
});

app.listen(process.env.PORT || 3000);
