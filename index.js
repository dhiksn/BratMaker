const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api', (req, res) => {
  res.json({
    name: 'BratMaker REST API',
    version: '1.0.0',
    description: 'REST API wrapper for BratMaker',
    endpoints: {
      api: {
        method: 'GET',
        path: '/api',
        description: 'API information'
      },
      brat: {
        method: 'GET',
        path: '/api/brat?text={text}',
        description: 'Generate BRAT image from text'
      },
      bratvid: {
        method: 'GET',
        path: '/api/bratvid?text={text}',
        description: 'Generate BRAT video from text'
      }
    }
  });
});

app.get('/api/brat', async (req, res) => {
  try {
    const { text } = req.query;
    
    if (!text) {
      return res.status(400).json({ error: 'Parameter "text" is required' });
    }

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/brat/brat.php?text=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/bratvid', async (req, res) => {
  try {
    const { text } = req.query;
    
    if (!text) {
      return res.status(400).json({ error: 'Parameter "text" is required' });
    }

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/brat/bratvid.php?text=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export for Vercel serverless
module.exports = app;

// Run locally if not in serverless environment
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
