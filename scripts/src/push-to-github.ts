import { execSync } from "child_process";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_URL = process.env.GITHUB_REPO_URL;

if (!GITHUB_TOKEN) {
  console.error(
    "Error: GITHUB_TOKEN secret is not set.\n" +
      "Add it in Replit Secrets with your GitHub Personal Access Token."
  );
  process.exit(1);
}

if (!GITHUB_REPO_URL) {
  console.error(
    "Error: GITHUB_REPO_URL is not set.\n" +
      "Add it in Replit environment variables, e.g.:\n" +
      "  https://github.com/your-username/your-repo.git"
  );
  process.exit(1);
}

const repoUrlWithToken = GITHUB_REPO_URL.replace(
  "https://",
  `https://${GITHUB_TOKEN}@`
);

function run(cmd: string, opts?: { cwd?: string }) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

try {
  const remotes = execSync("git remote").toString().trim().split("\n");

  if (!remotes.includes("github")) {
    console.log("Adding GitHub remote...");
    run(`git remote add github ${repoUrlWithToken}`);
  } else {
    console.log("Updating GitHub remote URL...");
    run(`git remote set-url github ${repoUrlWithToken}`);
  }

  const branch = execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim();
  console.log(`Pushing branch '${branch}' to GitHub...`);
  run(`git push github ${branch} --follow-tags --force`);

  console.log(`\nSync complete. Branch '${branch}' is now on GitHub.`);
} catch (err) {
  console.error("Push to GitHub failed:", err);
  process.exit(1);
}
