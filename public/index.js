let visited = 0;
let copy = 0;
let tweetB = 0;
let wp = 0;
let shareB = 0;
document.addEventListener("DOMContentLoaded", () => {
  window.getRandomEpisode = async () => {
    copy = 0;
    tweetB = 0;
    wp = 0;
    shareB = 0;
    const seriesInput = document.getElementById("seriesInput").value;

    try {
      const seasonParam = getUrlParameter("season");
      const numberParam = getUrlParameter("number");
      let response;

      if (seasonParam && numberParam && !visited) {
        // If season and number parameters are provided in the URL, fetch the specific episode
        response = await fetch(
          `/getRandomEpisode?seriesInput=${encodeURIComponent(
            seriesInput
          )}&season=${seasonParam}&number=${numberParam}`
        );
        visited = 1;
      } else {
        // Otherwise, fetch a random episode
        response = await fetch(
          `/getRandomEpisode?seriesInput=${encodeURIComponent(seriesInput)}`
        );
      }

      const data = await response.json();
      if (data.episodePremise.length > 400) {
        data.episodePremise = 'No summary available.'
      }
      const episodeDetailsContainer = document.getElementById("episodeDetails");
      episodeDetailsContainer.innerHTML = `
      <div class="generated">
      <div class="allDetails">
        <h2>${data.showName}</h2>
        <p>Episode: S${data.season}E${data.number} - ${data.episodeName}</p>
        <p>Episode Premise: ${data.episodePremise}</p>
      </div>
      <div class = "snapAndShare">
      <div style="
      display: flex;
      align-items: center;
      justify-content: center;
  ">
        ${
          data.episodeImage
            ? `<img src="${data.episodeImage}" alt="Episode Image" class="episodeImage">`
            : ""
        } </div>
        <div class="buttons-container" style="display: flex; justify-content: space-around;">
        <button style="
    height: 20px;
" onclick="copyToClipboard('${seriesInput}', ${data.season}, ${data.number})">
          <img src="clipboard.svg" alt="Clipboard Icon" id="shareIcon" style="
    height: 20px;
" onclick="copyToClipboard('${seriesInput}', ${data.season}, ${data.number})">
          </button>
          <button style="
    height: 20px;
" onclick="shareOnWhatsApp('${seriesInput}', ${data.season}, ${data.number})">
          <img src="whatsapp.svg" alt="WhatsApp Icon" id="shareIcon" style="
    height: 20px;
" onclick="shareOnWhatsApp('${seriesInput}', ${data.season}, ${data.number})">
          </button>
          <button style="
    height: 20px;
" onclick="shareOnTwitter('${seriesInput}', ${data.season}, ${data.number})">
          <img src="x-social-media-round-icon.svg" alt="WhatsApp Icon" id="shareIcon" style="
    height: 20px;
" onclick="shareOnTwitter('${seriesInput}', ${data.season}, ${data.number})">
          </button>
          <button style="
    height: 20px;
" onclick="shareOnOthers()">
          <img src="share-svgrepo-com.svg" alt="WhatsApp Icon" id="shareIcon" style="
    height: 20px;
" onclick="shareOnOthers()">
          </button>
        </div>
      </div>
      </div>

      `;
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error fetching data. Please try again.");
    }
  };


  window.resetNum = (number) => {
    // Set number to 1
    number = 1;
    
    // After 250 seconds (250,000 milliseconds), reset number to 0
    setTimeout(() => {
      number = 0;
    }, 1000);
  };
  
  
  
  window.copyToClipboard = null;

  window.copyToClipboard = (seriesInput, season, number) => {
    if (!copy) {
      console.log("copyToClipboard called");

      const url = `${window.location.origin}?seriesInput=${encodeURIComponent(
        seriesInput
      )}&season=${season}&number=${number}`;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("URL copied to clipboard!");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Unable to copy to clipboard. Please try again.");
        });
      copy = 1
      setTimeout(() => {
        copy = 0;
      }, 1000);

    }
  };

  window.shareOnWhatsApp = null;

  window.shareOnWhatsApp = (seriesInput, season, number) => {
    if (!wp) {

      
      console.log("shareOnWhatsApp called");
      
    const url = `${window.location.origin}?seriesInput=${encodeURIComponent(
      seriesInput
    )}&season=${season}&number=${number}`;
    const whatsAppText = encodeURIComponent(`Check this episode: ${url}`);
    const whatsappLink = `https://wa.me/?text=${whatsAppText}`;
    
    window.open(whatsappLink, "_blank");
    wp = 1
    setTimeout(() => {
      wp = 0;
    }, 1000);
  }
  };
  window.shareOnTwitter = null;

  window.shareOnTwitter = (seriesInput, season, number) => {
    if (!tweetB) {
      tweetB = 1
      setTimeout(() => {
        tweetB = 0;
      }, 1000);
    console.log("shareOnTwitter called");

    const url = `${window.location.origin}?seriesInput=${encodeURIComponent(
      seriesInput
    )}&season=${season}&number=${number}`;
    const tweetText = encodeURIComponent(`Check this episode: ${url}`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

    window.open(tweetUrl, "_blank");
    }
  };
  window.shareOnOthers = null;

  window.shareOnOthers = async () => {
    if (!shareB) {

    console.log("shareOnOthers called");

    // document.documentElement.style.backgroundColor = "rgba(255,42,102,255)";
    // document.body.style.backgroundColor = "rgba(255,42,102,255)";
    const mainContainer = document.querySelector(".container");

    // Make the background of the main container transparent
    mainContainer.style.backgroundColor = "rgba(255,42,102,255)";

    const canvas = await html2canvas(mainContainer);

    // Convert canvas data to data URI
    const dataURL = canvas.toDataURL();

    // Reset the background color of the main container
    mainContainer.style.backgroundColor = ""; // Set it to whatever color or style you had before

    // Create a Blob from the data URL
    const blob = dataURItoBlob(dataURL);

    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share on Others",
          files: [new File([blob], "result_image.png", { type: "image/png" })],
        });
      } catch (error) {}
    } else {
      alert("Web Share API is not supported on this browser.");
    }
    shareB = 1
    setTimeout(() => {
      shareB = 0;
    }, 1000);
  }
  };
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png" });
  }

  // Function to parse URL parameters
  window.getUrlParameter = (name) => {
    name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(window.location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  // Check for URL parameters and fetch episode details
  const seriesInputParam = getUrlParameter("seriesInput");
  const seasonParam = getUrlParameter("season");
  const numberParam = getUrlParameter("number");

  if (seriesInputParam) {
    document.getElementById("seriesInput").value = seriesInputParam;
    getRandomEpisode(); // Fetch details for the specific episode if URL parameters are present
  }
});




