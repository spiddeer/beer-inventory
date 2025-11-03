'use client'

import type { Beer } from '@/types/beer'

interface StatisticsProps {
  beers: Beer[]
}

export default function Statistics({ beers }: StatisticsProps) {
  const totalBeers = beers.length
  const avgAbv = beers.length > 0 
    ? (beers.filter(b => b.abv !== null).reduce((sum, b) => sum + (b.abv || 0), 0) / beers.filter(b => b.abv !== null).length).toFixed(1)
    : '0'
  const avgIbu = beers.length > 0
    ? Math.round(beers.filter(b => b.ibu !== null).reduce((sum, b) => sum + (b.ibu || 0), 0) / beers.filter(b => b.ibu !== null).length)
    : 0

  const beerTypes = beers.reduce((acc, beer) => {
    if (beer.type) {
      acc[beer.type] = (acc[beer.type] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const topType = Object.entries(beerTypes).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg border border-amber-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        📊 Statistics
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-amber-100 dark:border-gray-700">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{totalBeers}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Beers</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-amber-100 dark:border-gray-700">
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{avgAbv}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg ABV</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-amber-100 dark:border-gray-700">
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{avgIbu}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg IBU</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-amber-100 dark:border-gray-700">
          <p className="text-lg font-bold text-amber-700 dark:text-amber-300 truncate">
            {topType ? topType[0] : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Top Type</p>
        </div>
      </div>
    </div>
  )
}
