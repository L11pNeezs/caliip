export interface Meal {
    id?: number
    name: string
    date: string
    source: 'manual'|'ai'
    createdAt: string
}