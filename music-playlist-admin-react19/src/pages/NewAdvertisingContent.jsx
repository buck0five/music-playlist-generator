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
  FormControlLabel,
  Switch,
  Grid
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewAdvertisingContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    campaign: '',
    client: '',
    priority: 'medium',
    duration: '',
    fileName: '',
    startDate: null,
    endDate: null,
    dailyStartHour: '',
    dailyEndHour: '',
    minPlaysPerDay: '',
    maxPlaysPerDay: '',
    verticalRestrictions: [],
    isActive: true
  });
  const [libraries, setLibraries] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLibraries();
    fetchVerticals();
  }, []);

  const fetchLibraries = async () => {
    try {
      const response = await axios.get('http://173.230.134.186:5000/api/content-libraries');
      setLibraries(response.data.filter(lib => lib.libraryType === 'VERTICAL_ADS'));
    } catch (err) {
      setError('Error fetching libraries');
    }
  };

  const fetchVerticals = async () => {
    try {
      const response = await axios.get('http://173.230.134.186:5000/api/verticals');
      setVerticals(response.data);
    } catch (err) {
      setError('Error fetching verticals');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://173.230.134.186:5000/api/advertising-content', {
        ...formData,
        duration: parseInt(formData.duration),
        dailyStartHour: parseInt(formData.dailyStartHour),
        dailyEndHour: parseInt(formData.dailyEndHour),
        minPlaysPerDay: parseInt(formData.minPlaysPerDay),
        maxPlaysPerDay: parseInt(formData.maxPlaysPerDay),
        libraries: selectedLibraries
      });

      setSuccess('Advertising content created successfully');
      setTimeout(() => navigate('/content'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating advertising content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        New Advertising Content
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

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Campaign"
            value={formData.campaign}
            onChange={(e) => setFormData({...formData, campaign: e.target.value})}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Client"
            value={formData.client}
            onChange={(e) => setFormData({...formData, client: e.target.value})}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
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

        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label="Start Date"
            value={formData.startDate}
            onChange={(newValue) => setFormData({...formData, startDate: newValue})}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label="End Date"
            value={formData.endDate}
            onChange={(newValue) => setFormData({...formData, endDate: newValue})}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Daily Start Hour (0-23)"
            type="number"
            value={formData.dailyStartHour}
            onChange={(e) => setFormData({...formData, dailyStartHour: e.target.value})}
            inputProps={{ min: 0, max: 23 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Daily End Hour (0-23)"
            type="number"
            value={formData.dailyEndHour}
            onChange={(e) => setFormData({...formData, dailyEndHour: e.target.value})}
            inputProps={{ min: 0, max: 23 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Min Plays Per Day"
            type="number"
            value={formData.minPlaysPerDay}
            onChange={(e) => setFormData({...formData, minPlaysPerDay: e.target.value})}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Max Plays Per Day"
            type="number"
            value={formData.maxPlaysPerDay}
            onChange={(e) => setFormData({...formData, maxPlaysPerDay: e.target.value})}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Vertical Restrictions</InputLabel>
            <Select
              multiple
              value={formData.verticalRestrictions}
              onChange={(e) => setFormData({...formData, verticalRestrictions: e.target.value})}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={verticals.find(v => v.id === value)?.name || value} />
                  ))}
                </Box>
              )}
            >
              {verticals.map((vertical) => (
                <MenuItem key={vertical.id} value={vertical.id}>
                  {vertical.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
            }
            label="Active"
          />
        </Grid>

        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Advertising Content'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewAdvertisingContent; 