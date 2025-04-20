import type { JsonResponse } from "./json-response";

export type Interaction = Record<string, any>;
export type InteractionHandler = (interaction: Interaction) => JsonResponse
export type Command = {
  name: string;
  description: string;
  handler: InteractionHandler;
}