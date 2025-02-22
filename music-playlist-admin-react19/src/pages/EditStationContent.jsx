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
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CONTENT_TYPES = {
  STATION_ID: 'Station ID',
  JINGLE: 'Jingle',
  ANNOUNCEMENT: 'Announcement',
  WEATHER: 'Weather Update',
  TIME_CHECK: 'Time Check'
};

const EditStationContent = () => {
  const { id } = useParams();
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

  const [usage, setUsage] = useState({
    totalPlays: 0,
    lastPlayed: null,
    scheduledPlays: [],
    playHistory: []
  });

  const [stations, setStations] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStations();
    fetchLibraries();
    fetchStationContent();
  }, [id]);

  const fetchStationContent = async () => {
    try {
      const response = await axios.get(`http://173.230.134.186:5000/api/station-content/${id}`);
      const content = response.data;
      
      setFormData({
        title: content.title,
        contentType: content.contentType,
        stationId: content.stationId,
        duration: content.duration,
        fileName: content.fileName,
        cartType: content.cartType,
        isRecurring: content.isRecurring,
        recurringInterval: content.recurringInterval
      });

      setUsage({
        totalPlays: content.totalPlays || 0,
        lastPlayed: content.lastPlayed,
        scheduledPlays: content.scheduledPlays || [],
        playHistory: content.playHistory || []
      });

      setSelectedLibraries(content.libraries?.map(lib => lib.id) || []);
    } catch (error) {
      setError('Error loading station content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await axios.put(`http://173.230.134.186:5000/api/station-content/${id}`, {
        ...formData,
        libraries: selectedLibraries
      });

      setSuccess('Station content updated successfully');
      setTimeout(() => navigate('/content'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating station content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Station Content
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Form fields from NewStationContent.jsx */}
        ```jsx:music-playlist-admin-react19/src/pages/NewStationContent.jsx
        startLine: 112
        endLine: 198
        ```

        {/* Usage Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Usage Statistics
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                Total Plays: {usage.totalPlays}
              </Typography>
              <Typography variant="body2">
                Last Played: {usage.lastPlayed ? new Date(usage.lastPlayed).toLocaleString() : 'Never'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Upcoming Schedule
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Station</TableCell>
                    <TableCell>Clock Template</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usage.scheduledPlays.map((play, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(play.scheduledTime).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(play.scheduledTime).toLocaleTimeString()}</TableCell>
                      <TableCell>{play.stationName}</TableCell>
                      <TableCell>{play.clockTemplateName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Play History
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Station</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usage.playHistory.map((play, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(play.playedAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(play.playedAt).toLocaleTimeString()}</TableCell>
                      <TableCell>{play.stationName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditStationContent; 