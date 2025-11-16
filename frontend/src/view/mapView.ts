// mapView.ts - MapView component for rendering the game map with Konva.js

import Konva from "konva";

// Interface for location data
export interface LocationData {
  x: number;
  y: number;
  tolerance: number;
  name?: string; // Optional name for the location
}

// Interface for transform data
export interface Transform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

// Type for pulse feedback kind
export type PulseKind = "correct" | "incorrect";

/**
 * MapView class - Handles all Konva rendering for the map
 * This is a standalone view module that can be used by the controller
 */
export class MapView {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private backgroundImage: Konva.Image | Konva.Rect | null = null;
  private transform: Transform = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  };

  /**
   * Constructor - Creates the Konva stage and layer
   * @param containerId - The ID of the HTML container element
   * @param width - Stage width (defaults to window width)
   * @param height - Stage height (defaults to window height)
   */
  constructor(containerId: string, width?: number, height?: number) {
    // Create the Konva stage
    this.stage = new Konva.Stage({
      container: containerId,
      width: width || window.innerWidth,
      height: height || window.innerHeight,
    });

    // Create a layer for all map elements
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  /**
   * Draws the map background
   * Can use a placeholder color or load an image
   * @param imageSrc - Optional image source. If not provided, uses a placeholder color
   */
  drawBackground(imageSrc?: string): void {
    // Remove existing background if it exists
    if (this.backgroundImage) {
      this.backgroundImage.destroy();
      this.backgroundImage = null;
    }

    if (imageSrc) {
      // Load and display an image background
      const imageObj = new Image();
      imageObj.src = imageSrc;

      imageObj.onload = () => {
        this.backgroundImage = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: this.stage.width(),
          height: this.stage.height(),
          name: "background",
        });

        // Add to layer at the bottom
        this.layer.add(this.backgroundImage);
        this.backgroundImage.moveToBottom();
        this.layer.draw();
      };

      imageObj.onerror = () => {
        console.warn("Failed to load background image, using placeholder");
        this.drawBackgroundPlaceholder();
      };
    } else {
      // Use a placeholder color background
      this.drawBackgroundPlaceholder();
    }
  }

  /**
   * Helper method to draw a placeholder background
   */
  private drawBackgroundPlaceholder(): void {
    this.backgroundImage = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      fill: "#e8f4f8", // Light blue color for ocean/water
      name: "background",
    });

    this.layer.add(this.backgroundImage);
    this.backgroundImage.moveToBottom();
    this.layer.draw();
  }

  /**
   * Renders location markers for all provided locations
   * @param locations - Array of location data to render
   */
  renderMarkers(locations: LocationData[]): void {
    // Remove existing markers first
    this.removeMarkers();

    // Create a marker for each location
    locations.forEach((location) => {
      const marker = this.createLocationMarker(location);
      this.layer.add(marker);
    });

    // Draw the layer to show the markers
    this.layer.draw();
  }

  /**
   * Creates a visual marker for a location
   * @param location - Location data
   * @returns A Konva Group containing the marker
   */
  private createLocationMarker(location: LocationData): Konva.Group {
    const group = new Konva.Group({
      x: location.x,
      y: location.y,
      name: "locationMarker",
    });

    // Draw a circle to represent the location
    const circle = new Konva.Circle({
      radius: 8,
      fill: "#4a90e2", // Blue color
      stroke: "#2c5aa0",
      strokeWidth: 2,
    });

    // Draw a smaller inner circle for better visibility
    const innerCircle = new Konva.Circle({
      radius: 4,
      fill: "#ffffff",
    });

    // Add tolerance circle (semi-transparent) to show clickable area
    const toleranceCircle = new Konva.Circle({
      radius: location.tolerance,
      fill: "rgba(74, 144, 226, 0.1)", // Very transparent blue
      stroke: "rgba(74, 144, 226, 0.3)",
      strokeWidth: 1,
    });

    group.add(toleranceCircle);
    group.add(circle);
    group.add(innerCircle);

    // Add optional name label
    if (location.name) {
      const label = new Konva.Text({
        text: location.name,
        fontSize: 12,
        fontFamily: "Arial",
        fill: "#333333",
        x: 15,
        y: -5,
      });
      group.add(label);
    }

    return group;
  }

  /**
   * Removes all location markers from the layer
   */
  private removeMarkers(): void {
    const markers = this.layer.find((node: Konva.Node) => 
      node.name() === "locationMarker"
    );
    markers.forEach((node) => node.destroy());
  }

  /**
   * Gets the current transform (scale and offset)
   * Useful for zoom/pan functionality
   * @returns Transform object with scale, offsetX, and offsetY
   */
  getTransform(): Transform {
    return { ...this.transform };
  }

  /**
   * Sets the transform (for future zoom/pan features)
   * @param transform - Transform object with scale and offsets
   */
  setTransform(transform: Transform): void {
    this.transform = { ...transform };
    // Apply transform to the layer if needed
    this.layer.scale({ x: transform.scale, y: transform.scale });
    this.layer.position({ x: transform.offsetX, y: transform.offsetY });
    this.layer.draw();
  }

  /**
   * Creates a visual pulse effect at a point
   * Green pulse for correct clicks, red for incorrect
   * @param point - { x, y } coordinates where the pulse should appear
   * @param kind - "correct" for green pulse, "incorrect" for red pulse
   */
  pulse(point: { x: number; y: number }, kind: PulseKind): void {
    const color = kind === "correct" ? "#4caf50" : "#f44336"; // Green or red
    const pulseRadius = 30;
    const duration = 500; // milliseconds

    // Create a pulsing circle
    const pulseCircle = new Konva.Circle({
      x: point.x,
      y: point.y,
      radius: 0,
      fill: color,
      opacity: 0.7,
      name: "pulse",
    });

    this.layer.add(pulseCircle);
    pulseCircle.moveToTop();

    // Track animation start time
    const startTime = Date.now();

    // Animate the pulse
    const anim = new Konva.Animation(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0 to 1

      const scale = 1 + progress * 2; // Grow from 1x to 3x
      const opacity = 0.7 * (1 - progress); // Fade from 0.7 to 0

      pulseCircle.radius(pulseRadius * scale);
      pulseCircle.opacity(Math.max(0, opacity));

      // Remove animation and circle when done
      if (progress >= 1) {
        anim.stop();
        pulseCircle.destroy();
        this.layer.draw();
      }
    }, this.layer);

    anim.start();

    // Also draw a small marker at the click point
    const marker = new Konva.Circle({
      x: point.x,
      y: point.y,
      radius: 5,
      fill: color,
      stroke: "white",
      strokeWidth: 2,
      name: "clickMarker",
    });

    this.layer.add(marker);
    marker.moveToTop();
    this.layer.draw();
  }

  /**
   * Gets the Konva stage (useful for event handling in controller)
   * @returns The Konva stage
   */
  getStage(): Konva.Stage {
    return this.stage;
  }

  /**
   * Gets the Konva layer (useful for direct manipulation)
   * @returns The Konva layer
   */
  getLayer(): Konva.Layer {
    return this.layer;
  }

  /**
   * Manually redraws the layer
   * Useful after making changes
   */
  draw(): void {
    this.layer.draw();
  }

  /**
   * Clears all click markers (pulses and click markers)
   */
  clearClickMarkers(): void {
    const clickMarkers = this.layer.find((node: Konva.Node) => 
      node.name() === "clickMarker" || node.name() === "pulse"
    );
    clickMarkers.forEach((node) => node.destroy());
    this.layer.draw();
  }
}

