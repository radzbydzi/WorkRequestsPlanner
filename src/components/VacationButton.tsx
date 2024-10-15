import React, { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import { PlanRequestEmoji } from '../utils/emojis';

interface VacationButtonProps {
  value: boolean;
  onChange?: (value: boolean) => void;
}

function VacationButton(props: VacationButtonProps) {

  function showButton(value: string) {
    const checked = props.value;
    const style = {
      width: "1.5em", 
      height: "1.5em", 
      alignContent: "center", 
      textAlign: "center" , 
      cursor: "pointer",
      userSelect: "none",
      backgroundColor: !checked ? "WhiteSmoke" : "green",
    } as React.CSSProperties;

    return <Paper 
      elevation={1} 
      style={{...style}}
      onClick={() => {props.onChange && props.onChange(!checked)}}
      >
        {value}
    </Paper>
  }

  return showButton(PlanRequestEmoji.Vacation);
}

export default VacationButton;
