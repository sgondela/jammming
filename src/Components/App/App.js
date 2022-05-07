import React from 'react';

import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      sessionStorageTerm: '',
      loggedIn: false
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({
      playlistTracks: tracks
    });
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({
      playlistTracks: tracks
    });
  }

  updatePlaylistName(name) {
      this.setState({
        playlistName: name
      });
  }
    

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    });
  }

  search(term) {
    window.sessionStorage.setItem('term', term);
    Spotify.search(term).then(searchResults => {
      this.setState({
        searchResults: searchResults
      })
    });
  }

  componentDidMount() {
    if (window.location.href.match(/access_token=/)) {
      Spotify.getAccessToken();
      this.setState({
        sessionStorageTerm: window.sessionStorage.getItem('term'),
        loggedIn: true
      }, () => {
        if (this.state.sessionStorageTerm) {
          Spotify.search(this.state.sessionStorageTerm).then(searchResults => {
            this.setState({
              searchResults: searchResults,
              sessionStorageTerm: ''
            });
            window.sessionStorage.removeItem('term');
          });
        }
      })
    }
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar 
            onSearch={this.search}
          />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              onRemove={this.removeTrack}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default App;