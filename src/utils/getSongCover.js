const axios = require("axios");

const getSongCover = (artist, track) => {
  return axios
    .get(
      `https://api.deezer.com/search?q=artist:"${encodeURIComponent(
        artist
      )}" track:"${encodeURIComponent(track)}"`
    )
    .then((response) => {
      const data = response.data;
      const trackData = data.data[0]; // Assuming the first result is relevant
      const artworkUrl = trackData.album.cover_medium; // URL to medium-sized album artwork
      return artworkUrl;
    })
    .catch((error) => {
      console.log("Error fetching artwork! Using default cover.");
      // return default cover
      return "https://artists.apple.com/assets/artist-og-share-c766a5950ae664ea9073ede99da0df1094ae1a24bee32b86ab9e43e7e02bce2e.jpg";
    });
};

module.exports = { getSongCover };
