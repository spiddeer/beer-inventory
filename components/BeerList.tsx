'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Beer } from '@/types/beer'

interface BeerListProps {
  beers: Beer[]
  onBeerUpdated: () => void
}

export default function BeerList({ beers, onBeerUpdated }: BeerListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Beer | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this beer?')) return
    
    setDeleting(id)
    try {
      const { error } = await supabase.from('beers').delete().eq('id', id)
      if (error) throw error
      onBeerUpdated()
    } catch (err) {
      alert('Failed to delete beer')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (beer: Beer) => {
    setEditingId(beer.id)
    setEditForm(beer)
  }

  const handleSaveEdit = async () => {
    if (!editForm) return
    
    try {
      const { error } = await supabase
        .from('beers')
        .update({
          name: editForm.name,
          brewery: editForm.brewery,
          type: editForm.type,
          abv: editForm.abv,
          ibu: editForm.ibu,
          notes: editForm.notes,
        })
        .eq('id', editForm.id)
      
      if (error) throw error
      setEditingId(null)
      setEditForm(null)
      onBeerUpdated()
    } catch (err) {
      alert('Failed to update beer')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm(null)
  }

  if (beers.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-6xl mb-4">🍺</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">No beers in inventory yet. Add your first beer!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        🍻 Beer Inventory ({beers.length})
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {beers.map((beer) => (
          <div
            key={beer.id}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
              editingId === beer.id ? 'ring-2 ring-amber-500' : ''
            }`}
          >
            {editingId === beer.id && editForm ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Beer name"
                />
                <input
                  type="text"
                  value={editForm.brewery || ''}
                  onChange={(e) => setEditForm({ ...editForm, brewery: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brewery"
                />
                <input
                  type="text"
                  value={editForm.type || ''}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Type"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.abv || ''}
                    onChange={(e) => setEditForm({ ...editForm, abv: parseFloat(e.target.value) || null })}
                    className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                    placeholder="ABV %"
                  />
                  <input
                    type="number"
                    value={editForm.ibu || ''}
                    onChange={(e) => setEditForm({ ...editForm, ibu: parseInt(e.target.value) || null })}
                    className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                    placeholder="IBU"
                  />
                </div>
                <textarea
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Notes"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{beer.name}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(beer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(beer.id)}
                      disabled={deleting === beer.id}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {beer.brewery && (
                  <p className="text-gray-600 dark:text-gray-300 mb-1">
                    <span className="font-medium">🏭 Brewery:</span> {beer.brewery}
                  </p>
                )}
                
                {beer.type && (
                  <div className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {beer.type}
                  </div>
                )}
                
                <div className="flex gap-4 mt-3">
                  {beer.abv !== null && (
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">🌡️</span>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ABV</p>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{beer.abv}%</p>
                      </div>
                    </div>
                  )}
                  
                  {beer.ibu !== null && (
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">💪</span>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">IBU</p>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{beer.ibu}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {beer.notes && (
                  <p className="text-gray-600 dark:text-gray-300 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 italic text-sm">
                    "{beer.notes}"
                  </p>
                )}
                
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-1">
                  📅 {new Date(beer.created_at).toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
