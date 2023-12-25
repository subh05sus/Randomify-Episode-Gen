const express = require('express');
const path = require('path');
const axios = require('axios');
const { GoogleGenerativeAI,HarmBlockThreshold, HarmCategory  } = require("@google/generative-ai");
require("dotenv").config();


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
    const seasonParam = req.query.season;
    const numberParam = req.query.number;
  
    try {
      const showsResponse = await axios.get(`http://api.tvmaze.com/search/shows?q=${seriesInput}`);
      const showsData = showsResponse.data;
  
      if (showsData.length === 0) {
        res.status(404).send('Show not found');
        return;
      }
  
      const show = showsData[0].show;
  
      let randomEpisode;
  
      if (seasonParam && numberParam) {
        // If season and number parameters are provided, fetch the specific episode
        const episodeResponse = await axios.get(`http://api.tvmaze.com/shows/${show.id}/episodebynumber?season=${seasonParam}&number=${numberParam}`);
        randomEpisode = episodeResponse.data;
  
        // You can add additional checks or error handling here
      } else {
        // Otherwise, fetch a random episode
        const episodesResponse = await axios.get(`http://api.tvmaze.com/shows/${show.id}/episodes`);
        const episodesData = episodesResponse.data;
        randomEpisode = getRandomItem(episodesData);
        console.log(show.name, randomEpisode.season, randomEpisode.number)
        if(randomEpisode.summary.length>400){
          randomEpisode.summary = 'No summary available.'          
        }
      }
  
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
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


async function main(ques) {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    safetySettings 
  });

  const prompt =
    "SUMMARIZE:\n" + ques;

  try {
    const result = await model.generateContentStream(prompt);
    const response = await result.response;
    //   const text = response.text();

    let text = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      text += chunkText;
    }
    console.log(reqCount, ques, ":", text);

    return (text);
  } catch (e) {
    return ("No Hate Speech Please");
  }
}

