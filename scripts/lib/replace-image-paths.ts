import { execSync } from "child_process";
import GitUrlParse from "git-url-parse";

interface RepoInfo {
  owner: string;
  repo: string;
  branch: string;
}

function tryExec(cmd: string): string {
  try {
    // Keep stdout only; ignore stderr to avoid noisy output
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

function getCurrentBranch(): string {
  return tryExec("git rev-parse --abbrev-ref HEAD");
}

function getRemoteUrl(): string {
  return tryExec("git config --get remote.origin.url");
}

function getRepoInfo(): RepoInfo {
  const remoteUrl = getRemoteUrl();
  if (!remoteUrl) {
    // Not a git repository or remote not configured; return empty info so caller can skip replacement
    return { owner: "", repo: "", branch: "" };
  }

  let gitInfo = null;
  try {
    gitInfo = GitUrlParse(remoteUrl);
  } catch {
    // Unable to parse remote URL; return empty info
    return { owner: "", repo: "", branch: "" };
  }

  const owner = gitInfo?.owner || "";
  const repo = gitInfo?.name || "";
  const branch = getCurrentBranch() || "";

  return { owner, repo, branch };
}

export function replaceImagePaths(inputContent: string): string {
  const { owner, repo, branch } = getRepoInfo();

  // If we couldn't determine repository information, don't perform replacement
  if (!owner || !repo || !branch) {
    return inputContent;
  }

  const githubRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;

  // Split by code blocks
  const parts = inputContent.split(/(```.*?```)/gs);

  // Only replace image paths outside of code blocks
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i].startsWith("```")) {
      parts[i] = parts[i].replace(
        /!\[\]\((\/.*?)\)/g,
        `![](${githubRawUrl}$1)`,
      );
    }
  }

  // Rejoin the markdown
  return parts.join("");
}
