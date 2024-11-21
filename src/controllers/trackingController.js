const axios = require("axios")
const SHIPPO_TOKEN = process.env.SHIPPO_API_KEY

exports.webhookTrackUpdated = (req, res) => {
  const trackingUpdate = req.body

  console.log("Received tracking update:", trackingUpdate)

  res.sendStatus(200)
}

exports.trackShipment = async (carrier, trackingNumber, metadata = "") => {
  try {
    const response = await axios.post(
      "https://api.goshippo.com/tracks/",
      {
        carrier: carrier,
        tracking_number: trackingNumber,
        metadata: metadata
      },
      {
        headers: {
          Authorization: `ShippoToken ${SHIPPO_TOKEN}`
        }
      }
    )

    console.log("Tracking registered:", response.data)
  } catch (error) {
    console.error("Error registering tracking:", error.response?.data || error.message)
  }
}

exports.getTrackingStatus = async (carrier, trackingNumber) => {
  try {
    console.log("we are here.....")
    const response = await axios.get(
      `https://api.goshippo.com/tracks/${carrier}/${trackingNumber}`,
      {
        headers: {
          Authorization: `ShippoToken ${SHIPPO_TOKEN}`
        }
      }
    )
    

    console.log("Tracking status:", response.data)
  } catch (error) {
    console.error("Error fetching tracking status:", error.response?.data || error.message)
  }
}
