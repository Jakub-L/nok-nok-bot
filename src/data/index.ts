
import * as greetingsData from './greetings.json';
import * as gameCancelledData from './game-cancelled.json';
import * as gameHappeningData from './game-happening.json';
import * as didYouKnowData from './did-you-know.json';

export const greetings = (greetingsData as any).default as string[];
export const gameCancelled = (gameCancelledData as any).default as string[];
export const gameHappening = (gameHappeningData as any).default as string[];
export const didYouKnow = (didYouKnowData as any).default as string[];
