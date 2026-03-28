export interface CryptoData {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  total_volume: number
  market_cap: number
  image: string
}

export async function getLiveCryptoData(): Promise<CryptoData[]> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false',
      { next: { revalidate: 60 } } // Revalidate every 60 seconds (ISR caching)
    )

    if (!res.ok) {
      console.warn("CoinGecko API rate limit reached or unavailable.")
      return []
    }

    const data: CryptoData[] = await res.json()
    return data
  } catch (error) {
    console.error('Network Error fetching crypto:', error)
    return []
  }
}
