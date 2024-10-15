import React, { ChangeEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import useLocalStorage from 'use-local-storage';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { saveAs } from 'file-saver';
import { BetweenShift, PlanRequest, RequestEntity, RequestState } from './types/RequestType';
import Divider from '@mui/material/Divider';
import RequestCheckbox from './components/RequestCheckbox';
import BetweenRequestField from './components/BetweenRequestField';
import { generateWeeks, getMonthName } from './utils/CalendarUtils';
import VacationButton from './components/VacationButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ArrowDownward } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [request, setRequest] = useState<PlanRequest>();
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(2024);
  const [dateApplied, setDateApplied] = useState<boolean>();
  const [generatedWeeks, setGeneratedWeeks] = useState<(number | null)[][]>([]);

  function saveRequest() {
    const blob = new Blob([JSON.stringify(request)], {type: "application/json;charset=utf-8"});
    saveAs(blob, "requests.json");
  }
  
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log("No files")
      return;
    }
    const file = e.target.files[0];

    if(file) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = e => {
            const fileData = (e.target?.result as string) || "{}";
            const planRequest = JSON.parse(fileData) as PlanRequest;
            setMonth(planRequest.month);
            setYear(planRequest.year);
            setDateApplied(true);
            setRequest({...planRequest});
        };
    }
  };

  useEffect(()=> {
    if(dateApplied) {
      const weeks = generateWeeks(month,year);
      console.log(weeks);
      setGeneratedWeeks(weeks);
    }
  }, [dateApplied])

  useEffect(()=> {
    console.log("request", request)
  }, [request])


  type UpdateOptions = "morning" | "afternoon" | "between";
  const updateDay = async (day: number, updateOption: UpdateOptions, value: RequestState | (BetweenShift | undefined)) => {
    if(!request) {
      console.log("Undefined request");
      return;
    }
    
    const newRequest = request;
    const newRequests = newRequest.requests.map((req, reqId) => {
      if(reqId === day-1) {
        if(updateOption === "morning" || updateOption === "afternoon") {
          req.shifts = {
            ...req.shifts,
            [updateOption]: value as RequestState
          }
        } else {
          const bShift = value as (BetweenShift | undefined);
          if(bShift === undefined || (!bShift.timeFrom || !bShift.timeTo)) {
            delete req.shifts.between;
          } else {
            req.shifts.between = bShift;
          }
        }
      }
      return req;
    });
    newRequest.requests = newRequests;

    setRequest({...newRequest});
  }

  const updateDayVacation = (day: number, value: boolean) => {
    if(!request) {
      console.log("Undefined request");
      return;
    }

    const newRequest = request;
    const newRequests = newRequest.requests.map((req, reqId) => {
      if(reqId === day-1) {
        req.vacation = value;
      }
      return req;
    });
    newRequest.requests = newRequests;
    setRequest({...newRequest});
  }

  const drawTable = () => {
    if(!request) {
      return <b>Brak próśb</b>
    }

    const requests = request.requests;

    return <>
      <table border={1}>
        <tr>
          <td>Poniedziałek</td>
          <td>Wtorek</td>
          <td>Środa</td>
          <td>Czwartek</td>
          <td>Piątek</td>
          <td>Sobota</td>
          <td>Niedziela</td>
        </tr>
        {
          generatedWeeks.map(week => (
            <tr>
              {
                week.map(day => {
                  const style = {
                    padding: "0.5em",
                    backgroundColor: day && requests[day-1].vacation ? "dimgray" : ""
                  };

                  return <td style={style}>                  
                  {
                    day !== null && requests[day-1] && (
                      <>
                        <Grid container>
                          <Grid size={6}>
                            <b>{day}</b>
                          </Grid>
                          <Grid size={6}>
                            <VacationButton value={requests[day-1].vacation} onChange={(value) => updateDayVacation(day, value)}/>
                          </Grid>
                        </Grid>
                        {
                          !requests[day-1].vacation && (
                            <>
                              <div><small>Rano</small></div>
                              <RequestCheckbox value={requests[day-1].shifts.morning} onChange={(value) => updateDay(day, "morning", value)} />
                              <div><small>Popołudnie</small></div>
                              <RequestCheckbox value={requests[day-1].shifts.afternoon} onChange={(value) =>updateDay(day, "afternoon", value)} />
                              <div><small>Międzyzmiana</small></div>
                              <BetweenRequestField value={requests[day-1].shifts.between} onChange={(value) => updateDay(day, "between", value)}/>
                            </>
                          )
                        }
                      </>
                    )
                  }
                </td>
                })
              }
            </tr>
          ))
        }
      </table>
    </>
  }

  const onDateApplied = () => {
    const weeks = generateWeeks(month, year);
    setGeneratedWeeks(weeks);
    
    const blankRequests = weeks.map(week => {
      return week.filter(day => day !== null)
      .map(day => {
        return {
          day: day,
          vacation: false,
          shifts: {
            morning: "Available",
            afternoon: "Available",
          }
        } as RequestEntity
      })
    }).reduce((a, b) => ([...a, ...b]));

    setRequest({
      month,
      year,
      requests: blankRequests
    } as PlanRequest)
    setDateApplied(true);
  }

  return (
    <Grid container spacing={2} marginLeft={"20px"} marginRight={"20px"} marginTop={"20px"}>
      <Grid size={12}>
        <Grid size={12}>
          <Button 
            aria-label="Upload"
            component="label" 
            variant="outlined">
            Load
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleFileUpload}
              />
          </Button>

          <Button variant="outlined" onClick={() => saveRequest()}>Save as</Button>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
      </Grid>
      <Grid size={12}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDownward />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Jak używać?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <InputLabel id="month-label">Miesiąc</InputLabel>
        <Select
          labelId="month-label"
          value={month || 0}
          label="Miesiąc"
          onChange={(e) => setMonth(e.target.value as number)}
          disabled={dateApplied}
        >
        {
          Array.from(Array(12).keys()).map(val => <MenuItem value={val}>{getMonthName(val)}</MenuItem>)
        }
        </Select>
        <TextField label="Rok" variant="outlined" value={year || 2024} slotProps={{ input: {type: "number"} }}  
          onChange={(e) => setYear(Number.parseInt(e.target.value))} 
          disabled={dateApplied}/>
        <Button variant="outlined" onClick={onDateApplied}>Zatwierdź</Button>
      </Grid>
      {dateApplied &&
      <>
        <Grid size={9}>
            {drawTable()}
        </Grid>
      </>}
    </Grid>
  );
}

export default App;
