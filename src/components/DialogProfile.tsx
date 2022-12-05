import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { deleteUser } from 'api/usersServices';
import { Endpoint } from 'constants/endpoints';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store/hook';
import { setModal, setValidation } from 'store/slices/authSlice';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';

interface IUpdateUserDialog {
  userId: string;
  token: string;
  open: boolean;
  handleClose: () => void;
}

export const DialogProfile: React.FC<IUpdateUserDialog> = ({
  userId,
  token,
  open,
  handleClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleDeleteUser = async () => {
    const deletedUser = await deleteUser(userId, token);
    deletedUser._id === userId ? localStorage.setItem(`${LOCAL_STORAGE_DATA}`, '') : null;
    dispatch(setValidation(false));
    dispatch(setModal(''));
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
      <DialogTitle
        sx={{ bgcolor: 'lightgray' }}
        id="responsive-dialog-title"
        variant="h5"
        component="h2"
      >
        {'Confirm delete an account'}
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'lightgray' }}>
        <DialogContentText>{t('deleteAccount')}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'lightgray' }}>
        <Button variant="contained" onClick={handleDeleteUser}>
          {t('delete')}
        </Button>
        <Button color="warning" variant="contained" autoFocus onClick={handleClose}>
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
