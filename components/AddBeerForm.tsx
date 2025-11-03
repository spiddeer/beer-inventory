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
    <form onSubmit={handleSubmit} className="space-y-5 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-lg border border-amber-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        ➕ Add New Beer
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          🍺 Beer Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          placeholder="e.g., Hoppy Haze IPA"
        />
      </div>

      <div>
        <label htmlFor="brewery" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          🏭 Brewery
        </label>
        <input
          type="text"
          id="brewery"
          value={formData.brewery || ''}
          onChange={(e) => setFormData({ ...formData, brewery: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          placeholder="e.g., Brooklyn Brewery"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          🏷️ Type
        </label>
        <input
          type="text"
          id="type"
          value={formData.type || ''}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          placeholder="IPA, Lager, Stout, Porter, etc."
          list="beer-types"
        />
        <datalist id="beer-types">
          <option value="IPA" />
          <option value="Pale Ale" />
          <option value="Lager" />
          <option value="Pilsner" />
          <option value="Stout" />
          <option value="Porter" />
          <option value="Wheat Beer" />
          <option value="Sour" />
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="abv" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🌡️ ABV %
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
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            placeholder="5.0"
          />
        </div>

        <div>
          <label htmlFor="ibu" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            💪 IBU
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
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            placeholder="45"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          📝 Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
          placeholder="Tasting notes, pairings, or any other details..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span> Adding...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🍺</span> Add Beer
          </span>
        )}
      </button>
    </form>
  )
}
