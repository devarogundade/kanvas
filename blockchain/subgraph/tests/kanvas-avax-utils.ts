import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ChainlinkCancelled,
  ChainlinkFulfilled,
  ChainlinkRequested,
  GameCreated,
  OwnershipTransferred,
  PlanCreated,
  TemplateAdded
} from "../generated/KanvasAvax/KanvasAvax"

export function createChainlinkCancelledEvent(id: Bytes): ChainlinkCancelled {
  let chainlinkCancelledEvent = changetype<ChainlinkCancelled>(newMockEvent())

  chainlinkCancelledEvent.parameters = new Array()

  chainlinkCancelledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return chainlinkCancelledEvent
}

export function createChainlinkFulfilledEvent(id: Bytes): ChainlinkFulfilled {
  let chainlinkFulfilledEvent = changetype<ChainlinkFulfilled>(newMockEvent())

  chainlinkFulfilledEvent.parameters = new Array()

  chainlinkFulfilledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return chainlinkFulfilledEvent
}

export function createChainlinkRequestedEvent(id: Bytes): ChainlinkRequested {
  let chainlinkRequestedEvent = changetype<ChainlinkRequested>(newMockEvent())

  chainlinkRequestedEvent.parameters = new Array()

  chainlinkRequestedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return chainlinkRequestedEvent
}

export function createGameCreatedEvent(
  gameId: Address,
  name: string,
  description: string,
  avatar: string,
  plan: BigInt,
  creator: Address,
  email: string,
  website: string
): GameCreated {
  let gameCreatedEvent = changetype<GameCreated>(newMockEvent())

  gameCreatedEvent.parameters = new Array()

  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromAddress(gameId))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("avatar", ethereum.Value.fromString(avatar))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("plan", ethereum.Value.fromUnsignedBigInt(plan))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("email", ethereum.Value.fromString(email))
  )
  gameCreatedEvent.parameters.push(
    new ethereum.EventParam("website", ethereum.Value.fromString(website))
  )

  return gameCreatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPlanCreatedEvent(
  planId: BigInt,
  name: string,
  cost: BigInt,
  color: string,
  limit: BigInt
): PlanCreated {
  let planCreatedEvent = changetype<PlanCreated>(newMockEvent())

  planCreatedEvent.parameters = new Array()

  planCreatedEvent.parameters.push(
    new ethereum.EventParam("planId", ethereum.Value.fromUnsignedBigInt(planId))
  )
  planCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  planCreatedEvent.parameters.push(
    new ethereum.EventParam("cost", ethereum.Value.fromUnsignedBigInt(cost))
  )
  planCreatedEvent.parameters.push(
    new ethereum.EventParam("color", ethereum.Value.fromString(color))
  )
  planCreatedEvent.parameters.push(
    new ethereum.EventParam("limit", ethereum.Value.fromUnsignedBigInt(limit))
  )

  return planCreatedEvent
}

export function createTemplateAddedEvent(
  gameId: Address,
  template: string
): TemplateAdded {
  let templateAddedEvent = changetype<TemplateAdded>(newMockEvent())

  templateAddedEvent.parameters = new Array()

  templateAddedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromAddress(gameId))
  )
  templateAddedEvent.parameters.push(
    new ethereum.EventParam("template", ethereum.Value.fromString(template))
  )

  return templateAddedEvent
}
