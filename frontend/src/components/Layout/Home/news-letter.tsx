'use client'

import { TextField, Button } from '@mui/material'

export function Newsletter() {
  return (
    <section className="bg-[#4A5D4A] text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-serif mb-8">
          Subscribe to News and Resources
        </h2>
        
        <div className="max-w-md mx-auto flex gap-2">
          <TextField
            fullWidth
            placeholder="youremail@gmail.com"
            variant="outlined"
            className="bg-white rounded-lg"
          />
          <Button
            variant="contained"
            className="bg-white text-[#4A5D4A] hover:bg-gray-100"
          >
            →
          </Button>
        </div>
      </div>
    </section>
  )
}
