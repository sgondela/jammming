import spotifyClientId from "../config/config";

const clientId = spotifyClientId;
const redirectUri = 'http://localhost:3000/';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
    
    if(accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // This clears the parameters, allowing us to grab a new access token when it expires
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl; /* This is as the project required, however, this causes
                                   // the window to reload on the first seach and after
                                   // the expiresIn period of time elapses. Not the best
                                   // implementation for a SPA, but for this project, will
                                   // leave the code as called out by the instructions. In
                                   // future implementations, consider requesting a token
                                   // and parsing the returned URL to get the access_token,
                                   // and returning that so you don't have to repeat search
                                   // after access_token has been regranted. */
    }
  },

  async search(term) {
    try {
      const accessToken = Spotify.getAccessToken();
      const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log(term)
      if (response.ok) {
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks.items) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }
      throw new Error('Request failed!');
    } catch(error) {
      console.log(error);
    }
  },

 async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    try {
      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      let userId;
      const currentUserPromise = await fetch(`https://api.spotify.com/v1/me`, {   
        headers: headers 
      });
      if (currentUserPromise.ok) {
        const currentUser = await currentUserPromise.json();
        userId = currentUser.id;
        const createPlaylist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({
            name: name
          })
        });
        if (createPlaylist.ok) {
          const playlist = await createPlaylist.json();
          const playlistId = playlist.id;
          const addTracksToPlaylist = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({
              uris: trackUris
            })
          });
          if (addTracksToPlaylist.ok) {
            console.log(`Playlist '${name}' was successfully added to your account!`);
          }
        }
      } else {
        throw new Error('An error occurred, and your playlist was not saved.');
      };
    } catch(error) {
        console.log(error);
    }
  }
};

export default Spotify;

