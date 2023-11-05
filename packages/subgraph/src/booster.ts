import { Transfer as TransferEvent, Booster as BoosterContract } from "../generated/Booster/Booster"
import { Address, store } from "@graphprotocol/graph-ts"
import {
  Booster
} from "../generated/schema"

const ZERO_ADDRESS = Address.zero()

export function handleTransfer(event: TransferEvent): void {
  let Contract = BoosterContract.bind(event.address)
  let id = event.params.tokenId.toHex()
  if (event.params.to === ZERO_ADDRESS)
    store.remove('Booster', id)

  let entity = new Booster(id)
  entity.owner = event.params.to
  entity.url = Contract.tokenURI(event.params.tokenId)
  entity.save()
}
