import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

export const useConfirm = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });

  const onConfirm = useCallback(() => {
    options.onConfirm();
    setOpen(false);
  }, [options]);

  const onCancel = useCallback(() => {
    options.onCancel && options.onCancel();
    setOpen(false);
  }, [options]);

  const confirm = useCallback((options = {}) => {
    setOptions({
      title: options.title || 'Confirm',
      message: options.message || 'Are you sure?',
      onConfirm: options.onConfirm || (() => {}),
      onCancel: options.onCancel,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel'
    });
    setOpen(true);
  }, []);

  const ConfirmationDialog = useCallback(() => (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{options.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {options.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {options.cancelText}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
          {options.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  ), [open, options, onCancel, onConfirm]);

  return {
    confirm,
    ConfirmationDialog
  };
};
