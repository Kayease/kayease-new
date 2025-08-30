import { execSync } from "child_process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter commit message: ", (commitMessage) => {
  try {
    console.log("\n📦 Adding changes...");
    execSync("git add .", { stdio: "inherit" });

    console.log("📝 Committing changes...");
    execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

    console.log("🚀 Pushing to origin/main...");
    execSync("git push origin main", { stdio: "inherit" });

    console.log("\n✅ All done! Code pushed successfully.");
  } catch (error) {
    console.error("\n❌ Something went wrong:", error.message);
  } finally {
    rl.close();
  }
});
