import LanguageIcon from '@mui/icons-material/Language';
import { Button, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';

const LangSwitcher = () => {
  const [item, setItem] = useState<null | HTMLElement>(null);
  const [lang, setLang] = useState<string>('EN');
  const open = Boolean(item);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setItem(event.currentTarget);
  };

  const handleClose = () => {
    setItem(null);
  };

  const handleCloseEn = () => {
    setItem(null);
    setLang('EN');
  };

  const handleCloseRu = () => {
    setItem(null);
    setLang('RU');
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleClick}
      >
        {lang}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={item}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleCloseEn}>EN</MenuItem>
        <MenuItem onClick={handleCloseRu}>RU</MenuItem>
      </Menu>
    </div>
  );
};

export default LangSwitcher;
