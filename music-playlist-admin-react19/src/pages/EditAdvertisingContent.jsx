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
  Grid,
  Paper,
  FormControlLabel,
  Switch,
  LinearProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const EditAdvertisingContent = () => {
  const { id } = useParams();
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

  const [performance, setPerformance] = useState({
    totalPlays: 0,
    playsPerDay: [],
    playsPerStation: [],
    playsPerHour: []
  });

  const [libraries, setLibraries] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [selectedLibraries, setSelectedLibraries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLibraries();
    fetchVerticals();
    fetchAdvertisingContent();
  }, [id]);

  const fetchAdvertisingContent = async () => {
    try {
      const response = await axios.get(`http://173.230.134.186:5000/api/advertising-content/${id}`);
      const content = response.data;
      
      setFormData({
        title: content.title,
        campaign: content.campaign,
        client: content.client,
        priority: content.priority,
        duration: content.duration,
        fileName: content.fileName,
        startDate: content.startDate,
        endDate: content.endDate,
        dailyStartHour: content.dailyStartHour,
        dailyEndHour: content.dailyEndHour,
        minPlaysPerDay: content.minPlaysPerDay,
        maxPlaysPerDay: content.maxPlaysPerDay,
        verticalRestrictions: content.verticalRestrictions || [],
        isActive: content.isActive
      });

      setPerformance({
        totalPlays: content.totalPlays || 0,
        playsPerDay: content.playsPerDay || [],
        playsPerStation: content.playsPerStation || [],
        playsPerHour: content.playsPerHour || []
      });

      setSelectedLibraries(content.libraries?.map(lib => lib.id) || []);
    } catch (error) {
      setError('Error loading advertising content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await axios.put(`http://173.230.134.186:5000/api/advertising-content/${id}`, {
        ...formData,
        libraries: selectedLibraries
      });

      setSuccess('Advertising content updated successfully');
      setTimeout(() => navigate('/content'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating advertising content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Advertising Content
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Form fields from NewAdvertisingContent.jsx */}
        ```jsx:music-playlist-admin-react19/src/pages/NewAdvertisingContent.jsx
        startLine: 98
        endLine: 235
        ```

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Campaign Performance
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                Total Plays: {performance.totalPlays}
              </Typography>
              
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Daily Play Distribution
              </Typography>
              <BarChart width={700} height={200} data={performance.playsPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="plays" fill="#8884d8" />
              </BarChart>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Station Distribution
              </Typography>
              <BarChart width={700} height={200} data={performance.playsPerStation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="station" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="plays" fill="#82ca9d" />
              </BarChart>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Hourly Distribution
              </Typography>
              <BarChart width={700} height={200} data={performance.playsPerHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="plays" fill="#ffc658" />
              </BarChart>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditAdvertisingContent; 