const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.js'));
});

app.get('/getRandomEpisode', async (req, res) => {
    const seriesInput = req.query.seriesInput;
  
    try {
      const showsResponse = await axios.get(`http://api.tvmaze.com/search/shows?q=${seriesInput}`);
      const showsData = showsResponse.data;
  
      if (showsData.length === 0) {
        res.status(404).send('Show not found');
        return;
      }
  
      const show = showsData[0].show;
  
      const episodesResponse = await axios.get(`http://api.tvmaze.com/shows/${show.id}/episodes`);
      const episodesData = episodesResponse.data;
  
      const randomEpisode = getRandomItem(episodesData);
  
      res.json({
        showName: show.name,
        episodeName: randomEpisode.name,
        episodePremise: randomEpisode.summary || 'No summary available.',
        episodeImage: randomEpisode.image?.medium || null,
        season: randomEpisode.season,
        number: randomEpisode.number,
        
    });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });
  

  
  
function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
