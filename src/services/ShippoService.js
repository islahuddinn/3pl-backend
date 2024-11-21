const { Shippo } = require("shippo")
const registerTracking = require("../controllers/trackingController")
class ShippoService {
  constructor(apiKey) {
    this.shippo = new Shippo({
      apiKeyHeader: `ShippoToken ${apiKey}`
      // shippoApiVersion: "2018-02-08",
    })
  }
  async listShipments() {
    try {
      const result = await this.shippo.shipments.list({})
      return result
    } catch (error) {
      console.error("Error listing shipments:", error)
      throw error
    }
  }
  async getShipmentById(id) {
    try {
      const result = await this.shippo.shipments.get(id)
      return result
    } catch (error) {
      console.error("Error fetching shipment:", error)
      throw error
    }
  }
  async createShipment(data) {
    try {
      const result = await this.shippo.shipments.create({
        // extra: {
        //     cod: data.cod || null,
        //     insurance: data.insurance || null,
        // },
        // metadata: data.metadata || "Customer ID 123456",
        // shipmentDate: data.shipmentDate || new Date().toISOString(),
        addressFrom: data.address_from,
        addressTo: data.address_to,
        // addressReturn: data.addressReturn || data.addressFrom,
        // customsDeclaration: data.customsDeclaration || null,
        // carrierAccounts: data.carrierAccounts || [],
        parcels: data.parcels
      })
      const carrier = result.carrier || "ups"
      const trackingNumber = result.tracking_number

      if (carrier && trackingNumber) {
        await registerTracking(carrier, trackingNumber, "Order metadata here")
      } else {
        console.warn("Carrier or tracking number not available for tracking registration.")
      }
      return result
    } catch (error) {
      console.error("Error creating shipment:", error)
      throw error
    }
  }

  async purchaseLabelByRate(rateId) {
    try {
      const transaction = await this.shippo.transactions.create({
        // rate: rate?.object_id,
        rate: rateId,
        labelFileType: "PDF",
        async: false
      })
      return transaction
    } catch (error) {
      console.error("Error purchasing label:", error)
      throw error
    }
  }

  ///-----
  //   // Get label rate based on the provided labelObjectId
  //   async getLabelRate(labelObjectId) {
  //     try {
  //       const response = await axios.get(`${this.baseUrl}/shipments/${labelObjectId}`, {
  //         headers: {
  //           Authorization: `ShippoToken ${this.apiKey}`
  //         }
  //       })
  //       const rates = response.data.rates
  //       if (!rates || rates.length === 0) {
  //         throw new Error("No rates found for the shipment.")
  //       }
  //       return rates[0] // Return the first rate
  //     } catch (error) {
  //       console.error("Error fetching label rate:", error.response?.data || error.message)
  //       throw error
  //     }
  //   }
  async purchaseLabel(objectId) {
    console.log(objectId, "Here is the object id......")
    try {
      // const label = await this.shippo.rates.get({})
      const transaction = await this.shippo.transactions.create({
        rate: objectId,
        label_file_type: "PDF", // You can also use 'PNG', 'ZPL', etc.
        async: false
      })
      console.log(transaction, "here is the transactin.......")
      return transaction // Return the transaction details, including label URL
    } catch (error) {
      console.error("Error purchasing label:", error.message)
      throw error // Rethrow the error for handling in the controller
    }
  }
  async getLabel(objectId) {
    console.log(objectId, "Here is the object id......")
    try {
      const label = await this.shippo.rates.get(objectId)
      console.log(label, "Here is the label id")
      // const transaction = await this.shippo.transactions.create({
      //   rate: objectId,
      //   label_file_type: "PDF", // You can also use 'PNG', 'ZPL', etc.
      //   async: false
      // })

      return label // Return the transaction details, including label URL
    } catch (error) {
      console.error("Error purchasing label:", error.message)
      throw error // Rethrow the error for handling in the controller
    }
  }
  async createLabel(rateId) {}
  async getLabelById(ObjectId) {}
  async getLabelUrl(labelId) {}
  // async purchaseLabel() {}
}
module.exports = ShippoService
