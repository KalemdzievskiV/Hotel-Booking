'use client'

import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  InputAdornment,
  Stack,
  Box,
  IconButton,
  Popover,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday,
  Person,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export function SearchBar() {
  const [checkIn, setCheckIn] = useState<dayjs.Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<dayjs.Dayjs | null>(null);
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<HTMLElement | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleGuestsClick = (event: React.MouseEvent<HTMLElement>) => {
    setGuestsAnchorEl(event.currentTarget);
  };

  const handleGuestsClose = () => {
    setGuestsAnchorEl(null);
  };

  const guestsOpen = Boolean(guestsAnchorEl);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper className="p-4 shadow-lg rounded-lg bg-white">
        <Stack spacing={2}>
          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Search destinations..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-500" />
                </InputAdornment>
              ),
              className: "rounded-lg"
            }}
          />

          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="Check-in"
              value={checkIn}
              onChange={(newValue) => setCheckIn(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday className="text-gray-500" />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
            <DatePicker
              label="Check-out"
              value={checkOut}
              onChange={(newValue) => setCheckOut(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday className="text-gray-500" />
                      </InputAdornment>
                    ),
                  },
                },
              }}
            />
          </div>

          {/* Guests Selector */}
          <div>
            <TextField
              fullWidth
              value={`${adults + children} Guest${adults + children !== 1 ? 's' : ''}`}
              onClick={handleGuestsClick}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="text-gray-500" />
                  </InputAdornment>
                ),
                readOnly: true,
                className: "cursor-pointer"
              }}
            />
            <Popover
              open={guestsOpen}
              anchorEl={guestsAnchorEl}
              onClose={handleGuestsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              className="mt-2"
            >
              <Box className="p-4 min-w-[250px]">
                {/* Adults */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography variant="subtitle1">Adults</Typography>
                    <Typography variant="body2" color="text.secondary">Ages 13+</Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton 
                      size="small"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="border border-gray-300"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography>{adults}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => setAdults(adults + 1)}
                      className="border border-gray-300"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="subtitle1">Children</Typography>
                    <Typography variant="body2" color="text.secondary">Ages 0-12</Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton
                      size="small"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="border border-gray-300"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography>{children}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => setChildren(children + 1)}
                      className="border border-gray-300"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              </Box>
            </Popover>
          </div>

          {/* Search Button */}
          <Button
            variant="contained"
            size="large"
            className="bg-[#4A5D4A] hover:bg-[#3A4D3A] text-white py-3 rounded-lg"
          >
            Search
          </Button>
        </Stack>
      </Paper>
    </LocalizationProvider>
  );
}
