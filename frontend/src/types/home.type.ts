export interface Hotel {
    name: string
    location: string
    price: number
    rating: number
    imageUrl: string
  }
  
  export interface NewsArticle {
    title: string
    excerpt: string
    readTime: string
    date: string
    imageUrl: string
  }
  
  export interface Review {
    text: string
    author: string
    rating: number
    avatarUrl: string
}