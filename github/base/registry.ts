import * as fs from "fs";
import * as path from "path";

import * as pulumi from "@pulumi/pulumi";

export interface RegistryBaseConstructor {
  new (): RegistryBase;
}

export class RegistryBase {
  constructor(suffix: string, directory: string) {
    this.init(suffix, directory)
      .then((ResourceRegistry) => {
        ResourceRegistry.forEach((ResourceClass) => {
          new ResourceClass();
        });
      })
      .catch((error) => {
        pulumi.log.error(`Critical error in init method: ${error}`);
        throw error;
      });
  }

  protected async init(suffix: string, directory: string) {
    const anyResourceRegistry = new Map<string, RegistryBaseConstructor>();
    const classesDir = path.join(directory, "./");
    const files = fs.readdirSync(classesDir);

    await Promise.all(
      files.map(async (file) => {
        if (file.endsWith(".ts") && file !== "index.ts") {
          const className = file.replace(".ts", "") + suffix;
          const modulePath = path.join(classesDir, file);

          try {
            const module = await import(modulePath);
            const Class = module[className];
            if (Class) {
              anyResourceRegistry.set(className, Class);
            }
          } catch (error) {
            console.error(`Failed to register ${className} class:`, error);
          }
        }
      }),
    );

    return anyResourceRegistry;
  }
}
