// // @args properties typeof string
// const props = args[0]

// // @args fields typeof string
// const fields = args[1]

// // @args gameId typeof EVMAddress
// const gameId = args[2]

// // @args playerId typeof EVMAddress
// const playerId = args[3]

// // @args templateId typeof integer
// const templateId = args[4]

// // Execute the API request (Promise)
// const apiResponse = await Functions.makeHttpRequest({
//     url: `https://kanvas-di5j.onrender.com/generate/${props}/${fields}/${gameId}/${playerId}/${templateId}`,
//     method: "GET"
// })

// if (apiResponse.error) {
//     console.log(apiResponse.error)
//     throw Error("Request failed")
// }

// const { data } = apiResponse

// console.log('API response data:', data.uri)

// return Functions.encodeString(data.uri)

return Functions.encodeString("https://firebasestorage.googleapis.com/v0/b/kanvas-73a90.appspot.com/o/metadatas%2F0xb352fd34b747dadbf37cd57ef74dd1950b6f1c91%2F0x909d21bae8be0ad4d35d89129b2a4f2925da7877.json?alt=media&token=ac8b1dde-fc02-4dff-8a83-3e68694db737")

