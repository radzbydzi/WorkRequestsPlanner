import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, Divider, Modal, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { BetweenShift, RequestState } from '../types/RequestType';
import { SelectInputProps } from '@mui/material/Select/SelectInput';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid2';

interface BetweenRequestFieldProps {
  value: BetweenShift | undefined
  onChange?: (value: BetweenShift | undefined) => void;
}

function BetweenRequestField(props: BetweenRequestFieldProps) {
  const [state, setState] = useState<BetweenShift | undefined>(undefined);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [invalidTime, setInvalidTime] = useState<boolean>(false);
  const timeFrom = useRef<HTMLInputElement>(null);
  const timeTo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(props.onChange) {
      props.onChange(state);
    }
  }, [state]);

  useEffect(() => {
    setState(props.value);
  }, []);

  function saveTime() {
    const from = timeFrom.current?.value;
    const to = timeTo.current?.value;
    if (to && from) {
      const newState = {timeFrom: from, timeTo: to} as BetweenShift
      setState(newState);
      hideModal();
    } else {
      setInvalidTime(true);
    }
  }
  function showButton() {
    const style = {
      width: "5.5em", 
      height: "2em", 
      alignContent: "center", 
      textAlign: "center" , 
      cursor: "pointer",
      userSelect: "none"
    } as React.CSSProperties;

    if(props.value && props.value.timeFrom && props.value.timeTo) {
      return <Paper elevation={9} style={{...style, backgroundColor: "green"}} 
          onClick={() => {
            setState(undefined);
          }}>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
              <small style={{fontSize: "10px"}}>{`${props.value.timeFrom} - ${props.value.timeTo}`}</small>
              <DeleteIcon fontSize="small"/>
            </Stack>
        </Paper>
    } else {
      return <Paper 
        elevation={1} 
        style={{...style, backgroundColor: "WhiteSmoke"}}
        onClick={() => {
          showModal(<>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Wybierz godziny międzyzmiany
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <p>Od</p>
            <input id="timeFrom" aria-label="Time" type="time" ref={timeFrom} />
            <p>Do</p>
            <input id="timeTo" aria-label="Time" type="time" ref={timeTo}/>

            <Grid container spacing={1}>
              <Grid size={7}>
              </Grid>
              <Grid size={3}>
                <Stack direction={"row"} spacing={3}>
                  <Button variant="outlined" onClick={hideModal}>Cancel</Button>
                  <Button variant="contained" onClick={saveTime}>Save</Button>
                </Stack>
              </Grid>
            </Grid>
            </Typography>
          </>)
        }}
      >
      <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
        <small style={{fontSize: "10px"}}>Wybierz godziny</small>
      </Stack>
      </Paper>
    }
  }

  const showModal = (inside: ReactNode) => {
    setModalContent(inside);
    setModalOpened(true);
  }

  const hideModal = () => {
    setModalContent(null);
    setModalOpened(false);
  }

  return <>
    {showButton()}
    <Modal
      open={modalOpened}
      onClose={() =>  hideModal()}
    >
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4
      }}>
        {modalContent}
      </Box>
    </Modal>
    <Snackbar open={invalidTime} autoHideDuration={6000} onClose={() => setInvalidTime(false)}>
      <Alert
        onClose={() => setInvalidTime(false)}
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
      >
        Wypełnij obie godziny!
      </Alert>
    </Snackbar>
  </>
}

export default BetweenRequestField;
