import {
  GameCreated as GameCreatedEvent,
  GameEvent as GameEventEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PlanCreated as PlanCreatedEvent,
  RequestFulfilled as RequestFulfilledEvent,
  RequestSent as RequestSentEvent,
  TemplateAdded as TemplateAddedEvent
} from "../generated/Kanvas/Kanvas";
import {
  GameCreated,
  GameEvent,
  OwnershipTransferred,
  PlanCreated,
  RequestFulfilled,
  RequestSent,
  TemplateAdded
} from "../generated/schema";

export function handleGameCreated(event: GameCreatedEvent): void {
  let entity = GameCreated.load(
    event.params.gameId
  );

  if (!entity) {
    entity = new GameCreated(
      event.params.gameId
    );
  }

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

export function handleGameEvent(event: GameEventEvent): void {
  let entity = new GameEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.requestId = event.params.requestId;
  entity.gameId = event.params.gameId;
  entity.playerId = event.params.playerId;
  entity.eventType = event.params.eventType;
  entity.data = event.params.data;

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

export function handleRequestFulfilled(event: RequestFulfilledEvent): void {
  let entity = new RequestFulfilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.Kanvas_id = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRequestSent(event: RequestSentEvent): void {
  let entity = new RequestSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.Kanvas_id = event.params.id;

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
  entity.templateUri = event.params.templateUri;
  entity.game = event.params.gameId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
