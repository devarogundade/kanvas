import {
  ChainlinkCancelled as ChainlinkCancelledEvent,
  ChainlinkFulfilled as ChainlinkFulfilledEvent,
  ChainlinkRequested as ChainlinkRequestedEvent,
  GameCreated as GameCreatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PlanCreated as PlanCreatedEvent,
  TemplateAdded as TemplateAddedEvent
} from "../generated/Kanvas/Kanvas";
import {
  ChainlinkCancelled,
  ChainlinkFulfilled,
  ChainlinkRequested,
  GameCreated,
  OwnershipTransferred,
  PlanCreated,
  TemplateAdded
} from "../generated/schema";

export function handleChainlinkCancelled(event: ChainlinkCancelledEvent): void {
  let entity = new ChainlinkCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.Kanvas_id = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleChainlinkFulfilled(event: ChainlinkFulfilledEvent): void {
  let entity = new ChainlinkFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.Kanvas_id = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleChainlinkRequested(event: ChainlinkRequestedEvent): void {
  let entity = new ChainlinkRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.Kanvas_id = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleGameCreated(event: GameCreatedEvent): void {
  let entity = new GameCreated(
    event.params.gameId
  );
  entity.gameId = event.params.gameId;
  entity.name = event.params.name;
  entity.description = event.params.description;
  entity.avatar = event.params.avatar;
  entity.plan = event.params.plan;
  entity.creator = event.params.creator;
  entity.email = event.params.email;
  entity.website = event.params.website;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePlanCreated(event: PlanCreatedEvent): void {
  let entity = new PlanCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.planId = event.params.planId;
  entity.name = event.params.name;
  entity.cost = event.params.cost;
  entity.color = event.params.color;
  entity.limit = event.params.limit;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTemplateAdded(event: TemplateAddedEvent): void {
  let entity = new TemplateAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.gameId = event.params.gameId;
  entity.template = event.params.template;
  entity.game = event.params.gameId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
