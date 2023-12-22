document.addEventListener('DOMContentLoaded', () => {
  window.getRandomEpisode = async () => {
    const seriesInput = document.getElementById('seriesInput').value;

    try {
      const response = await fetch(`/getRandomEpisode?seriesInput=${encodeURIComponent(seriesInput)}`);
      const data = await response.json();

      const episodeDetailsContainer = document.getElementById('episodeDetails');
      episodeDetailsContainer.innerHTML = `
        <h2>${data.showName}</h2>
        <p>Episode: S${data.season}E${data.number} - ${data.episodeName}</p>
        <p>Episode Premise: ${data.episodePremise}</p>
        ${data.episodeImage ? `<img src="${data.episodeImage}" alt="Episode Image">` : ''}
      `;
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error fetching data. Please try again.');
    }
  };

  function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
});
