import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Alert,
  Typography,
  Slider,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMusicContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Reference EditContent.jsx state structure
  ```javascript:music-playlist-admin-react19/src/pages/EditContent.jsx
  startLine: 10
  endLine: 28
  ```

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    releaseYear: '',
    formats: [],
    genres: [],
    bpm: '',
    energyLevel: 5,
    duration: '',
    fileName: '',
    tags: []
  });

  const [playHistory, setPlayHistory] = useState([]);
  const [tagScores, setTagScores] = useState({});
  const [formatStats, setFormatStats] = useState({});
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  
  // Reference EditContent.jsx fetch logic
  ```javascript:music-playlist-admin-react19/src/pages/EditContent.jsx
  startLine: 35
  endLine: 74
  ```

  const fetchMusicContent = async () => {
    try {
      const response = await axios.get(`http://173.230.134.186:5000/api/music-content/${id}`);
      const content = response.data;
      
      setFormData({
        title: content.title,
        artist: content.artist,
        album: content.album,
        releaseYear: content.releaseYear,
        formats: content.formats || [],
        genres: content.genres || [],
        bpm: content.bpm,
        energyLevel: content.energyLevel || 5,
        duration: content.duration,
        fileName: content.fileName,
        tags: content.tags || []
      });

      setPlayHistory(content.playHistory || []);
      setTagScores(content.tagScores || {});
      setFormatStats(content.formatStats || {});
      setSelectedLibraries(content.libraries?.map(lib => lib.id) || []);
    } catch (error) {
      setError('Error loading music content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await axios.put(`http://173.230.134.186:5000/api/music-content/${id}`, {
        ...formData,
        libraries: selectedLibraries
      });

      setSuccess('Music content updated successfully');
      setTimeout(() => navigate('/content'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating music content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Music Content
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Form fields from NewMusicContent.jsx */}
        ```jsx:music-playlist-admin-react19/src/pages/NewMusicContent.jsx
        startLine: 136
        endLine: 220
        ```

        {/* Statistics Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Statistics
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Play History</Typography>
              {playHistory.map((play, index) => (
                <Typography key={index} variant="body2">
                  {new Date(play.playedAt).toLocaleString()} - Station: {play.stationName}
                </Typography>
              ))}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Tag Scores</Typography>
              {Object.entries(tagScores).map(([tagId, score]) => (
                <Box key={tagId} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {tags.find(t => t.id === parseInt(tagId))?.name}:
                  </Typography>
                  <Slider
                    value={score.total / score.count}
                    disabled
                    min={0}
                    max={5}
                    sx={{ width: 200 }}
                  />
                </Box>
              ))}
            </Box>

            <Box>
              <Typography variant="subtitle1">Format Statistics</Typography>
              {Object.entries(formatStats).map(([format, count]) => (
                <Typography key={format} variant="body2">
                  {format}: Played {count} times
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditMusicContent; 