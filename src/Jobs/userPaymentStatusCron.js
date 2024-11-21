const cron = require("node-cron")
const User = require("../models/User")

cron.schedule("0 0 0  * * *", async () => {   ///000***  and */2 ****
  try {
    const currentDate = new Date()

    const usersToUpdate = await User.find({
      endDate: { $lt: currentDate },
      paymentStatus: true
    })

    await User.updateMany(
      { _id: { $in: usersToUpdate.map(user => user._id) } },
      { $set: { paymentStatus: false } }
    )

    console.log(`Updated ${usersToUpdate.length} user(s) payment status.`)
  } catch (error) {
    console.error("Error updating user payment statuses:", error)
  }
})
