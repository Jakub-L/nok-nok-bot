import type { JsonResponse } from "./utils";

export type Interaction = Record<string, any>;
export type InteractionHandler = (interaction: Interaction) => JsonResponse
export type Command = {
  name: string;
  description: string;
  handler: InteractionHandler;
}