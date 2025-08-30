import { execSync } from "child_process";
import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Navigate to the root directory (parent of Server folder)
const rootDir = path.join(__dirname, "..");
process.chdir(rootDir);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter commit message: ", (commitMessage) => {
  try {
    console.log("\n📦 Adding changes from root directory...");
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
