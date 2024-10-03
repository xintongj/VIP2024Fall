const express = require('express');
const app = express();
const language = require('@google-cloud/language');
const cors = require('cors');
app.use(cors());

// Instantiates a client
const client = new language.LanguageServiceClient({
  keyFilename: '/Users/allisonwang/Downloads/adept-mountain-419017-4fad439e6d4a.json'
});

app.use(express.json());

app.post('/analyze-sentiment', async (req, res) => {
  const text = req.body.text;
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  try {
    const [result] = await client.analyzeSentiment({ document });
    res.send(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
