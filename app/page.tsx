// app/page.tsx
import HeroSection from '@/components/hero-section'
import ValuesSection from '@/components/values-section'
import NewsSection from '@/components/news-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ValuesSection />
      <NewsSection />
    </>
  )
}
