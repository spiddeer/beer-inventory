export interface Beer {
  id: string
  name: string
  brewery: string | null
  type: string | null
  abv: number | null
  ibu: number | null
  notes: string | null
  created_at: string
}

export type BeerInsert = Omit<Beer, 'id' | 'created_at'>
