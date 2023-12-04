// @params properties typeof string
const properties = args[0]

// @params fields typeof string
const fields = args[1]

// @params gameId typeof EVMAddress
const gameId = args[2]

// @params playerId typeof EVMAddress
const playerId = args[3]

// @params templateId typeof integer
const templateId = args[4]

// Execute the API request (Promise)
const apiResponse = await Functions.makeHttpRequest({
    url: `https://kanvas-di5j.onrender.com/generate/${properties}/${fields}/${gameId}/${playerId}/${templateId}`
})

if (apiResponse.error) {
    console.log(apiResponse.error)
    throw Error("Request failed")
}

const { data } = apiResponse

console.log('API response data:', data.uri)

return Functions.encodeString(data.uri)
