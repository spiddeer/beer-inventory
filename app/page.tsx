'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import AddBeerForm from '@/components/AddBeerForm'
import BeerList from '@/components/BeerList'
import Statistics from '@/components/Statistics'
import Login from '@/components/Login'
import type { Beer } from '@/types/beer'

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [beers, setBeers] = useState<Beer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const fetchBeers = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('beers')
        .select('*')
        .eq('user_id', user.id)
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
    if (user) {
      fetchBeers()
    }
  }, [user])

  // Get unique beer types for filter
  const beerTypes = useMemo(() => {
    const types = new Set(beers.map(beer => beer.type).filter(Boolean))
    return Array.from(types).sort()
  }, [beers])

  // Filter beers based on search and type
  const filteredBeers = useMemo(() => {
    return beers.filter(beer => {
      const matchesSearch = 
        beer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beer.brewery?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beer.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beer.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = filterType === 'all' || beer.type === filterType
      
      return matchesSearch && matchesType
    })
  }, [beers, searchQuery, filterType])

  // Show login if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🍺</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
              🍺 Beer Inventory
            </h1>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
              title="Sign out"
            >
              Sign Out
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Welcome, {user.email}! Track and manage your beer collection
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Statistics */}
        {!loading && beers.length > 0 && (
          <div className="mb-8">
            <Statistics beers={beers} />
          </div>
        )}

        {/* Search and Filter */}
        {!loading && beers.length > 0 && (
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                <input
                  type="text"
                  placeholder="Search beers by name, brewery, type, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                aria-label="Filter by beer type"
              >
                <option value="all">All Types</option>
                {beerTypes.map(type => (
                  <option key={type || 'unknown'} value={type || ''}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AddBeerForm onBeerAdded={fetchBeers} />
          </div>

          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce">🍺</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">Loading beers...</p>
              </div>
            ) : (
              <>
                <BeerList beers={filteredBeers} onBeerUpdated={fetchBeers} />
                {filteredBeers.length === 0 && beers.length > 0 && (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No beers match your search
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
