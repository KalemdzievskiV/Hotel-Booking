import { HomeNavbar } from "./Layout/Home-NavBar";
import { Hero } from "./Layout/Home/hero";
import { Newsletter } from "./Layout/Home/news-letter";
import { NewsSection } from "./Layout/Home/news-section";
import { PopularHotels } from "./Layout/Home/popular-hotels";
import { Testimonials } from "./Layout/Home/testemonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HomeNavbar />
      <Hero />
      <PopularHotels />
      <NewsSection />
      <Testimonials />
      <Newsletter />
    </main>
  )
}