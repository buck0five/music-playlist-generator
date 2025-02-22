// src/pages/ContentList.jsx
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  MusicNote, 
  Campaign, 
  Radio,
  Edit, 
  Delete,
  Add,
  FilterList 
} from '@mui/icons-material';
import { useConfirm } from '../hooks/useConfirm';
import NewContentDialog from '../components/NewContentDialog';
import ContentFilterDialog from '../components/ContentFilterDialog';
import { formatDuration } from '../utils/formatters';

const ContentList = () => {
  const [activeTab, setActiveTab] = useState('music');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const { confirm, ConfirmationDialog } = useConfirm(); // Updated from const confirm = useConfirm()

  useEffect(() => {
    fetchContent();
  }, [activeTab, filters]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/${activeTab}Content?${queryParams}`);
      const data = await response.json();
      setContent(data.items.map(item => ({
        ...item,
        formattedDuration: formatDuration(item.duration)
      })));
    } catch (error) {
      console.error('Error fetching content:', error);
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Delete Content',
      message: `Are you sure you want to delete this ${activeTab} content? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await fetch(`/api/${activeTab}Content/${id}`, { 
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          fetchContent();
        } catch (error) {
          console.error('Error deleting content:', error);
        }
      }
    });
  };

  const handleEdit = (id) => {
    // Navigate to edit page
    window.location.href = `/content/${activeTab}/${id}/edit`;
  };

  const musicColumns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'artist', headerName: 'Artist', flex: 1 },
    { field: 'album', headerName: 'Album', flex: 1 },
    { 
      field: 'formats', 
      headerName: 'Formats', 
      flex: 0.7,
      renderCell: (params) => params.value.join(', ')
    },
    { 
      field: 'formattedDuration', 
      headerName: 'Duration', 
      flex: 0.5,
      valueGetter: (params) => params.row.formattedDuration
    },
    { 
      field: 'energyLevel', 
      headerName: 'Energy', 
      flex: 0.5,
      type: 'number'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const advertisingColumns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'campaign', headerName: 'Campaign', flex: 1 },
    { field: 'client', headerName: 'Client', flex: 1 },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      flex: 0.7,
      type: 'singleSelect',
      valueOptions: ['low', 'medium', 'high']
    },
    { 
      field: 'formattedDuration', 
      headerName: 'Duration', 
      flex: 0.5 
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 0.7,
      type: 'date'
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 0.7,
      type: 'date'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const stationColumns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { 
      field: 'type', 
      headerName: 'Type', 
      flex: 0.7,
      type: 'singleSelect',
      valueOptions: ['ID', 'WEATHER', 'NEWS', 'PROMO']
    },
    { field: 'station', headerName: 'Station', flex: 1 },
    { 
      field: 'formattedDuration', 
      headerName: 'Duration', 
      flex: 0.5 
    },
    { 
      field: 'usageCount', 
      headerName: 'Usage', 
      flex: 0.5,
      type: 'number'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const getColumns = () => {
    switch (activeTab) {
      case 'music':
        return musicColumns;
      case 'advertising':
        return advertisingColumns;
      case 'station':
        return stationColumns;
      default:
        return [];
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Content Management
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab 
            value="music" 
            label="Music" 
            icon={<MusicNote />} 
            iconPosition="start"
          />
          <Tab 
            value="advertising" 
            label="Advertising" 
            icon={<Campaign />} 
            iconPosition="start"
          />
          <Tab 
            value="station" 
            label="Station" 
            icon={<Radio />} 
            iconPosition="start"
          />
        </Tabs>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDialogOpen(true)}
            sx={{ mr: 2 }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content
          </Button>
        </Box>
      </Box>

      <DataGrid
        rows={content}
        columns={getColumns()}
        loading={loading}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        sx={{ 
          backgroundColor: 'background.paper',
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      />

      <NewContentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        contentType={activeTab}
        onSave={fetchContent}
      />

      <ContentFilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        contentType={activeTab}
        filters={filters}
        onApplyFilters={setFilters}
      />

      <ConfirmationDialog /> {/* Added ConfirmationDialog component */}
    </Box>
  );
};

export default ContentList;
