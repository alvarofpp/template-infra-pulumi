import { RegistryBase } from "../registry";

export class RepositoriesRegistry extends RegistryBase {
  constructor() {
    super("Repository", __dirname);
  }
}
