declare module "eve" {
  export interface AgentConfig {
    model: string;
    [key: string]: any;
  }
  export function defineAgent(config: AgentConfig): AgentConfig;
}
