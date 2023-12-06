import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { GameCreated } from "../generated/schema"
import { GameCreated as GameCreatedEvent } from "../generated/Kanvas/Kanvas"
import { handleGameCreated } from "../src/kanvas"
import { createGameCreatedEvent } from "./kanvas-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let gameId = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let name = "Example string value"
    let description = "Example string value"
    let avatar = "Example string value"
    let plan = BigInt.fromI32(234)
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let email = "Example string value"
    let website = "Example string value"
    let newGameCreatedEvent = createGameCreatedEvent(
      gameId,
      name,
      description,
      avatar,
      plan,
      creator,
      email,
      website
    )
    handleGameCreated(newGameCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GameCreated created and stored", () => {
    assert.entityCount("GameCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "gameId",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "description",
      "Example string value"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "avatar",
      "Example string value"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "plan",
      "234"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "email",
      "Example string value"
    )
    assert.fieldEquals(
      "GameCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "website",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
