const { SendEmailCommand, } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

// const sendEmail = async () => {
//   const params = {
//     Destination: {
//       CcAddress : [],
//       ToAddresses: ["receiver@example.com"], // ✅ Verified OR any email if prod access
//     },
//     Message: {
//       Body: {
//         Html: {
//           Charset: "UTF-8",
//           Data: "<h2>Hello from AWS SES</h2><p>This is a test email.</p>",
//         },
//         Text: {
//           Charset: "UTF-8",
//           Data: "Hello from AWS SES. This is a test email.",
//         },
//       },
//       Subject: {
//         Charset: "UTF-8",
//         Data: "Test Email from Node.js",
//       },
//     },
//     Source: "sender@example.com", // ✅ MUST be verified in SES
//   };

//   try {
//     const command = new SendEmailCommand(params);
//     const response = await sesClient.send(command);
//     console.log("Email sent successfully:", response.MessageId);
//   } catch (error) {
//     console.error("Email send failed:", error);
//   }
// };

// sendEmail();

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
      CcAddresses: [],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h2>Hello from AWS SES</h2><p>${body}</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Hello from AWS SES. This is a test email.",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [fromAddress],
  });
};

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "vishalsingh800624@gmail.com", // ✅ receiver
    "sender@example.com",          // ✅ verified sender
    subject, 
    body,
  );

  try {
    const response = await sesClient.send(sendEmailCommand);
    console.log("Email sent:", response.MessageId);
    return response;
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      console.error("Message rejected:", caught.message);
      return caught;
    }
    throw caught;
  }
};

module.exports = { run };