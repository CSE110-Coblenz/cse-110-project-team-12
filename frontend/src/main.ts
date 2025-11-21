import { GameManager } from "./GameManager";

// Initialize the game manager when the page loads
const gameManager = new GameManager("container");
gameManager.start().catch((error) => {
  console.error("Failed to start game:", error);
});
