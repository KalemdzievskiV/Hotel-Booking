'use client'

import { Card, CardContent, CardMedia, Rating } from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import { Hotel } from '../../../types/home.type'

const popularHotels: Hotel[] = [
  {
    name: "Capital Business Hotel",
    location: "Bali, Indonesia",
    price: 1200,
    rating: 4.9,
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    name: "Hotel Super Winer 96",
    location: "Bali, Indonesia",
    price: 1199,
    rating: 4.9,
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    name: "Super Gotel Collection",
    location: "Tulungagung, Indonesia",
    price: 1099,
    rating: 4.9,
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
]

export function PopularHotels() {
  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-4xl font-serif mb-4">
        Our Popular Hotels We Recommend for You
      </h2>
      <p className="text-gray-600 mb-8">
        We offers a curated selection of exceptional hotels that cater to your preferences and ensure a delightful stay.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8">
        {popularHotels.map((hotel) => (
          <Card key={hotel.name} className="hover:shadow-lg transition-shadow">
            <CardMedia
              component="img"
              height="200"
              image={hotel.imageUrl}
              alt={hotel.name}
              className="h-48 object-cover"
            />
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <LocationOn className="text-sm" />
                <span className="text-sm">{hotel.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-[#4A5D4A]">${hotel.price}</span>
                  <span className="text-gray-600">/night</span>
                </div>
                <Rating value={hotel.rating} readOnly precision={0.1} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

