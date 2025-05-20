const admin = require("firebase-admin");
const fs = require("fs");
const csv = require("csv-parser");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const users = [];

// Read users from users.csv
fs.createReadStream("users.csv")
  .pipe(csv())
  .on("data", (row) => {
    users.push(row);
  })
  .on("end", async () => {
    console.log("📄 CSV file successfully processed.");

    let deletedCount = 0;

    for (const user of users) {
      try {
        await admin.auth().deleteUser(user.idNumber);
        const docId = user.idNumber.replace(/\//g, "_");
        await db.collection("users").doc(docId).delete();
        deletedCount++;
        console.log(`✅ Deleted user ${user.idNumber} from Auth and Firestore`);
      } catch (error) {
        console.error(`❌ Failed to delete ${user.idNumber}:`, error.message);
      }
    }
    console.log(`🎉 All done! Total accounts deleted: ${deletedCount}`);
  });