'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AddBeerForm from '@/components/AddBeerForm'
import BeerList from '@/components/BeerList'
import type { Beer } from '@/types/beer'

export default function Home() {
  const [beers, setBeers] = useState<Beer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBeers = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('beers')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setBeers(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch beers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBeers()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          🍺 Beer Inventory
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <AddBeerForm onBeerAdded={fetchBeers} />
          </div>

          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading beers...</p>
              </div>
            ) : (
              <BeerList beers={beers} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
