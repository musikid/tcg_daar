import { Transfer as TransferEvent, Card as CardContract } from "../generated/Card/Card"
import { Card } from "../generated/schema"
import { Address, store } from "@graphprotocol/graph-ts"

const ZERO_ADDRESS = Address.zero()

export function handleTransfer(event: TransferEvent): void {
  let Contract = CardContract.bind(event.address)
  let id = event.params.tokenId.toHex()
  if (event.params.to === ZERO_ADDRESS)
    store.remove('Card', id)

  let entity = new Card(id)
  entity.owner = event.params.to
  entity.url = Contract.tokenURI(event.params.tokenId)
  entity.save()
}
