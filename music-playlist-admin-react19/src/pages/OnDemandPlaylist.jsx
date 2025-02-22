// src/pages/OnDemandPlaylist.jsx

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { 
  MusicNote, 
  Campaign, 
  Radio,
  Refresh,
  Download,
  PieChart
} from '@mui/icons-material';
import axios from 'axios';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';

const OnDemandPlaylist = () => {
  const [station, setStation] = useState('');
  const [stations, setStations] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    musicFormats: [],
    adCampaigns: [],
    stationContent: []
  });
  const [filters, setFilters] = useState({
    contentTypes: ['MUSIC', 'ADVERTISING', 'STATION'],
    startHour: '',
    endHour: ''
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get('http://173.230.134.186:5000/api/stations');
      setStations(response.data);
    } catch (err) {
      setError('Error fetching stations');
    }
  };

  const generatePlaylist = async () => {
    if (!station) {
      setError('Please select a station');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://173.230.134.186:5000/api/playlists/generate', {
        stationId: station,
        filters
      });

      setPlaylist(response.data.items);
      setStats({
        musicFormats: response.data.stats.musicFormats,
        adCampaigns: response.data.stats.adCampaigns,
        stationContent: response.data.stats.stationContent
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error generating playlist');
    } finally {
      setLoading(false);
    }
  };

  const downloadM3U = async () => {
    try {
      const response = await axios.get(
        `http://173.230.134.186:5000/api/playlists/${station}/m3u`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `playlist_${station}.m3u`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Error downloading M3U file');
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'MUSIC':
        return <MusicNote color="primary" />;
      case 'ADVERTISING':
        return <Campaign color="secondary" />;
      case 'STATION':
        return <Radio color="action" />;
      default:
        return null;
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Generate On-Demand Playlist
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Station</InputLabel>
              <Select
                value={station}
                onChange={(e) => setStation(e.target.value)}
              >
                {stations.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Content Types</InputLabel>
              <Select
                multiple
                value={filters.contentTypes}
                onChange={(e) => setFilters({...filters, contentTypes: e.target.value})}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value} 
                        icon={getContentTypeIcon(value)}
                      />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="MUSIC">Music</MenuItem>
                <MenuItem value="ADVERTISING">Advertising</MenuItem>
                <MenuItem value="STATION">Station Content</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              onClick={generatePlaylist}
              disabled={loading}
              startIcon={<Refresh />}
            >
              {loading ? 'Generating...' : 'Generate Playlist'}
            </Button>

            {playlist.length > 0 && (
              <Button
                variant="outlined"
                fullWidth
                onClick={downloadM3U}
                sx={{ mt: 2 }}
                startIcon={<Download />}
              >
                Download M3U
              </Button>
            )}
          </Paper>

          {playlist.length > 0 && (
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Format Distribution
              </Typography>
              
              <RechartsPieChart width={300} height={200}>
                <Pie
                  data={stats.musicFormats}
                  dataKey="percentage"
                  nameKey="format"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                >
                  {stats.musicFormats.map((entry, index) => (
                    <Cell key={entry.format} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip />
              </RechartsPieChart>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : playlist.length > 0 ? (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playlist.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Tooltip title={item.contentType}>
                          {getContentTypeIcon(item.contentType)}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {new Date(item.scheduledTime).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}</TableCell>
                      <TableCell>
                        {item.contentType === 'MUSIC' && (
                          <Typography variant="body2" color="textSecondary">
                            {item.artist} - {item.format}
                          </Typography>
                        )}
                        {item.contentType === 'ADVERTISING' && (
                          <Typography variant="body2" color="textSecondary">
                            Campaign: {item.campaign}
                          </Typography>
                        )}
                        {item.contentType === 'STATION' && (
                          <Typography variant="body2" color="textSecondary">
                            {item.cartType}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              Generate a playlist to see content here
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default OnDemandPlaylist;
