document.addEventListener('DOMContentLoaded', () => {
  window.getRandomEpisode = async () => {
    const seriesInput = document.getElementById('seriesInput').value;

    try {
      const seasonParam = getUrlParameter('season');
      const numberParam = getUrlParameter('number');

      let response;

      if (seasonParam && numberParam) {
        // If season and number parameters are provided in the URL, fetch the specific episode
        response = await fetch(`/getRandomEpisode?seriesInput=${encodeURIComponent(seriesInput)}&season=${seasonParam}&number=${numberParam}`);
      } else {
        // Otherwise, fetch a random episode
        response = await fetch(`/getRandomEpisode?seriesInput=${encodeURIComponent(seriesInput)}`);
      }

      const data = await response.json();

      const episodeDetailsContainer = document.getElementById('episodeDetails');
      episodeDetailsContainer.innerHTML = `
        <h2>${data.showName}</h2>
        <p>Episode: S${data.season}E${data.number} - ${data.episodeName}</p>
        <p>Episode Premise: ${data.episodePremise}</p>
        ${data.episodeImage ? `<img src="${data.episodeImage}" alt="Episode Image">` : ''}
        <button onclick="copyToClipboard('${seriesInput}', ${data.season}, ${data.number})">Copy to Clipboard</button>
      `;
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error fetching data. Please try again.');
    }
  };

  window.copyToClipboard = (seriesInput, season, number) => {
    const url = `${window.location.origin}?seriesInput=${encodeURIComponent(seriesInput)}&season=${season}&number=${number}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!');
    }).catch((error) => {
      console.error('Error:', error);
      alert('Unable to copy to clipboard. Please try again.');
    });
  };

  // Function to parse URL parameters
  window.getUrlParameter = (name) => {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  // Check for URL parameters and fetch episode details
  const seriesInputParam = getUrlParameter('seriesInput');
  const seasonParam = getUrlParameter('season');
  const numberParam = getUrlParameter('number');

  if (seriesInputParam) {
    document.getElementById('seriesInput').value = seriesInputParam;
    getRandomEpisode(); // Fetch details for the specific episode if URL parameters are present
  }
});
