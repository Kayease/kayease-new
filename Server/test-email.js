import { testEmailConnection } from "./utils/emailService.js";

console.log("Testing email connection...");

try {
  const result = await testEmailConnection();
  if (result.success) {
    console.log("✅ Email connection test successful!");
    console.log("Message:", result.message);
  } else {
    console.log("❌ Email connection test failed!");
    console.log("Error:", result.error);
  }
} catch (error) {
  console.log("❌ Email connection test failed with exception!");
  console.log("Error:", error.message);
}
