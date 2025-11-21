// MapController.ts - Handles user interactions and coordinates between Model and View

import Konva from "konva";
import { MapModel } from "./MapModel";
import { MapView } from "./MapView";

// Controller class to handle user interactions
export class MapController {
  private model: MapModel;
  private view: MapView;

  constructor(model: MapModel, view: MapView) {
    this.model = model;
    this.view = view;
    this.initEventHandlers();
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
        // Hide travel path and return to map
        this.hideTravelPath();
        return;
      }
      shape = shape.getParent();
    }
    // Ignore all other clicks when travel path is visible
  }

  // Hide travel path and return to map view
  private hideTravelPath(): void {
    this.model.showingTravelPath = false;
    // Remove travel path elements
    const travelPathElements = this.view.getLayer().find((node: Konva.Node) =>
      node.name() === "travelPath" || node.name() === "travelPathContinueButton"
    );
    travelPathElements.forEach((node) => node.destroy());

    // Show target location marker for the new location
    this.view.showTargetLocation();
    this.view.draw();
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
      shape = shape.getParent();
    }
    // Ignore all other clicks when message box is visible
  }

  // Handle clicks on the map
  private handleMapClick(clickX: number, clickY: number): void {
    // Convert click coordinates from displayed space to original image space
    const originalClick = this.view.unscaleCoordinates({ x: clickX, y: clickY });

    // Check if click is correct (using original image coordinates)
    const wasCorrect = this.model.isClickCorrect(originalClick.x, originalClick.y);

    // Debug: Log click coordinates and target location
    const target = this.model.correctLocation;
    const distance = Math.sqrt(
      Math.pow(originalClick.x - target.x, 2) + Math.pow(originalClick.y - target.y, 2)
    );
    console.log("=== CLICK DEBUG ===");
    console.log("Click coordinates (displayed):", clickX, clickY);
    console.log("Click coordinates (original):", originalClick.x, originalClick.y);
    console.log("Target location (original):", target.x, target.y);
    console.log("Distance:", distance.toFixed(2), "Tolerance:", this.model.clickTolerance);
    console.log("Was correct:", wasCorrect);
    console.log("Current location:", this.model.city);
    console.log("\n💡 To update coordinates in JSON:");
    console.log(`"worldMap": { "x": ${originalClick.x}, "y": ${originalClick.y}, "tolerance": 30 }`);

    // Store the clicked location in model (using original coordinates)
    this.model.addClickedLocation({
      x: originalClick.x,
      y: originalClick.y,
      wasCorrect: wasCorrect,
    });

    // Remove existing markers
    this.view.removeMarkers();

    // Create and display marker (using displayed coordinates for rendering)
    const marker = wasCorrect
      ? this.view.createStar(clickX, clickY)
      : this.view.createX(clickX, clickY);

    this.view.addShape(marker);

    // Show appropriate message
    if (wasCorrect) {
      this.showSuccessMessage();
    } else {
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

  private onLocationFound: ((locationData: any) => void) | null = null;

  setOnLocationFound(callback: (locationData: any) => void) {
    this.onLocationFound = callback;
  }

  // Dismiss message box
  private dismissMessageBox(wasCorrectGuess: boolean): void {
    this.view.removeMessageBoxes();
    this.model.messageBoxVisible = false;

    // If it was a correct guess, advance to next location
    if (wasCorrectGuess) {
      // Notify listener about the found location BEFORE advancing (so we can show postcard for CURRENT location)
      if (this.onLocationFound) {
        const currentLocation = this.model.getCurrentLocationData();
        if (currentLocation) {
          this.onLocationFound(currentLocation);
          // We might want to pause here? 
          // The postcard will take over.
          // But if we return here, we don't advance?
          // The user wants "Postcard -> Flag Game -> Next Location".
          // So we should probably NOT advance yet?
          // Or advance but don't show it yet?

          // If I call onLocationFound, the GameManager switches to Postcard.
          // The MapView is destroyed (or hidden).
          // When we come back to Map, we want to be at the NEXT location.
          // So we SHOULD advance here.
        }
      }

      const hasMoreLocations = this.model.advanceToNextLocation();

      // Update the hint display with the new location
      this.view.updateHint();

      // Update target location marker for the new location
      this.view.hideTargetLocation();
      this.view.showTargetLocation();

      // If we have clicked locations, show travel path
      if (this.model.hasClickedLocations()) {
        this.showTravelPath();
      } else if (hasMoreLocations) {
        // Update the view to show the new hint/location
        this.view.draw();
      } else {
        // Game complete!
        console.log("Game complete! All locations found!");
        this.view.draw();
      }
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

