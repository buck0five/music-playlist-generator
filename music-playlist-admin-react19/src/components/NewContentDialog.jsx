import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Box
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const NewContentDialog = ({ open, onClose, contentType, onSave }) => {
  const initialState = {
    title: '',
    duration: '',
    // Music specific
    artist: '',
    album: '',
    formats: [],
    energyLevel: '',
    // Advertising specific
    campaign: '',
    client: '',
    priority: 'medium',
    startDate: null,
    endDate: null,
    // Station specific
    type: '',
    station: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/${contentType}Content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create content');
      }

      onSave();
      handleClose();
    } catch (error) {
      console.error('Error creating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialState);
    onClose();
  };

  const renderMusicFields = () => (
    <>
      <TextField
        name="artist"
        label="Artist"
        value={formData.artist}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="album"
        label="Album"
        value={formData.album}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Formats</InputLabel>
        <Select
          name="formats"
          multiple
          value={formData.formats}
          onChange={handleChange}
        >
          <MenuItem value="MP3">MP3</MenuItem>
          <MenuItem value="WAV">WAV</MenuItem>
          <MenuItem value="FLAC">FLAC</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="energyLevel"
        label="Energy Level"
        type="number"
        value={formData.energyLevel}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{ min: 1, max: 10 }}
      />
    </>
  );

  const renderAdvertisingFields = () => (
    <>
      <TextField
        name="campaign"
        label="Campaign"
        value={formData.campaign}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="client"
        label="Client"
        value={formData.client}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(newValue) => {
                setFormData(prev => ({ ...prev, startDate: newValue }));
              }}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(newValue) => {
                setFormData(prev => ({ ...prev, endDate: newValue }));
              }}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );

  const renderStationFields = () => (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <MenuItem value="ID">ID</MenuItem>
          <MenuItem value="WEATHER">Weather</MenuItem>
          <MenuItem value="NEWS">News</MenuItem>
          <MenuItem value="PROMO">Promo</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="station"
        label="Station"
        value={formData.station}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        New {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="duration"
            label="Duration (seconds)"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0 }}
          />
          {contentType === 'music' && renderMusicFields()}
          {contentType === 'advertising' && renderAdvertisingFields()}
          {contentType === 'station' && renderStationFields()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewContentDialog;
