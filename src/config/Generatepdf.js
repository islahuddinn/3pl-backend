const puppeteer = require("puppeteer")
const ejs = require("ejs")
const fs = require("fs")
const { bufferUploadToCloud } = require("../utils/uploadHelper")

// ;(async () => {
//   const dataFeedback = await FeedbackMOdel.aggregate([
//     {
//       $facet: {
//         statusCounts: [
//           {
//             $group: {
//               _id: "$status",
//               count: { $sum: 1 }
//             }
//           }
//         ],
//         typeCounts: [
//           {
//             $group: {
//               _id: "$type",
//               count: { $sum: 1 }
//             }
//           }
//         ]
//       }
//     }
//   ])
//   const dataMeeting = await MeetingRequest.aggregate([
//     {
//       $facet: {
//         statusCounts: [
//           {
//             $group: {
//               _id: "$status",
//               count: { $sum: 1 }
//             }
//           }
//         ],
//         typeCounts: [
//           {
//             $group: {
//               _id: "$type",
//               count: { $sum: 1 }
//             }
//           }
//         ]
//       }
//     }
//   ])
//   const dataRound = await showRound.aggregate([
//     {
//       $facet: {
//         statusCounts: [
//           {
//             $group: {
//               _id: "$status",
//               count: { $sum: 1 }
//             }
//           }
//         ],
//         typeCounts: [
//           {
//             $group: {
//               _id: "$type",
//               count: { $sum: 1 }
//             }
//           }
//         ]
//       }
//     }
//   ])

//   function combineCounts(dataArray, key) {
//     return dataArray.reduce((acc, curr) => {
//       curr.forEach(item => {
//         if (!acc[item._id]) {
//           acc[item._id] = 0
//         }
//         acc[item._id] += item.count
//       })
//       return acc
//     }, {})
//   }

//   const combinedStatusCounts = combineCounts([
//     dataFeedback[0].statusCounts,
//     dataMeeting[0].statusCounts,
//     dataRound[0].statusCounts
//   ])

//   const combinedTypeCounts = combineCounts([
//     dataFeedback[0].typeCounts,
//     dataMeeting[0].typeCounts,
//     dataRound[0].typeCounts
//   ])

//   const combinedData = {
//     statusCounts: combinedStatusCounts,
//     typeCounts: combinedTypeCounts
//   }

//   console.log("Combined Data:", combinedData)

//   console.log(JSON.stringify(dataFeedback))
//   // Transform the data to a more usable format
//   const feedbackCounts = dataFeedback.reduce((acc, curr) => {
//     acc[curr._id] = curr.count
//     return acc
//   }, {})
//   console.log(feedbackCounts)
// })()

async function fetchDataFromMongoDB(location) {
  try {
    const [
      pendingCountFeedback,
      overdueCountFeedback,
      pendingCountMeetingRequest,
      overdueCountMeetingRequest,
      pendingCountRound,
      overdueCountRound
    ] = await Promise.all([
      countDocuments(FeedbackMOdel, "pending" ,location),
      countDocuments(FeedbackMOdel, "overdue" , location),
      countDocuments(MeetingRequest, "pending" , location),
      countDocuments(MeetingRequest, "overdue" , location),
      countDocuments(showRound, "pending", location),
      countDocuments(showRound, "overdue" , location)
    ])

    return {
      pending: pendingCountFeedback + pendingCountMeetingRequest + pendingCountRound,
      overdue: overdueCountFeedback + overdueCountMeetingRequest + overdueCountRound,
      pendingCountFeedback,
      pendingCountMeetingRequest,
      pendingCountRound,
      overdueCountFeedback,
      overdueCountMeetingRequest,
      overdueCountRound
    }
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error)
    throw error
  }
}


const countDocuments = async (Model, status , location) => {
  let query = {status}
  if(location){
    query.location = location
  }
  return Model.countDocuments(query)
}


async function generatePDF() {


  
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    // executablePath: "/usr/bin/google-chrome-stable" // This should be the path to the installed Chrome.
   })
  const page = await browser.newPage()

  const { pending, overdue } = await fetchDataFromMongoDB()

  // console.log(positiveFeedbackCount, "momomoomooom")

  // Data to pass to the EJS template
  const data = {
    pending_feedbacks: pending,
    overdue_feedbacks: overdue
  }
  // console.log(data)
  // Render the EJS template
  const template = fs.readFileSync("src/views/email/WeeklyReportEmail.ejs", "utf8")
  const html = ejs.render(template, { data })

  // Set the HTML content of the page
  await page.setContent(html)

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,

    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px"
    }
  })

  await browser.close()
  const file = {
    originalname: `Report-${Date.now()}.pdf`,
    buffer: pdfBuffer
  }
  const cloudUrl = await bufferUploadToCloud(file)
  return cloudUrl // Return the URL of the uploaded file
}
// async function generatePDF() {
  
// }

// generatePDF().then(() => {
//     console.log('PDF report generated successfully.');
// }).catch(error => {
//     console.error('Error generating PDF report:', error);
// });

module.exports = { generatePDF, fetchDataFromMongoDB  , }
