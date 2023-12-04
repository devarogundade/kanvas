import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  GameCreated,
  OwnershipTransferred,
  PlanCreated,
  RequestFulfilled,
  RequestSent,
  TemplateAdded
} from "../generated/Kanvas/Kanvas"

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

export function createRequestFulfilledEvent(id: Bytes): RequestFulfilled {
  let requestFulfilledEvent = changetype<RequestFulfilled>(newMockEvent())

  requestFulfilledEvent.parameters = new Array()

  requestFulfilledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestFulfilledEvent
}

export function createRequestSentEvent(id: Bytes): RequestSent {
  let requestSentEvent = changetype<RequestSent>(newMockEvent())

  requestSentEvent.parameters = new Array()

  requestSentEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestSentEvent
}

export function createTemplateAddedEvent(
  gameId: Address,
  templateUri: string
): TemplateAdded {
  let templateAddedEvent = changetype<TemplateAdded>(newMockEvent())

  templateAddedEvent.parameters = new Array()

  templateAddedEvent.parameters.push(
    new ethereum.EventParam("gameId", ethereum.Value.fromAddress(gameId))
  )
  templateAddedEvent.parameters.push(
    new ethereum.EventParam(
      "templateUri",
      ethereum.Value.fromString(templateUri)
    )
  )

  return templateAddedEvent
}
