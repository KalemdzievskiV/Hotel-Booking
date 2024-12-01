'use client'

import { TextField, Button, InputAdornment, Box } from '@mui/material'
import { CalendarToday, LocationOn, Person } from '@mui/icons-material'
import { SearchBar } from './search-bar'

export function Hero() {
  return (
    <div className="relative bg-[#4A5D4A] text-white py-16">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-serif mb-4">
            Your Gateway to Comfort and Convenience.
          </h1>
          <p className="mb-8">Book now and get the best prices</p>
          
          <div className="bg-white p-4 rounded-lg shadow-lg">
              <SearchBar />
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-full overflow-hidden">
            <img
              src="https://i.pinimg.com/736x/22/8c/27/228c2795054e244c5903a7904f242c81.jpg"
              alt="Hotel"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
