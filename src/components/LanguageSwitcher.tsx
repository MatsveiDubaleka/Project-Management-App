import LanguageIcon from '@mui/icons-material/Language';
import { Button, FormControl, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';
import { availableLanguages } from '../utils/i18n';

const LangSwitcher: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const { t, i18n } = useTranslation();

  return (
    <>
      <Button
        id="basic-button"
        sx={{ position: 'absolute', zIndex: 100, ml: '10px' }}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleOpen}
      >
        {i18n.language}
      </Button>
      <FormControl sx={{ minWidth: 120 }}>
        <Select
          id="basic-select"
          open={open}
          onClose={handleClose}
          value=""
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          {availableLanguages.map((language) => (
            <MenuItem value={language} key={language}>
              {language}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default LangSwitcher;
