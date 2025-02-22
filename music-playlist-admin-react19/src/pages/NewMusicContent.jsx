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
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewMusicContent = () => {
  const navigate = useNavigate();
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
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const response = await axios.get('http://173.230.134.186:5000/api/content-libraries');
      setLibraries(response.data.filter(lib => 
        ['GLOBAL_MUSIC', 'VERTICAL_MUSIC'].includes(lib.libraryType)
      ));
    } catch (err) {
      setError('Error fetching libraries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Reference Content model structure for validation
      ```javascript:models/Content.js
      startLine: 236
      endLine: 268
      ```

      const response = await axios.post('http://173.230.134.186:5000/api/music-content', {
        ...formData,
        releaseYear: parseInt(formData.releaseYear),
        bpm: parseInt(formData.bpm),
        duration: parseInt(formData.duration),
        libraries: selectedLibraries
      });

      setSuccess('Music content created successfully');
      setTimeout(() => navigate('/content'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating music content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        New Music Content
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        fullWidth
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Artist"
        value={formData.artist}
        onChange={(e) => setFormData({...formData, artist: e.target.value})}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Album"
        value={formData.album}
        onChange={(e) => setFormData({...formData, album: e.target.value})}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Release Year"
        type="number"
        value={formData.releaseYear}
        onChange={(e) => setFormData({...formData, releaseYear: e.target.value})}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Formats</InputLabel>
        <Select
          multiple
          value={formData.formats}
          onChange={(e) => setFormData({...formData, formats: e.target.value})}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {/* Format options from README */}
          <MenuItem value="Classic Rock">Classic Rock</MenuItem>
          <MenuItem value="80s Hits">80s Hits</MenuItem>
          <MenuItem value="Country">Country</MenuItem>
          <MenuItem value="Jazz">Jazz</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>Energy Level</Typography>
        <Slider
          value={formData.energyLevel}
          onChange={(e, newValue) => setFormData({...formData, energyLevel: newValue})}
          min={1}
          max={10}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <TextField
        fullWidth
        label="BPM"
        type="number"
        value={formData.bpm}
        onChange={(e) => setFormData({...formData, bpm: e.target.value})}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Duration (seconds)"
        type="number"
        required
        value={formData.duration}
        onChange={(e) => setFormData({...formData, duration: e.target.value})}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="File Name"
        required
        value={formData.fileName}
        onChange={(e) => setFormData({...formData, fileName: e.target.value})}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Libraries</InputLabel>
        <Select
          multiple
          value={selectedLibraries}
          onChange={(e) => setSelectedLibraries(e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={libraries.find(lib => lib.id === value)?.name || value} />
              ))}
            </Box>
          )}
        >
          {libraries.map((library) => (
            <MenuItem key={library.id} value={library.id}>
              {library.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select libraries to add this content to</FormHelperText>
      </FormControl>

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Music Content'}
      </Button>
    </Box>
  );
};

export default NewMusicContent; 