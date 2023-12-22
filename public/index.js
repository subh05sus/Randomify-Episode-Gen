document.addEventListener('DOMContentLoaded', () => {
  const seriesInput = document.getElementById('seriesInput');
  const episodeDetailsContainer = document.getElementById('episodeDetails');
  const copyToClipboardButton = document.getElementById('copyToClipboard');

  // Check if there are query parameters in the URL
  const queryParams = new URLSearchParams(window.location.search);
  const seriesQueryParam = queryParams.get('seriesInput');

  if (seriesQueryParam) {
    // If seriesInput parameter is present, decode and display episode details
    seriesInput.value = decodeURIComponent(seriesQueryParam);
    getRandomEpisode();
  }

  window.getRandomEpisode = async () => {
    const seriesValue = seriesInput.value;

    try {
      const response = await fetch(`/getRandomEpisode?seriesInput=${encodeURIComponent(seriesValue)}`);
      const data = await response.json();

      // Display episode details
      episodeDetailsContainer.innerHTML = `
        <h2>${data.showName}</h2>
        <p>Episode: S${data.season}E${data.number} - ${data.episodeName}</p>
        <p>Episode Premise: ${data.episodePremise}</p>
        ${data.episodeImage ? `<img src="${data.episodeImage}" alt="Episode Image">` : ''}
      `;

      // Generate the URL with query parameters for copying to clipboard
      const encodedUrl = `${window.location.origin}?seriesInput=${encodeURIComponent(seriesValue)}`;
      copyToClipboardButton.dataset.clipboardText = encodedUrl;
      copyToClipboardButton.disabled = false; // Enable the button

    } catch (error) {
      console.error('Error:', error.message);
      alert('Error fetching data. Please try again.');
    }
  };

  copyToClipboardButton.addEventListener('click', () => {
    const clipboardText = copyToClipboardButton.dataset.clipboardText;

    // Create a temporary input element to copy the text
    const tempInput = document.createElement('input');
    tempInput.value = clipboardText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    alert('Copied to clipboard!');
  });

  function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
});
