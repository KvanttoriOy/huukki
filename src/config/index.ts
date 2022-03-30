import { Config } from "@/types/config"
import { readFile } from "fs/promises"
import path from "path"

const DEFAULT_CONFIG: Config = {
  port: 8080,
  path: "/",
  branch: "master",
  secret: "test",
  commands: ["git pull"],
}

export const readConfig = async (): Promise<Config> => {
  const configFilePath = path.resolve(process.cwd(), "./config.json")

  const userConfig = await readFile(configFilePath)
    .then((d) => JSON.parse(d.toString()) as Partial<Config>)
    .catch((err) => {
      console.log(err)
      console.error(
        "\nconfig.json failed to load, using default config:\n" +
          JSON.stringify(DEFAULT_CONFIG, null, " ")
      )
      return DEFAULT_CONFIG as Partial<Config>
    })

  const mergedConfig = { ...DEFAULT_CONFIG, ...userConfig }

  console.log("using the following config:", JSON.stringify(mergedConfig, null, " "))

  return mergedConfig
}
