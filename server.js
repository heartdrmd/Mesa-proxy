const express = require('express');
const axios   = require('axios');
const cors    = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/mesa-risk', async (req, res) => {
  try {
    const apiUrl = 'https://www.mesa-nhlbi.org/MESACHDRiskCoronaryAge/api/score';
    const response = await axios.get(apiUrl, { params: req.query });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch MESA risk score.' });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
