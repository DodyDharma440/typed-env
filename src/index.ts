#! /usr/local/bin/node
import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const generate = () => {
  const argv = yargs(hideBin(process.argv)).command(
    "gen [file] [name]",
    "generate the env declaration file",
    (yargs) => {
      return yargs
        .positional("file", {
          describe: "env file for declaration",
        })
        .positional("name", {
          describe: "declaration file name",
          default: "env",
        });
    }
  ).argv;

  if (argv instanceof Promise) {
    return;
  }
  const [envFile, fileName = "env"] = argv._;

  if (!envFile) {
    console.error("Please specify the env file");
    process.exit(1);
  }

  fs.readFile(envFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const splitted = data.split("\n").join("=").split("=");
    const key = splitted.filter((_, i) => i % 2 === 0);
    const mappedKeys = key
      .map((k, index) => {
        const isFirst = index === 0;
        const isLast = index === key.length - 1;
        return `${isFirst ? "" : "      "}${k}: string; ${isLast ? "" : "\n"}`;
      })
      .join("");

    const content = `export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ${mappedKeys}
    }
  }
}`;
    try {
      fs.writeFileSync(`${fileName}.d.ts`, content);
      console.log(
        `Generated declaration file for ${envFile} in ${fileName}.d.ts`
      );
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
};

generate();
