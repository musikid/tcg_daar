import { TCGCard } from './pokemon-tcg-sdk/card'
import { TCGSet } from './pokemon-tcg-sdk/set'

export function useTCG() {
  return {
    Card: TCGCard,
    Set: TCGSet,
  }
}
