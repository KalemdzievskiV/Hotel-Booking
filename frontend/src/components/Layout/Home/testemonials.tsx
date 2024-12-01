'use client'

import { Avatar, Rating } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Review } from '../../../types/home.type'

const reviews: Review[] = [
  {
    text: "The app has a user-friendly interface, so I was quickly able to find hotels that fit our needs. I can see photos of the room, available amenities, and reviews from previous guests, which helps me make an informed decision.",
    author: "Khomarun Balman",
    rating: 4.9,
    avatarUrl: "/placeholder.svg"
  }
]

export function Testimonials() {
  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-4xl font-serif text-center mb-12">
        What Our Customer Says
      </h2>
      
      <div className="max-w-3xl mx-auto relative">
        <button className="absolute left-0 top-1/2 -translate-y-1/2">
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        {reviews.map((review) => (
          <div key={review.author} className="text-center">
            <p className="text-lg mb-8">{review.text}</p>
            <Avatar
              src={review.avatarUrl}
              alt={review.author}
              className="mx-auto mb-4"
              sx={{ width: 64, height: 64 }}
            />
            <h3 className="font-semibold mb-2">{review.author}</h3>
            <Rating value={review.rating} readOnly precision={0.1} />
          </div>
        ))}
        
        <button className="absolute right-0 top-1/2 -translate-y-1/2">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </section>
  )
}

