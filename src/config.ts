import * as TOML from "fast-toml";
import * as fs from "fs";

export type Config = {
  database: {
    path: string;
  };
  discord: {
    channel_id: string;
    token: string;
  };
  sender: {
    endpoint: string;
    seed: string;
  };
};

export const readConfig = (configPath = "config.toml") => {
  const content = fs.readFileSync(configPath, { encoding: "utf-8" });
  return TOML.parse(content) as Config;
};
