import React, { FC } from 'react';
import { Modal } from '@mui/material';
import RegForm from './RegForm';

interface IModalUser {
  open: boolean;
  handleClose: () => void;
  token: string;
  userId: string;
  userName: string;
  login: string;
}

const ModalProfile: FC<IModalUser> = ({ open, handleClose, token, userId, userName, login }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <RegForm
        type="signup"
        handleClose={handleClose}
        userId={userId}
        token={token}
        userName={userName}
        login={login}
      />
    </Modal>
  );
};

export default ModalProfile;
