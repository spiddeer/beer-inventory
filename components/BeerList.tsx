'use client'

import type { Beer } from '@/types/beer'

interface BeerListProps {
  beers: Beer[]
}

export default function BeerList({ beers }: BeerListProps) {
  if (beers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No beers in inventory yet. Add your first beer!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Beer Inventory ({beers.length})</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {beers.map((beer) => (
          <div
            key={beer.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">{beer.name}</h3>
            
            {beer.brewery && (
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Brewery:</span> {beer.brewery}
              </p>
            )}
            
            {beer.type && (
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Type:</span> {beer.type}
              </p>
            )}
            
            <div className="flex gap-4 mt-2">
              {beer.abv !== null && (
                <p className="text-gray-600">
                  <span className="font-medium">ABV:</span> {beer.abv}%
                </p>
              )}
              
              {beer.ibu !== null && (
                <p className="text-gray-600">
                  <span className="font-medium">IBU:</span> {beer.ibu}
                </p>
              )}
            </div>
            
            {beer.notes && (
              <p className="text-gray-600 mt-3 pt-3 border-t border-gray-200">
                {beer.notes}
              </p>
            )}
            
            <p className="text-xs text-gray-400 mt-3">
              Added: {new Date(beer.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
