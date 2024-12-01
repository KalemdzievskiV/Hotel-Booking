'use client'

import { Card, CardContent, CardMedia } from '@mui/material'
import { AccessTime } from '@mui/icons-material'
import { NewsArticle } from '../../../types/home.type'

const newsArticles: NewsArticle[] = [
  {
    title: "The Rise of Boutique Hotels: Unveiling Unique and Personalized Hospitality",
    excerpt: "Explore the growing phenomenon of boutique hotels offering unique and personalized hospitality experiences...",
    readTime: "4 min read",
    date: "24 June 2023",
    imageUrl: "/placeholder.svg"
  },
  // Add more articles here
]

export function NewsSection() {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-serif">Our Hot News</h2>
        <button className="text-[#4A5D4A] font-semibold">SHOW MORE →</button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {newsArticles.map((article) => (
          <Card key={article.title} className="hover:shadow-lg transition-shadow">
            <CardMedia
              component="img"
              height="200"
              image={article.imageUrl}
              alt={article.title}
              className="h-48 object-cover"
            />
            <CardContent>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <AccessTime className="text-sm" />
                <span className="text-sm">{article.readTime}</span>
                <span className="text-sm">{article.date}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600">{article.excerpt}</p>
              <button className="text-[#4A5D4A] font-semibold mt-4">Read More →</button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

