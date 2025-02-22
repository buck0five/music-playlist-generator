import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Paper,
  TableContainer,
  Tooltip,
  Alert
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  MusicNote, 
  Campaign, 
  Radio,
  PlayArrow 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartList = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await axios.get('http://173.230.134.186:5000/api/carts');
      setCarts(response.data);
    } catch (err) {
      setError('Error fetching carts');
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
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

  const getCartTypeChipColor = (cartType) => {
    switch (cartType) {
      case 'FRC1':
        return 'error';
      case 'SID1':
      case 'JIN1':
        return 'primary';
      case 'VEN1':
      case 'SVC1':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cart?')) {
      try {
        await axios.delete(`http://173.230.134.186:5000/api/carts/${id}`);
        fetchCarts();
      } catch (err) {
        setError('Error deleting cart');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Content Carts</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/carts/new')}
        >
          Create New Cart
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Station</TableCell>
              <TableCell>Content Types</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carts.map((cart) => (
              <TableRow key={cart.id}>
                <TableCell>{cart.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={cart.cartType} 
                    color={getCartTypeChipColor(cart.cartType)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {cart.station?.name || 'Global'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {cart.contentTypes.map((type) => (
                      <Tooltip key={type} title={type}>
                        {getContentTypeIcon(type)}
                      </Tooltip>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{cart.itemCount}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => navigate(`/carts/${cart.id}`)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(cart.id)}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                  <IconButton 
                    onClick={() => navigate(`/carts/${cart.id}/preview`)}
                    size="small"
                    color="primary"
                  >
                    <PlayArrow />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CartList;
