const nodemailer = require("nodemailer");
const User = require("../Db/model");
const Agenda = require("agenda");
async function waitForAgendaReady(agendaScheduler) {
  return new Promise((resolve, reject) => {
    // Set up the event listener
    agendaScheduler.on("ready", () => {
      resolve("Agenda is ready");
    });

    // Optional: Handle errors or specific conditions
    // You might want to add a listener for 'error' event or similar
    agendaScheduler.on("error", (error) => {
      reject(error);
    });
  });
}
const agenda = new Agenda({
  db: { address: process.env.MONGODB_URL },
  collection: "agendaJobs",
});
waitForAgendaReady(agenda);

module.exports.sendEmail = async (req, res) => {
  async function waitForAgendaReady(agendaScheduler) {
    return new Promise((resolve, reject) => {
      // Set up the event listener
      agendaScheduler.on("ready", () => {
        resolve("Agenda is ready");
      });

      // Optional: Handle errors or specific conditions
      // You might want to add a listener for 'error' event or similar
      agendaScheduler.on("error", (error) => {
        reject(error);
      });
    });
  }
  const agenda = new Agenda({
    db: { address: process.env.MONGODB_URL },
    collection: "agendaJobs",
  });
  await waitForAgendaReady(agenda);
  const { to, subject, text, time } = req.body; // include scheduleAt for scheduling
  const userId = req.userID;

  console.log(req.userID);

  const user = await User.findById({ _id: userId });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, msg: "You are not Authorized" });
  }

  // Define a transporter for nodemailer
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  // Define an Agenda job for sending email
  agenda.define("send email", async (job, done) => {
    const { to, subject, text } = job.attrs.data;
    const html = `<h1> hello </h1>`;
    try {
      let info = await transporter.sendMail({
        from: "riyajain2950@gmail.com",
        to: to,
        subject: subject,
        text: text,
        // html: html
      });

      console.log("Message sent: %s", info.messageId);
      done();
    } catch (error) {
      console.error("Error sending email:", error);
      done(error);
    }
  });

  try {
    // Schedule the email
    if (time) {
      const scheduleAt = new Date(Date.now() + time * 60000).toISOString();
      await agenda.schedule(new Date(scheduleAt), "send email", {
        to,
        subject,
        text,
      });
      res.status(200).json({ message: "Email scheduled successfully" });
    } else {
      // Send immediately if no schedule time is provided
      let info = await transporter.sendMail({
        from: "riyajain2950@gmail.com",
        to: to,
        subject: subject,
        text: text,
        // html: html
      });

      console.log("Message sent: %s", info.messageId);
      res.status(200).json({
        message: "Email sent successfully",
        messageId: info.messageId,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to send or schedule email" });
  }
};

// Start Agenda
(async function () {
  await agenda.start();
})();
