'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { BeerInsert } from '@/types/beer'

interface AddBeerFormProps {
  onBeerAdded: () => void
}

export default function AddBeerForm({ onBeerAdded }: AddBeerFormProps) {
  const [formData, setFormData] = useState<BeerInsert>({
    name: '',
    brewery: '',
    type: '',
    abv: null,
    ibu: null,
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase.from('beers').insert([
        {
          name: formData.name,
          brewery: formData.brewery || null,
          type: formData.type || null,
          abv: formData.abv,
          ibu: formData.ibu,
          notes: formData.notes || null,
        },
      ])

      if (insertError) throw insertError

      // Reset form
      setFormData({
        name: '',
        brewery: '',
        type: '',
        abv: null,
        ibu: null,
        notes: '',
      })

      onBeerAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add beer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Beer</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Beer Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="brewery" className="block text-sm font-medium text-gray-700 mb-1">
          Brewery
        </label>
        <input
          type="text"
          id="brewery"
          value={formData.brewery || ''}
          onChange={(e) => setFormData({ ...formData, brewery: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type (e.g., IPA, Lager, Stout)
        </label>
        <input
          type="text"
          id="type"
          value={formData.type || ''}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="abv" className="block text-sm font-medium text-gray-700 mb-1">
            ABV %
          </label>
          <input
            type="number"
            id="abv"
            step="0.1"
            min="0"
            max="100"
            value={formData.abv || ''}
            onChange={(e) =>
              setFormData({ ...formData, abv: e.target.value ? parseFloat(e.target.value) : null })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="ibu" className="block text-sm font-medium text-gray-700 mb-1">
            IBU
          </label>
          <input
            type="number"
            id="ibu"
            min="0"
            max="200"
            value={formData.ibu || ''}
            onChange={(e) =>
              setFormData({ ...formData, ibu: e.target.value ? parseInt(e.target.value) : null })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Adding...' : 'Add Beer'}
      </button>
    </form>
  )
}
