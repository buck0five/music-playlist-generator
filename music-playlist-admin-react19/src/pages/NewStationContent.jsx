import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert,
  Typography,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CONTENT_TYPES = {
  STATION_ID: 'Station ID',
  JINGLE: 'Jingle',
  ANNOUNCEMENT: 'Announcement',
  WEATHER: 'Weather Update',
  TIME_CHECK: 'Time Check'
};

const NewStationContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    contentType: '',
    stationId: '',
    duration: '',
    fileName: '',
    cartType: '',
    isRecurring: false,
    recurringInterval: null
  });
  const [stations, setStations] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStations();
    fetchLibraries();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get('http://173.230.134.186:5000/api/stations');
      setStations(response.data);
    } catch (err) {
      setError('Error fetching stations');
    }
  };

  const fetchLibraries = async () => {
    try {
      const response = await axios.get('http://173.230.134.186:5000/api/content-libraries');
      setLibraries(response.data.filter(lib => lib.libraryType === 'STATION_CUSTOM'));
    } catch (err) {
      setError('Error fetching libraries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://173.230.134.186:5000/api/station-content', {
        ...formData,
        duration: parseInt(formData.duration),
        libraries: selectedLibraries
      });

      setSuccess('Station content created successfully');
      setTimeout(() => navigate('/content'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating station content');
    } finally {
      setLoading(false);
    }
  };

  const getCartTypeOptions = () => {
    switch (formData.contentType) {
      case 'STATION_ID':
        return ['SID1'];
      case 'JINGLE':
        return ['JIN1'];
      case 'ANNOUNCEMENT':
        return ['ANN1'];
      case 'WEATHER':
        return ['WEA1'];
      case 'TIME_CHECK':
        return ['TIM1'];
      default:
        return [];
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        New Station Content
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Content Type</InputLabel>
            <Select
              value={formData.contentType}
              onChange={(e) => setFormData({...formData, contentType: e.target.value})}
              required
            >
              {Object.entries(CONTENT_TYPES).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Station</InputLabel>
            <Select
              value={formData.stationId}
              onChange={(e) => setFormData({...formData, stationId: e.target.value})}
              required
            >
              {stations.map((station) => (
                <MenuItem key={station.id} value={station.id}>
                  {station.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Duration (seconds)"
            type="number"
            required
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="File Name"
            required
            value={formData.fileName}
            onChange={(e) => setFormData({...formData, fileName: e.target.value})}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Cart Type</InputLabel>
            <Select
              value={formData.cartType}
              onChange={(e) => setFormData({...formData, cartType: e.target.value})}
              required
            >
              {getCartTypeOptions().map((cartType) => (
                <MenuItem key={cartType} value={cartType}>
                  {cartType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Library</InputLabel>
            <Select
              value={selectedLibraries}
              onChange={(e) => setSelectedLibraries(e.target.value)}
              required
            >
              {libraries.map((library) => (
                <MenuItem key={library.id} value={library.id}>
                  {library.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Station Content'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewStationContent; 