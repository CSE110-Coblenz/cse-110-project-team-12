// MapController.ts - Handles user interactions and coordinates between Model and View

import Konva from "konva";
import { MapModel } from "./MapModel";
import { MapView } from "./MapView";

// Controller class to handle user interactions
export class MapController {
  private model: MapModel;
  private view: MapView;
  private correctBuzzer: HTMLAudioElement;
  private wrongBuzzer: HTMLAudioElement;

  constructor(model: MapModel, view: MapView) {
    this.model = model;
    this.view = view;
    this.initEventHandlers();
    this.correctBuzzer = new Audio("/correct_buzzer.mp3");
    this.wrongBuzzer = new Audio("/wrong_buzzer.mp3");
  }

  // Initialize all event handlers
  private initEventHandlers(): void {
    const stage = this.view.getStage();
    stage.on("click", (e) => this.handleStageClick(e));
  }

  // Main click handler
  private handleStageClick(e: Konva.KonvaEventObject<MouseEvent>): void {
    const pointerPos = this.view.getStage().getPointerPosition();
    if (!pointerPos) return;

    // Handle travel path scene
    if (this.model.showingTravelPath) {
      this.handleTravelPathClick(e);
      return;
    }

    // Handle message box visible
    if (this.model.messageBoxVisible) {
      this.handleMessageBoxClick(e);
      return;
    }

    // Handle map click
    this.handleMapClick(pointerPos.x, pointerPos.y);
  }

  // Handle clicks when travel path is showing
  private handleTravelPathClick(e: Konva.KonvaEventObject<MouseEvent>): void {
    let shape: Konva.Node | null = e.target as Konva.Node;
    while (shape) {
      if (shape.name() === "travelPathContinueButton") {
        // Do nothing for now as requested
        return;
      }
      shape = shape.getParent();
    }
    // Ignore all other clicks when travel path is visible
  }

  // Handle clicks when message box is visible
  private handleMessageBoxClick(e: Konva.KonvaEventObject<MouseEvent>): void {
    let shape: Konva.Node | null = e.target as Konva.Node;
    while (shape) {
      if (shape.name() === "continueButton") {
        const wasCorrectGuess = this.model.getLastClickedLocationCorrectness();
        this.dismissMessageBox(wasCorrectGuess);
        return;
      }
      if (shape.name() === "nAmericaMap") {
        // Change map
        return;
      }
      else if (shape.name() === "sAmericaMap") {
        // Change map
        return;
      }
      else if (shape.name() === "africaMap") {
        // Change map
        return;
      }
      else if (shape.name() === "asiaMap") {
        // Change map
        return;
      }
      else if(shape.name() === "europeMap"){
        return;
      }
      else if(shape.name() === "australiaMap"){
      
      }  
      shape = shape.getParent();
      
    }
    // Ignore all other clicks when message box is visible
  }
  
  // map clicks, not finished
  /*
  private handleMapButtonClick(e: Konva.KonvaEventObject<MouseEvent>): void {
    let shape: Konva.Node | null = e.target as Konva.Node;
    while (shape) {
      if (shape.name() === "nAmericaMap") {
        // Change map
        return;
      }
      else if (shape.name() === "sAmericaMap") {
        // Change map
        return;
      }
      else if (shape.name() === "africaMap") {
        // Change map
        return;
      }
      else if (shape.name() === "asiaMap") {
        // Change map
        return;
      }
      else if(shape.name() === "europeMap"){
        return;
      }
      shape = shape.getParent();
    }
    // Ignore all other clicks when travel path is visible
  }
  */
 
  // Handle clicks on the map
  private handleMapClick(clickX: number, clickY: number): void {
    // Check if click is correct
    const wasCorrect = this.model.isClickCorrect(clickX, clickY);

    // Store the clicked location in model
    this.model.addClickedLocation({
      x: clickX,
      y: clickY,
      wasCorrect: wasCorrect,
    });

    // Remove existing markers
    this.view.removeMarkers();

    // Create and display marker
    const marker = wasCorrect
      ? this.view.createStar(clickX, clickY)
      : this.view.createX(clickX, clickY);

    this.view.addShape(marker);

    // Show appropriate message
    if (wasCorrect) {
      this.correctBuzzer.play();
		  this.correctBuzzer.currentTime = 0;
      this.showSuccessMessage();
    } else {
      this.wrongBuzzer.play();
		  this.wrongBuzzer.currentTime = 0;
      this.showIncorrectMessage();
    }

    this.view.draw();
  }

  // Show success message
  private showSuccessMessage(): void {
    const messageBox = this.view.createSuccessMessage();
    this.view.addShape(messageBox);
    this.model.messageBoxVisible = true;
  }

  // Show incorrect message
  private showIncorrectMessage(): void {
    const messageBox = this.view.createIncorrectMessage();
    this.view.addShape(messageBox);
    this.model.messageBoxVisible = true;
  }

  // Dismiss message box
  private dismissMessageBox(wasCorrectGuess: boolean): void {
    this.view.removeMessageBoxes();
    this.model.messageBoxVisible = false;

    // If it was a correct guess and we have locations, show travel path
    if (wasCorrectGuess && this.model.hasClickedLocations()) {
      this.showTravelPath();
    } else {
      this.view.draw();
    }
  }

  // Show travel path visualization
  private showTravelPath(): void {
    this.model.showingTravelPath = true;
    const correctLocations = this.model.getCorrectLocations();
    this.view.renderTravelPath(correctLocations);
  }
}

