// src/pages/PlaybackReport.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper, 
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  MusicNote, 
  Campaign, 
  Radio,
  FileDownload,
  PieChart
} from '@mui/icons-material';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';

const PlaybackReport = () => {
  const [station, setStation] = useState('');
  const [stations, setStations] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });
  const [contentType, setContentType] = useState('ALL');
  const [reportData, setReportData] = useState({
    playbacks: [],
    stats: {
      musicFormats: [],
      adCampaigns: [],
      stationContent: [],
      hourlyDistribution: []
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const generateReport = async () => {
    if (!station || !dateRange.start || !dateRange.end) {
      setError('Please select station and date range');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://173.230.134.186:5000/api/reports/playback', {
        stationId: station,
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
        contentType
      });

      setReportData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error generating report');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await axios.get(
        `http://173.230.134.186:5000/api/reports/playback/export`, {
          params: {
            stationId: station,
            startDate: dateRange.start.toISOString(),
            endDate: dateRange.end.toISOString(),
            contentType
          },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `playback_report_${station}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Error exporting report');
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Playback Report
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
              <InputLabel>Content Type</InputLabel>
              <Select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <MenuItem value="ALL">All Content</MenuItem>
                <MenuItem value="MUSIC">Music Only</MenuItem>
                <MenuItem value="ADVERTISING">Advertising Only</MenuItem>
                <MenuItem value="STATION">Station Content Only</MenuItem>
              </Select>
            </FormControl>

            <DatePicker
              label="Start Date"
              value={dateRange.start}
              onChange={(date) => setDateRange({...dateRange, start: date})}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
            />

            <DatePicker
              label="End Date"
              value={dateRange.end}
              onChange={(date) => setDateRange({...dateRange, end: date})}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={generateReport}
              disabled={loading}
            >
              Generate Report
            </Button>

            {reportData.playbacks.length > 0 && (
              <Button
                variant="outlined"
                fullWidth
                onClick={exportReport}
                sx={{ mt: 2 }}
                startIcon={<FileDownload />}
              >
                Export CSV
              </Button>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {reportData.playbacks.length > 0 && (
            <>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Hourly Distribution
                </Typography>
                <BarChart width={700} height={300} data={reportData.stats.hourlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="music" name="Music" fill="#8884d8" />
                  <Bar dataKey="advertising" name="Advertising" fill="#82ca9d" />
                  <Bar dataKey="station" name="Station" fill="#ffc658" />
                </BarChart>
              </Paper>

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
                    {reportData.playbacks.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Tooltip title={item.contentType}>
                            {getContentTypeIcon(item.contentType)}
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {new Date(item.playedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                        </TableCell>
                        <TableCell>
                          {item.contentType === 'MUSIC' && (
                            <Typography variant="body2" color="textSecondary">
                              {item.artist} - {item.format}
                            </Typography>
                          )}
                          {item.contentType === 'ADVERTISING' && (
                            <Typography variant="body2" color="textSecondary">
                              Campaign: {item.campaign} ({item.playCount} plays)
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
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaybackReport;
