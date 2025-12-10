import {
  readdirSync,
  readFileSync,
  statSync,
  watchFile,
  writeFileSync,
  existsSync,
  mkdirSync,
  watch as fsWatch,
} from "fs";
import yargs from "yargs";
import { zennMarkdownToQiitaMarkdown } from "./lib";
import { basename, join } from "path";

const { inputPath, outputPath, watch } = yargs
  .command(
    "* <inputPath> [outputPath]",
    "convert Zenn markdown to Qiita markdown",
  )
  .positional("inputPath", {
    describe: "Zenn markdown filepath to convert",
    type: "string",
    demandOption: true,
  })
  .positional("outputPath", {
    describe: "Path to output Qiita markdown",
    type: "string",
    demandOption: true,
  })
  .option("watch", {
    describe: "Watch for changes in the input file",
    alias: "w",
    type: "boolean",
    default: false,
  })
  .help()
  .alias("help", "h")
  .parseSync();

function convertAndWrite(inputFilePath: string, outputFilePath: string) {
  // Skip non-files (defensive check)
  if (!existsSync(inputFilePath) || !statSync(inputFilePath).isFile()) {
    console.warn(`Skipping ${inputFilePath}: not a file`);
    return;
  }

  const inputContent = readFileSync(inputFilePath, "utf8");
  const outputContent = zennMarkdownToQiitaMarkdown(
    inputContent,
    outputFilePath,
  );
  writeFileSync(outputFilePath, outputContent, "utf8");
}

function isMarkdownFile(filename: string) {
  return /\.(md|mdx)$/i.test(filename);
}

function convertDir(inputDir: string, outputDir: string) {
  const entries = readdirSync(inputDir);
  for (const entry of entries) {
    const fullInputPath = join(inputDir, entry);
    try {
      const stat = statSync(fullInputPath);
      if (stat.isFile() && isMarkdownFile(entry)) {
        const outputFilePath = join(outputDir, entry);
        convertAndWrite(fullInputPath, outputFilePath);
        console.log(`Output written to ${outputFilePath}`);
      } else if (stat.isDirectory()) {
        // Create nested output directory and recurse
        const nestedOutputDir = join(outputDir, entry);
        if (!existsSync(nestedOutputDir)) {
          mkdirSync(nestedOutputDir, { recursive: true });
        }
        convertDir(fullInputPath, nestedOutputDir);
      }
    } catch (err) {
      // Skip unreadable entries
      console.warn(`Failed to process ${fullInputPath}:`, err);
    }
  }
}

function main() {
  try {
    // Check whether input is a directory or a single file
    const inputIsDir = statSync(inputPath).isDirectory();

    if (inputIsDir) {
      // When input is a directory, output must be a directory.
      if (existsSync(outputPath) && !statSync(outputPath).isDirectory()) {
        throw new Error(
          "Output path must be a directory when input is a directory",
        );
      }
      // Ensure output dir exists
      if (!existsSync(outputPath)) {
        mkdirSync(outputPath, { recursive: true });
      }

      // Convert all Markdown files in the directory (recursively)
      convertDir(inputPath, outputPath);
      console.log(`Converted directory ${inputPath} -> ${outputPath}`);

      if (watch) {
        console.log("Watching for changes in directory...");
        const directoryWatcher = fsWatch(
          inputPath,
          { recursive: true },
          (eventType, filename) => {
            if (!filename) return;
            if (!isMarkdownFile(filename)) return;

            const changedInputFile = join(inputPath, filename);
            const changedOutputFile = join(outputPath, filename);

            // On rename events the file may not exist anymore; skip in that case
            if (
              existsSync(changedInputFile) &&
              statSync(changedInputFile).isFile()
            ) {
              console.log(`${filename} changed. Re-converting...`);
              convertAndWrite(changedInputFile, changedOutputFile);
              console.log(`Output written to ${changedOutputFile}`);
            }
          },
        );
      }
    } else {
      // Input is a single file. Output path may be a dir or a file.
      const isOutDir =
        existsSync(outputPath) && statSync(outputPath).isDirectory();
      const outputFilepath = isOutDir
        ? join(outputPath, basename(inputPath))
        : outputPath;

      convertAndWrite(inputPath, outputFilepath);
      console.log(`Output written to ${outputFilepath}`);

      if (watch) {
        console.log("Watching for changes...");
        watchFile(inputPath, { persistent: true, interval: 1000 }, () => {
          console.log("Input file changed. Converting and writing output...");
          convertAndWrite(inputPath, outputFilepath);
          console.log(`Output written to ${outputFilepath}`);
        });
      }
    }
  } catch (err) {
    console.error("Error processing:", err);
  }
}

main();
