// src/pages/EditCart.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Delete, 
  MusicNote, 
  Campaign, 
  Radio,
  Edit,
  Add
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';

function EditCart() {
  const { id } = useParams(); // cartId
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [cartName, setCartName] = useState('');
  const [category, setCategory] = useState('');
  const [stationId, setStationId] = useState('');
  const [rotationIndex, setRotationIndex] = useState(0);

  // cart items
  const [items, setItems] = useState([]);

  // new item fields
  const [newContentId, setNewContentId] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newDaysOfWeek, setNewDaysOfWeek] = useState('');
  const [newStartHour, setNewStartHour] = useState('');
  const [newEndHour, setNewEndHour] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [contentType, setContentType] = useState('MUSIC');
  const [availableContent, setAvailableContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState('');
  const [scheduleData, setScheduleData] = useState({
    startDate: null,
    endDate: null,
    daysOfWeek: [],
    startHour: '',
    endHour: ''
  });
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCartData();
  }, [id]);

  useEffect(() => {
    fetchAvailableContent();
  }, [contentType]);

  const fetchCartData = () => {
    setLoading(true);
    axios
      .get(`http://173.230.134.186:5000/api/carts/${id}`)
      .then((res) => {
        setLoading(false);
        if (!res.data || !res.data.cart) {
          setError('Cart not found');
          return;
        }
        const c = res.data.cart;
        const its = res.data.items || [];
        setCart(c);
        setItems(its);
        setCartName(c.name || '');
        setCategory(c.category || '');
        setStationId(c.stationId || '');
        setRotationIndex(c.rotationIndex || 0);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError('Error fetching cart');
      });
  };

  const fetchAvailableContent = () => {
    axios
      .get(`http://173.230.134.186:5000/api/${contentType.toLowerCase()}-content`)
      .then((res) => {
        setAvailableContent(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(`Error fetching ${contentType.toLowerCase()} content`);
      });
  };

  const handleSaveCart = () => {
    setSaving(true);
    axios
      .put(`http://173.230.134.186:5000/api/carts/${id}`, {
        name: cartName,
        category,
        stationId: stationId || null,
        rotationIndex: parseInt(rotationIndex, 10) || 0,
      })
      .then(() => {
        setSaving(false);
        fetchCartData();
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
        setError('Error updating cart');
      });
  };

  // Add new content item to cart
  const handleAddContent = () => {
    if (!selectedContent) {
      setError('Content ID is required');
      return;
    }
    setError('');
    axios
      .post(`http://173.230.134.186:5000/api/carts/${id}/add-content`, {
        contentType,
        contentId: selectedContent,
        ...scheduleData,
        startHour: scheduleData.startHour ? parseInt(scheduleData.startHour) : null,
        endHour: scheduleData.endHour ? parseInt(scheduleData.endHour) : null
      })
      .then(() => {
        setSelectedContent('');
        setScheduleData({
          startDate: null,
          endDate: null,
          daysOfWeek: [],
          startHour: '',
          endHour: ''
        });
        setSuccess('Content added successfully');
        setDialogOpen(false);
        fetchCartData();
      })
      .catch((err) => {
        console.error(err);
        setError('Error adding content to cart');
      });
  };

  // Remove pivot
  const handleRemoveItem = (contentId) => {
    axios
      .delete(`http://173.230.134.186:5000/api/carts/${id}/remove-content/${contentId}`)
      .then(() => {
        fetchCartData();
      })
      .catch((err) => {
        console.error(err);
        setError('Error removing content from cart');
      });
  };

  // Update item pivot scheduling
  const handleUpdateItem = (itemId, newFields) => {
    axios
      .put(`http://173.230.134.186:5000/api/carts/${id}/update-item/${itemId}`, newFields)
      .then(() => {
        fetchCartData();
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating cart item');
      });
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

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!cart) return <p>Cart not found</p>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Cart: {cartName}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Add Content
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={contentType}
          onChange={(e, newValue) => setContentType(newValue)}
        >
          <Tab 
            value="MUSIC" 
            label="Music" 
            icon={<MusicNote />} 
          />
          <Tab 
            value="ADVERTISING" 
            label="Advertising" 
            icon={<Campaign />} 
          />
          <Tab 
            value="STATION" 
            label="Station" 
            icon={<Radio />} 
          />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {getContentTypeIcon(item.contentType)}
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  {item.startDate && (
                    <Typography variant="body2">
                      {new Date(item.startDate).toLocaleDateString()} - 
                      {new Date(item.endDate).toLocaleDateString()}
                    </Typography>
                  )}
                  {item.daysOfWeek && (
                    <Typography variant="body2">
                      Days: {item.daysOfWeek.join(', ')}
                    </Typography>
                  )}
                  {item.startHour && (
                    <Typography variant="body2">
                      Hours: {item.startHour}:00 - {item.endHour}:00
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.active ? 'Active' : 'Inactive'}
                    color={item.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleRemoveItem(item.id)}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add {contentType} Content</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Content</InputLabel>
            <Select
              value={selectedContent}
              onChange={(e) => setSelectedContent(e.target.value)}
            >
              {availableContent.map((content) => (
                <MenuItem key={content.id} value={content.id}>
                  {content.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <DateTimePicker
              label="Start Date"
              value={scheduleData.startDate}
              onChange={(date) => setScheduleData({...scheduleData, startDate: date})}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <DateTimePicker
              label="End Date"
              value={scheduleData.endDate}
              onChange={(date) => setScheduleData({...scheduleData, endDate: date})}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Days of Week</InputLabel>
            <Select
              multiple
              value={scheduleData.daysOfWeek}
              onChange={(e) => setScheduleData({...scheduleData, daysOfWeek: e.target.value})}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <TextField
              label="Start Hour (0-23)"
              type="number"
              value={scheduleData.startHour}
              onChange={(e) => setScheduleData({...scheduleData, startHour: e.target.value})}
              inputProps={{ min: 0, max: 23 }}
              fullWidth
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              label="End Hour (0-23)"
              type="number"
              value={scheduleData.endHour}
              onChange={(e) => setScheduleData({...scheduleData, endHour: e.target.value})}
              inputProps={{ min: 0, max: 23 }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddContent} variant="contained">
            Add Content
          </Button>
        </DialogActions>
      </Dialog>

      <hr />
      {stationId && (
        <button onClick={() => navigate(`/stations/${stationId}/carts`)}>
          Back to Carts
        </button>
      )}
    </Box>
  );
}

export default EditCart;
