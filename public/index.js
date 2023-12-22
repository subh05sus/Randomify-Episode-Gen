let visited = 0;
document.addEventListener('DOMContentLoaded', () => {
  window.getRandomEpisode = async () => {
    const seriesInput = document.getElementById('seriesInput').value;

    try {
      const seasonParam = getUrlParameter('season');
      const numberParam = getUrlParameter('number');
      let response;

      if (seasonParam && numberParam && !visited) {
        // If season and number parameters are provided in the URL, fetch the specific episode
        response = await fetch(`/getRandomEpisode?seriesInput=${encodeURIComponent(seriesInput)}&season=${seasonParam}&number=${numberParam}`);
        visited = 1;

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
        <button onclick="copyToClipboard('${seriesInput}', ${data.season}, ${data.number})">Copy</button>
        <button onclick="shareOnWhatsApp('${seriesInput}', ${data.season}, ${data.number})">WhatsApp</button>
        <button onclick="shareOnTwitter('${seriesInput}', ${data.season}, ${data.number})">Twitter</button>
        <button onclick="shareOnOthers('${seriesInput}', ${data.season}, ${data.number})">Share</button>  
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

  window.shareOnWhatsApp = (seriesInput, season, number) => {
    const url = `${window.location.origin}?seriesInput=${encodeURIComponent(seriesInput)}&season=${season}&number=${number}`;
    const whatsAppText = encodeURIComponent(`Check this episode: ${url}`);
    const whatsappLink = `https://wa.me/?text=${whatsAppText}`;

    window.open(whatsappLink, '_blank');
  };

  window.shareOnTwitter = (seriesInput, season, number) => {
    const url = `${window.location.origin}?seriesInput=${encodeURIComponent(seriesInput)}&season=${season}&number=${number}`;
    const tweetText = encodeURIComponent(`Check this episode: ${url}`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

    window.open(tweetUrl, '_blank');
  };

  window.shareOnOthers = async (seriesInput, season, number) => {
    try {
      const mainContainer = document.querySelector('.container');

  
      const canvas = await html2canvas(mainContainer);
  
      // Convert canvas data to data URI
      const dataURL = canvas.toDataURL();
  
      // Reset the background color of the main container
      mainContainer.style.backgroundColor = ''; // Set it to whatever color or style you had before
  
      const blob = dataURItoBlob(dataURL);
  
      if (navigator.share) {
        await navigator.share({
          title: 'Share on Others',
          files: [new File([blob], 'result_image.png', { type: 'image/png' })],
        });
      } else {
        alert('Web Share API is not supported on this browser.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sharing via Web Share API');
    }
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
