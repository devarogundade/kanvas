// @args properties typeof string
const props = args[0]

// @args fields typeof string
const fields = args[1]

// @args gameId typeof EVMAddress
const gameId = args[2]

// @args playerId typeof EVMAddress
const playerId = args[3]

// @args templateId typeof integer
const templateId = args[4]

// Execute the API request (Promise)
const apiResponse = await Functions.makeHttpRequest({
    url: `https://kanvas.azurewebsites.net/generate/${props}/${fields}/${gameId}/${playerId}/${templateId}`,
    method: "GET"
})

if (apiResponse.error) {
    throw Error("Request failed")
}

const { data } = apiResponse

return Functions.encodeString(data.uri)
