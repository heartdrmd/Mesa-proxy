// server.js
const express = require('express');
const path    = require('path');
const axios   = require('axios');
const cors    = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/mesa-risk', async (req, res) => {
  try {
    const {
      gender, age, ethnicity,
      diabetes, smoke, fhhx,
      chol, hdl, sbp,
      lipid, htnmed, cac
    } = req.query;

    // 1) Build the exact MESA path URL
    const url = [
      'https://internal.mesa-nhlbi.org/about/procedures/tools/mesa-score-risk-calculator',
      gender, age, ethnicity,
      diabetes, smoke, fhhx,
      chol, hdl, sbp,
      lipid, htnmed, cac
    ].join('/');

    console.log('👉 Calling MESA API URL:', url);

    const response = await axios.get(url);

    console.log('✅ MESA response.data:', response.data);
    // Should be an object with { cac_riskscore: …, nocac_riskscore: … }

    res.json(response.data);
  } catch (err) {
    console.error('❌ MESA API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch MESA risk score.' });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
