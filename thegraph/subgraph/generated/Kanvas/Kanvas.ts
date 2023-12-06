// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class GameCreated extends ethereum.Event {
  get params(): GameCreated__Params {
    return new GameCreated__Params(this);
  }
}

export class GameCreated__Params {
  _event: GameCreated;

  constructor(event: GameCreated) {
    this._event = event;
  }

  get gameId(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get name(): string {
    return this._event.parameters[1].value.toString();
  }

  get description(): string {
    return this._event.parameters[2].value.toString();
  }

  get avatar(): string {
    return this._event.parameters[3].value.toString();
  }

  get plan(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get creator(): Address {
    return this._event.parameters[5].value.toAddress();
  }

  get email(): string {
    return this._event.parameters[6].value.toString();
  }

  get website(): string {
    return this._event.parameters[7].value.toString();
  }
}

export class GameEvent extends ethereum.Event {
  get params(): GameEvent__Params {
    return new GameEvent__Params(this);
  }
}

export class GameEvent__Params {
  _event: GameEvent;

  constructor(event: GameEvent) {
    this._event = event;
  }

  get requestId(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get gameId(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get playerId(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get eventType(): i32 {
    return this._event.parameters[3].value.toI32();
  }

  get data(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PlanCreated extends ethereum.Event {
  get params(): PlanCreated__Params {
    return new PlanCreated__Params(this);
  }
}

export class PlanCreated__Params {
  _event: PlanCreated;

  constructor(event: PlanCreated) {
    this._event = event;
  }

  get planId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get name(): string {
    return this._event.parameters[1].value.toString();
  }

  get cost(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get color(): string {
    return this._event.parameters[3].value.toString();
  }

  get limit(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class RequestFulfilled extends ethereum.Event {
  get params(): RequestFulfilled__Params {
    return new RequestFulfilled__Params(this);
  }
}

export class RequestFulfilled__Params {
  _event: RequestFulfilled;

  constructor(event: RequestFulfilled) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }
}

export class RequestSent extends ethereum.Event {
  get params(): RequestSent__Params {
    return new RequestSent__Params(this);
  }
}

export class RequestSent__Params {
  _event: RequestSent;

  constructor(event: RequestSent) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }
}

export class TemplateAdded extends ethereum.Event {
  get params(): TemplateAdded__Params {
    return new TemplateAdded__Params(this);
  }
}

export class TemplateAdded__Params {
  _event: TemplateAdded;

  constructor(event: TemplateAdded) {
    this._event = event;
  }

  get gameId(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get templateUri(): string {
    return this._event.parameters[1].value.toString();
  }
}

export class Kanvas extends ethereum.SmartContract {
  static bind(address: Address): Kanvas {
    return new Kanvas("Kanvas", address);
  }

  MAX_PROPERTIES_LEN(): BigInt {
    let result = super.call(
      "MAX_PROPERTIES_LEN",
      "MAX_PROPERTIES_LEN():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_MAX_PROPERTIES_LEN(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "MAX_PROPERTIES_LEN",
      "MAX_PROPERTIES_LEN():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  MAX_TEMPLATES_LEN(): BigInt {
    let result = super.call(
      "MAX_TEMPLATES_LEN",
      "MAX_TEMPLATES_LEN():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_MAX_TEMPLATES_LEN(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "MAX_TEMPLATES_LEN",
      "MAX_TEMPLATES_LEN():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getRouter(): Address {
    let result = super.call("getRouter", "getRouter():(address)", []);

    return result[0].toAddress();
  }

  try_getRouter(): ethereum.CallResult<Address> {
    let result = super.tryCall("getRouter", "getRouter():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get ccipReceiver(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get functionOracle(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CcipReceiveCall extends ethereum.Call {
  get inputs(): CcipReceiveCall__Inputs {
    return new CcipReceiveCall__Inputs(this);
  }

  get outputs(): CcipReceiveCall__Outputs {
    return new CcipReceiveCall__Outputs(this);
  }
}

export class CcipReceiveCall__Inputs {
  _call: CcipReceiveCall;

  constructor(call: CcipReceiveCall) {
    this._call = call;
  }

  get message(): CcipReceiveCallMessageStruct {
    return changetype<CcipReceiveCallMessageStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }
}

export class CcipReceiveCall__Outputs {
  _call: CcipReceiveCall;

  constructor(call: CcipReceiveCall) {
    this._call = call;
  }
}

export class CcipReceiveCallMessageStruct extends ethereum.Tuple {
  get messageId(): Bytes {
    return this[0].toBytes();
  }

  get sourceChainSelector(): BigInt {
    return this[1].toBigInt();
  }

  get sender(): Bytes {
    return this[2].toBytes();
  }

  get data(): Bytes {
    return this[3].toBytes();
  }

  get destTokenAmounts(): Array<CcipReceiveCallMessageDestTokenAmountsStruct> {
    return this[4].toTupleArray<CcipReceiveCallMessageDestTokenAmountsStruct>();
  }
}

export class CcipReceiveCallMessageDestTokenAmountsStruct extends ethereum.Tuple {
  get token(): Address {
    return this[0].toAddress();
  }

  get amount(): BigInt {
    return this[1].toBigInt();
  }
}

export class HandleOracleFulfillmentCall extends ethereum.Call {
  get inputs(): HandleOracleFulfillmentCall__Inputs {
    return new HandleOracleFulfillmentCall__Inputs(this);
  }

  get outputs(): HandleOracleFulfillmentCall__Outputs {
    return new HandleOracleFulfillmentCall__Outputs(this);
  }
}

export class HandleOracleFulfillmentCall__Inputs {
  _call: HandleOracleFulfillmentCall;

  constructor(call: HandleOracleFulfillmentCall) {
    this._call = call;
  }

  get requestId(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get response(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get err(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class HandleOracleFulfillmentCall__Outputs {
  _call: HandleOracleFulfillmentCall;

  constructor(call: HandleOracleFulfillmentCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UpdateDonIdCall extends ethereum.Call {
  get inputs(): UpdateDonIdCall__Inputs {
    return new UpdateDonIdCall__Inputs(this);
  }

  get outputs(): UpdateDonIdCall__Outputs {
    return new UpdateDonIdCall__Outputs(this);
  }
}

export class UpdateDonIdCall__Inputs {
  _call: UpdateDonIdCall;

  constructor(call: UpdateDonIdCall) {
    this._call = call;
  }

  get newDonId(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class UpdateDonIdCall__Outputs {
  _call: UpdateDonIdCall;

  constructor(call: UpdateDonIdCall) {
    this._call = call;
  }
}

export class UpdateSourceCodeCall extends ethereum.Call {
  get inputs(): UpdateSourceCodeCall__Inputs {
    return new UpdateSourceCodeCall__Inputs(this);
  }

  get outputs(): UpdateSourceCodeCall__Outputs {
    return new UpdateSourceCodeCall__Outputs(this);
  }
}

export class UpdateSourceCodeCall__Inputs {
  _call: UpdateSourceCodeCall;

  constructor(call: UpdateSourceCodeCall) {
    this._call = call;
  }

  get newSourceCode(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class UpdateSourceCodeCall__Outputs {
  _call: UpdateSourceCodeCall;

  constructor(call: UpdateSourceCodeCall) {
    this._call = call;
  }
}

export class UpdateGasLimitCall extends ethereum.Call {
  get inputs(): UpdateGasLimitCall__Inputs {
    return new UpdateGasLimitCall__Inputs(this);
  }

  get outputs(): UpdateGasLimitCall__Outputs {
    return new UpdateGasLimitCall__Outputs(this);
  }
}

export class UpdateGasLimitCall__Inputs {
  _call: UpdateGasLimitCall;

  constructor(call: UpdateGasLimitCall) {
    this._call = call;
  }

  get newLimit(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class UpdateGasLimitCall__Outputs {
  _call: UpdateGasLimitCall;

  constructor(call: UpdateGasLimitCall) {
    this._call = call;
  }
}

export class UpdateSubscriptionIdCall extends ethereum.Call {
  get inputs(): UpdateSubscriptionIdCall__Inputs {
    return new UpdateSubscriptionIdCall__Inputs(this);
  }

  get outputs(): UpdateSubscriptionIdCall__Outputs {
    return new UpdateSubscriptionIdCall__Outputs(this);
  }
}

export class UpdateSubscriptionIdCall__Inputs {
  _call: UpdateSubscriptionIdCall;

  constructor(call: UpdateSubscriptionIdCall) {
    this._call = call;
  }

  get newSubscriptionId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class UpdateSubscriptionIdCall__Outputs {
  _call: UpdateSubscriptionIdCall;

  constructor(call: UpdateSubscriptionIdCall) {
    this._call = call;
  }
}

export class CreateGameCall extends ethereum.Call {
  get inputs(): CreateGameCall__Inputs {
    return new CreateGameCall__Inputs(this);
  }

  get outputs(): CreateGameCall__Outputs {
    return new CreateGameCall__Outputs(this);
  }
}

export class CreateGameCall__Inputs {
  _call: CreateGameCall;

  constructor(call: CreateGameCall) {
    this._call = call;
  }

  get params(): CreateGameCallParamsStruct {
    return changetype<CreateGameCallParamsStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }
}

export class CreateGameCall__Outputs {
  _call: CreateGameCall;

  constructor(call: CreateGameCall) {
    this._call = call;
  }
}

export class CreateGameCallParamsStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get description(): string {
    return this[1].toString();
  }

  get gameId(): Address {
    return this[2].toAddress();
  }

  get avatar(): string {
    return this[3].toString();
  }

  get plan(): BigInt {
    return this[4].toBigInt();
  }

  get email(): string {
    return this[5].toString();
  }

  get website(): string {
    return this[6].toString();
  }
}

export class AddTemplateCall extends ethereum.Call {
  get inputs(): AddTemplateCall__Inputs {
    return new AddTemplateCall__Inputs(this);
  }

  get outputs(): AddTemplateCall__Outputs {
    return new AddTemplateCall__Outputs(this);
  }
}

export class AddTemplateCall__Inputs {
  _call: AddTemplateCall;

  constructor(call: AddTemplateCall) {
    this._call = call;
  }

  get templateUri(): string {
    return this._call.inputValues[0].value.toString();
  }

  get gameId(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class AddTemplateCall__Outputs {
  _call: AddTemplateCall;

  constructor(call: AddTemplateCall) {
    this._call = call;
  }
}

export class _generateUriCall extends ethereum.Call {
  get inputs(): _generateUriCall__Inputs {
    return new _generateUriCall__Inputs(this);
  }

  get outputs(): _generateUriCall__Outputs {
    return new _generateUriCall__Outputs(this);
  }
}

export class _generateUriCall__Inputs {
  _call: _generateUriCall;

  constructor(call: _generateUriCall) {
    this._call = call;
  }

  get playerId(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get props(): Array<string> {
    return this._call.inputValues[1].value.toStringArray();
  }

  get fields(): string {
    return this._call.inputValues[2].value.toString();
  }

  get templateId(): i32 {
    return this._call.inputValues[3].value.toI32();
  }
}

export class _generateUriCall__Outputs {
  _call: _generateUriCall;

  constructor(call: _generateUriCall) {
    this._call = call;
  }
}

export class UpdateInteropCall extends ethereum.Call {
  get inputs(): UpdateInteropCall__Inputs {
    return new UpdateInteropCall__Inputs(this);
  }

  get outputs(): UpdateInteropCall__Outputs {
    return new UpdateInteropCall__Outputs(this);
  }
}

export class UpdateInteropCall__Inputs {
  _call: UpdateInteropCall;

  constructor(call: UpdateInteropCall) {
    this._call = call;
  }

  get chainSelector(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get kanvasRouter(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class UpdateInteropCall__Outputs {
  _call: UpdateInteropCall;

  constructor(call: UpdateInteropCall) {
    this._call = call;
  }
}

export class _transferToCall extends ethereum.Call {
  get inputs(): _transferToCall__Inputs {
    return new _transferToCall__Inputs(this);
  }

  get outputs(): _transferToCall__Outputs {
    return new _transferToCall__Outputs(this);
  }
}

export class _transferToCall__Inputs {
  _call: _transferToCall;

  constructor(call: _transferToCall) {
    this._call = call;
  }

  get chainSelector(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get gameId(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get playerId(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get uri(): string {
    return this._call.inputValues[4].value.toString();
  }

  get data(): Bytes {
    return this._call.inputValues[5].value.toBytes();
  }
}

export class _transferToCall__Outputs {
  _call: _transferToCall;

  constructor(call: _transferToCall) {
    this._call = call;
  }
}

export class CreatePlanCall extends ethereum.Call {
  get inputs(): CreatePlanCall__Inputs {
    return new CreatePlanCall__Inputs(this);
  }

  get outputs(): CreatePlanCall__Outputs {
    return new CreatePlanCall__Outputs(this);
  }
}

export class CreatePlanCall__Inputs {
  _call: CreatePlanCall;

  constructor(call: CreatePlanCall) {
    this._call = call;
  }

  get params(): CreatePlanCallParamsStruct {
    return changetype<CreatePlanCallParamsStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }
}

export class CreatePlanCall__Outputs {
  _call: CreatePlanCall;

  constructor(call: CreatePlanCall) {
    this._call = call;
  }
}

export class CreatePlanCallParamsStruct extends ethereum.Tuple {
  get name(): string {
    return this[0].toString();
  }

  get cost(): BigInt {
    return this[1].toBigInt();
  }

  get color(): string {
    return this[2].toString();
  }

  get limit(): BigInt {
    return this[3].toBigInt();
  }
}
