const cron = require("node-cron")
const { generatePDF, fetchDataFromMongoDB  ,} = require("./Generatepdf")
const Email = require("../utils/email")
const moment = require("moment/moment")
const {getAllManagers, getAllSuperUsers } = require("./../controllers/userController")

const sendEmailPdf = async () => {
  const url = await generatePDF()
  console.log(url)
  const email = "usmanzafar783@gmail.com"
  const subject = "Welcome to Our Platform"
  const message = `Dear User,\n\nWelcome to our platform! You have been successfully registered.\n\nYour location is: ${"hh"}\n\n and location Number is ${""} Thank you.`
  // await sendEmail(email, subject, message);
  new Email(email, subject).sendTextEmail(subject, message, { link: url })
}
// Schedule the cron job to run your Puppeteer script every day at 9:00 AM
// cron.schedule('0 9 * * 1', () => {
  //     console.log(moment().format("MMM DD,YY at hh:mm:ssA"));
  //   });
  cron.schedule("0 9 * * *", async () => {

  console.log("node cron started")
  try {
    console.log(moment().format("MMM DD,YY at hh:mm:ssA"))

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    await Feedback.updateMany(
      { status: "pending", dateOfRequest: { $lte: oneWeekAgo } },
      { status: "overdue" }
    )
    await MeetingRequest.updateMany(
      { status: "pending", dateOfRequest: { $lte: oneWeekAgo } },
      { status: "overdue" }
    )
    await showRound.updateMany(
      { status: "pending", dateOfRequest: { $lte: oneWeekAgo } },
      { status: "overdue" }
    )

    // const url = await generatePDF()
    // const {
    //   pending,
    //   overdue ,
    //   pendingCountFeedback,
    //   pendingCountMeetingRequest,
    //   pendingCountRound,
    //   overdueCountFeedback,
    //   overdueCountMeetingRequest,
    //   overdueCountRound
    //  } = await fetchDataFromMongoDB()

    // console.log(positiveFeedbackCount, "momomoomooom")

    // Send emails to managers with location-specific data
    const managers = await getAllManagers() 
    await Promise.all(managers.map(async (manager) => {

      const emailPeriodWeek = manager.emailperiodWeek;

      let  lastEmailSent;
      if(manager.lastEmailSentStamp) {
        lastEmailSent = manager.lastEmailSentStamp
      }else{
        lastEmailSent =  new Date()
        manager.lastEmailSentStamp = lastEmailSent
      }
      
      const weeksSinceLastEmail = Math.floor(
        (now - lastEmailSent) / (7 * 24 * 60 * 60 * 1000)
      );
       // Check if it's time to send an email
       console.log("check email")
       if (weeksSinceLastEmail >= emailPeriodWeek) {
        const {
           pending,
           overdue,
           pendingCountFeedback,
           pendingCountMeetingRequest,
           pendingCountRound,
           overdueCountFeedback,
           overdueCountMeetingRequest,
           overdueCountRound
          } = await fetchDataFromMongoDB(manager.location);
        const data = {
          pending_feedbacks: pending,
          pending_count_feedbacks: pendingCountFeedback,
          pending_req_meeting_feedbacks: pendingCountMeetingRequest,
          pending_show_round_feedbacks: pendingCountRound,
          
          overdue_feedbacks: overdue,
          overdue_count_feedbacks: overdueCountFeedback,
          overdue_req_meeting: overdueCountMeetingRequest,
          overdue_show_round: overdueCountRound,

          front_end_url : process.env.FRONTEND_URL

        };

        // Send email and update the last email sent timestamp
        await new Email(manager.email).send("WeeklyReportEmail", "Weekly CFS report", data);
        console.log("Sent email")

        manager.lastEmailSentStamp = now;
      }
      await manager.save();

    }));

    // Send emails to super users with data for all locations assigned to them
    // const superUsers = await getAllSuperUsers() 
    // await Promise.all(superUsers.map(async (superUser) => {
    //   const { 
    //      pending,
    //      overdue,
    //      pendingCountFeedback,
    //      pendingCountMeetingRequest,
    //      pendingCountRound,
    //      overdueCountFeedback,
    //      overdueCountMeetingRequest,
    //      overdueCountRound
    //      } = await fetchDataFromMongoDB(superUser.location);

    //   const data = {
    //     pending_feedbacks: pending,
    //     pending_count_feedbacks: pendingCountFeedback,
    //     pending_req_meeting_feedbacks: pendingCountMeetingRequest,
    //     pending_show_round_feedbacks: pendingCountRound,
        
    //     overdue_feedbacks: overdue,
    //     overdue_count_feedbacks: overdueCountFeedback,
    //     overdue_req_meeting: overdueCountMeetingRequest,
    //     overdue_show_round: overdueCountRound,
    //     front_end_url : process.env.FRONTEND_URL

    //   };
    //   await new Email(superUser.email).send(
    //     "WeeklyReportEmail",
    //     "Weekly Roundup for All Locations",
    //     data
    //   );
    // }));

    // // Data to pass to the EJS template
    // const data = {

    //   pending_feedbacks: pending,
    //   pending_count_feedbacks: pendingCountFeedback,
    //   pending_req_meeting_feedbacks: pendingCountMeetingRequest,
    //   pending_show_round_feedbacks: pendingCountRound,
      
    //   overdue_feedbacks: overdue,
    //   overdue_count_feedbacks: overdueCountFeedback,
    //   overdue_req_meeting: overdueCountMeetingRequest,
    //   overdue_show_round: overdueCountRound,

    //   front_end_url : process.env.FRONTEND_URL
    // }
    // const email = process.env.EMAIL_REPORT
    // const subject = "Weekly CFS report"

    // await new Email(email).send("WeeklyReportEmail", subject, data)
    console.log("send")
  } catch (error) {
    console.log(error)
  }
})
