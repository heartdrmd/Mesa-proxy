const express = require('express');
const path    = require('path');
const axios   = require('axios');
const cors    = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// serve index.html on "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// your proxy endpoint
app.get('/mesa-risk', async (req, res) => {
  try {
    // pull each field out of the query
    const {
      gender, age, ethnicity,
      diabetes, smoke, fhhx,
      chol, hdl, sbp,
      lipid, htnmed, cac
    } = req.query;

    // build the correct path URL
    const url = `https://www.mesa-nhlbi.org/MESACHDRiskCoronaryAge/api/score/`
      + `${gender}/${age}/${ethnicity}/${diabetes}/${smoke}/${fhhx}`
      + `/${chol}/${hdl}/${sbp}/${lipid}/${htnmed}/${cac}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('MESA API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch MESA risk score.' });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
