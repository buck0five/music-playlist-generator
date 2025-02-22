import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
// Simplified date picker imports
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ContentFilterDialog = ({ open, onClose, contentType, filters, onApplyFilters }) => {
  const [filterData, setFilterData] = useState(filters || {});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name) => (value) => {
    setFilterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    const cleanedFilters = Object.entries(filterData).reduce((acc, [key, value]) => {
      if (value !== '' && value != null) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onApplyFilters(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    setFilterData({});
    onApplyFilters({});
    onClose();
  };

  const renderMusicFilters = () => (
    <>
      <TextField
        name="artist"
        label="Artist"
        value={filterData.artist || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="album"
        label="Album"
        value={filterData.album || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Format</InputLabel>
        <Select
          name="format"
          value={filterData.format || ''}
          onChange={handleChange}
          label="Format"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="MP3">MP3</MenuItem>
          <MenuItem value="WAV">WAV</MenuItem>
          <MenuItem value="FLAC">FLAC</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="minEnergy"
        label="Minimum Energy Level"
        type="number"
        value={filterData.minEnergy || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{ min: 1, max: 10 }}
      />
      <TextField
        name="maxEnergy"
        label="Maximum Energy Level"
        type="number"
        value={filterData.maxEnergy || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputProps={{ min: 1, max: 10 }}
      />
    </>
  );

  const renderAdvertisingFilters = () => (
    <>
      <TextField
        name="campaign"
        label="Campaign"
        value={filterData.campaign || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="client"
        label="Client"
        value={filterData.client || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={filterData.priority || ''}
          onChange={handleChange}
          label="Priority"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DatePicker
              label="Start Date From"
              value={filterData.startDateFrom || null}
              onChange={handleDateChange('startDateFrom')}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Start Date To"
              value={filterData.startDateTo || null}
              onChange={handleDateChange('startDateTo')}
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );

  const renderStationFilters = () => (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select
          name="type"
          value={filterData.type || ''}
          onChange={handleChange}
          label="Type"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="ID">ID</MenuItem>
          <MenuItem value="WEATHER">Weather</MenuItem>
          <MenuItem value="NEWS">News</MenuItem>
          <MenuItem value="PROMO">Promo</MenuItem>
        </Select>
      </FormControl>
      <TextField
        name="station"
        label="Station"
        value={filterData.station || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Filter {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content
      </DialogTitle>
      <DialogContent>
        <TextField
          name="title"
          label="Title"
          value={filterData.title || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="durationMin"
          label="Min Duration (seconds)"
          type="number"
          value={filterData.durationMin || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0 }}
        />
        <TextField
          name="durationMax"
          label="Max Duration (seconds)"
          type="number"
          value={filterData.durationMax || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0 }}
        />
        {contentType === 'music' && renderMusicFilters()}
        {contentType === 'advertising' && renderAdvertisingFilters()}
        {contentType === 'station' && renderStationFilters()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>Clear Filters</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContentFilterDialog;
