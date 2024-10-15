import React, { useEffect, useState } from 'react';
import { Button, Divider, Paper, Stack } from '@mui/material';
import { RequestState } from '../types/RequestType';
import { SelectInputProps } from '@mui/material/Select/SelectInput';
import { PlanRequestEmoji } from '../utils/emojis';

interface RequestCheckboxProps {
  value: RequestState;
  onChange?: (value: RequestState) => void;
}

function RequestCheckbox(props: RequestCheckboxProps) {

  function showButton(value: string, checkingValue: RequestState) {
    const checked = props.value === checkingValue;
    const style = {
      width: "1.5em", 
      height: "1.5em", 
      alignContent: "center", 
      textAlign: "center" , 
      cursor: "pointer",
      userSelect: "none"
    } as React.CSSProperties;

    if(!checked) {
      return <Paper 
      elevation={1} 
      style={{...style, backgroundColor: "WhiteSmoke"}}
      onClick={() => {props.onChange && props.onChange(checkingValue)}}
      >
        {value}
        </Paper>
    } else {
      return <Paper elevation={9} style={{...style, backgroundColor: "green"}}>{value}</Paper>
    }
  }

  return (
    <Stack direction="row"
        justifyContent={"center"}
        spacing={1}>
        {showButton(PlanRequestEmoji.Wanted, "Wanted")}
        {showButton(PlanRequestEmoji.Available, "Available")}
        {showButton(PlanRequestEmoji.Unavailable, "Unavailable")}
    </Stack>
  );
}

export default RequestCheckbox;
