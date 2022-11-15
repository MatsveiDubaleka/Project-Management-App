import React from 'react';
import { Slide, useScrollTrigger } from '@mui/material';
import { HeaderSliderType } from 'types/types';

function HeaderSlider(props: HeaderSliderType) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children}
    </Slide>
  );
}

export default HeaderSlider;
