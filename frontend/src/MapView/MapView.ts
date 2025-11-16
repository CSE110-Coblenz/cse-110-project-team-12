// MapView.ts - Handles UI rendering with Konva

import Konva from "konva";
import worldMapImageSrc from "../public/world_map.jpg";
import nAmericaMapSrc from "../public/namerica_map.jpg";
import sAmericaMapSrc from "../public/samerica_map.jpg";
import africaMapSrc from "../public/africa_map.jpg";
import asiaMapSrc from "../public/asia_map.jpg";
import australiaMapSrc from "../public/australia_map.jpg";
import europeMapSrc from "../public/europe_map.jpg";
import { MapModel, Location } from "./MapModel";

// View class to manage Konva rendering
export class MapView {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private model: MapModel;
  private days: number = 1;

  constructor(containerId: string, model: MapModel) {
    this.model = model;

    // Create stage
    this.stage = new Konva.Stage({
      container: containerId,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Create layer
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.addButtons();
  }

  // Initialize the map view
  async init(): Promise<void> {
    await this.loadWorldMap("worldMap");
  }

  // Get the stage for event handling
  getStage(): Konva.Stage {
    return this.stage;
  }

  // Get the layer for manipulation
  getLayer(): Konva.Layer {
    return this.layer;
  }
  private addButtons(): Konva.Group{
    const mapButtonGroup = new Konva.Group();

    // north america button
      const nAmericaGroup = new Konva.Group();
      const nAmericaButton = new Konva.Rect({
        x: window.innerWidth / 2 - 100,
        y: 300,
        width: 200,
        height: 60,
        fill: "red",
        cornerRadius: 10,
        stroke: "black",
        strokeWidth: 3,
      });
      const nAmericaText = new Konva.Text({
        x: window.innerWidth / 2,
        y: 315,
        text: "North America Map",
        fontSize: 24,
        fontFamily: "Arial",
        fill: "white",
        align: "center",
      });
      nAmericaText.offsetX(nAmericaText.width() / 2);
      nAmericaGroup.add(nAmericaButton);
      nAmericaGroup.add(nAmericaText);
      nAmericaGroup.on("click", () => {
        this.loadWorldMap("nAmericaMap");
      });
      mapButtonGroup.add(nAmericaGroup);

      // south america button
      const sAmericaGroup = new Konva.Group();
      const sAmericaButton = new Konva.Rect({
        x: window.innerWidth / 2 - 100,
        y: 350,
        width: 200,
        height: 60,
        fill: "red",
        cornerRadius: 10,
        stroke: "black",
        strokeWidth: 3,
      });
      const sAmericaText = new Konva.Text({
        x: window.innerWidth / 2,
        y: 350,
        text: "South America Map",
        fontSize: 24,
        fontFamily: "Arial",
        fill: "white",
        align: "center",
      });
      sAmericaText.offsetX(sAmericaText.width() / 2);
      sAmericaGroup.add(sAmericaButton);
      sAmericaGroup.add(sAmericaText);
      sAmericaGroup.on("click", () => {
        this.loadWorldMap("sAmericaMap");
      });
      mapButtonGroup.add(sAmericaGroup);

      // europe button
      const europeGroup = new Konva.Group();
      const europeButton = new Konva.Rect({
        x: window.innerWidth / 2 - 100,
        y: 400,
        width: 200,
        height: 60,
        fill: "red",
        cornerRadius: 10,
        stroke: "black",
        strokeWidth: 3,
      });
      const europeText = new Konva.Text({
        x: window.innerWidth / 2,
        y: 400,
        text: "Europe Map",
        fontSize: 24,
        fontFamily: "Arial",
        fill: "white",
        align: "center",
      });
      europeText.offsetX(europeText.width() / 2);
      europeGroup.add(europeButton);
      europeGroup.add(europeText);
      europeGroup.on("click", () => {
        this.loadWorldMap("europeMap");
      });
      mapButtonGroup.add(europeGroup);

      // asia button
      const asiaGroup = new Konva.Group();
      const asiaButton = new Konva.Rect({
        x: window.innerWidth / 2 - 100,
        y: 450,
        width: 200,
        height: 60,
        fill: "red",
        cornerRadius: 10,
        stroke: "black",
        strokeWidth: 3,
      });
      const asiaText = new Konva.Text({
        x: window.innerWidth / 2,
        y: 450,
        text: "Asia Map",
        fontSize: 24,
        fontFamily: "Arial",
        fill: "white",
        align: "center",
      });
      asiaText.offsetX(asiaText.width() / 2);
      asiaGroup.add(asiaButton);
      asiaGroup.add(asiaText);
      asiaGroup.on("click", () => {
        this.loadWorldMap("asiaMap");
      });
      mapButtonGroup.add(asiaGroup);

      // africa button
      const africaGroup = new Konva.Group();
      const africaButton = new Konva.Rect({
        x: window.innerWidth / 2 - 100,
        y: 500,
        width: 200,
        height: 60,
        fill: "red",
        cornerRadius: 10,
        stroke: "black",
        strokeWidth: 3,
      });
      const africaText = new Konva.Text({
        x: window.innerWidth / 2,
        y: 500,
        text: "Africa Map",
        fontSize: 24,
        fontFamily: "Arial",
        fill: "white",
        align: "center",
      });
      africaText.offsetX(africaText.width() / 2);
      africaGroup.add(africaButton);
      africaGroup.add(africaText);
      africaGroup.on("click", () => {
        this.loadWorldMap("africaMap");
      });
      mapButtonGroup.add(africaGroup);

      // australia button
      const australiaGroup = new Konva.Group();
      const australiaButton = new Konva.Rect({
        x: window.innerWidth / 2 - 100,
        y: 550,
        width: 200,
        height: 60,
        fill: "red",
        cornerRadius: 10,
        stroke: "black",
        strokeWidth: 3,
      });
      const australiaText = new Konva.Text({
        x: window.innerWidth / 2,
        y: 550,
        text: "Europe Map",
        fontSize: 24,
        fontFamily: "Arial",
        fill: "white",
        align: "center",
      });
      australiaText.offsetX(australiaText.width() / 2);
      australiaGroup.add(australiaButton);
      australiaGroup.add(australiaText);
      australiaGroup.on("click", () => {
        this.loadWorldMap("australiaMap");
      });
      mapButtonGroup.add(australiaGroup);

      return mapButtonGroup;

  }
  // Load and display world map
  private loadWorldMap(mapName: string): Promise<void> {
 // private loadWorldMap(mapName: string): void{
     return new Promise((resolve, reject) => {
      const imageObj = new Image();
      if(mapName == "worldMap"){
        imageObj.src = worldMapImageSrc;
      }
      else if(mapName == "nAmericaMap"){
        imageObj.src = nAmericaMapSrc;
      }
      else if(mapName == "sAmericaMap"){
        imageObj.src = sAmericaMapSrc;
      }
      else if(mapName == "africaMap"){
        imageObj.src == africaMapSrc;
      }
      else if(mapName == "europeMap"){
        imageObj.src == europeMapSrc;
      }
      else if(mapName == "australiaMap"){
        imageObj.src == australiaMapSrc;
      }
      else if(mapName == "asiaMap"){
        imageObj.src == asiaMapSrc;
      }

      imageObj.onload = () => {
        const worldMap = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: this.stage.width(),
          height: this.stage.height(),
        });

        this.layer.add(worldMap);
        this.renderDaysTraveledText();
        this.layer.draw();
         resolve();
      };

      imageObj.onerror = (error) => {
        console.error("Failed to load world map image:", error);
         reject(error);
      };
    });

    
  }

  // Render days traveled text
  private renderDaysTraveledText(): void {
    const text = new Konva.Text({
      x: this.stage.width() - 250,
      y: 20,
      text: `Days Traveled: ${this.model.daysTraveled}`,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "black",
      name: "daysTraveledText",
    });

    this.layer.add(text);
    text.moveToTop();
  }

  

  // Create a star marker
  createStar(x: number, y: number): Konva.Star {
    return new Konva.Star({
      x: x,
      y: y,
      numPoints: 5,
      innerRadius: 8,
      outerRadius: 15,
      fill: "gold",
      stroke: "orange",
      strokeWidth: 2,
      name: "marker",
    });
  }

  // Create an X marker
  createX(x: number, y: number): Konva.Group {
    const group = new Konva.Group({
      x: x,
      y: y,
      name: "marker",
    });

    const line1 = new Konva.Line({
      points: [-10, -10, 10, 10],
      stroke: "red",
      strokeWidth: 3,
      lineCap: "round",
      lineJoin: "round",
    });

    const line2 = new Konva.Line({
      points: [-10, 10, 10, -10],
      stroke: "red",
      strokeWidth: 3,
      lineCap: "round",
      lineJoin: "round",
    });

    group.add(line1);
    group.add(line2);
    return group;
  }

  // Create success message box
  createSuccessMessage(): Konva.Group {
    const messageGroup = new Konva.Group({
      name: "messageBox",
    });
    const messageText = `You clicked on the correct city! This postcard of ${this.model.hint} belongs to: ${this.model.city}, ${this.model.country}!`;
    
    const { background, text, buttonBackground, buttonText } = this.createMessageBox(messageText);
    
    this.model._daysTraveled += this.days;
    this.days = 1;
    messageGroup.add(background);
    messageGroup.add(text);
    messageGroup.add(buttonBackground);
    messageGroup.add(buttonText);
    return messageGroup;
  }

  // Create incorrect message box
  createIncorrectMessage(): Konva.Group {
    const messageGroup = new Konva.Group({
      name: "messageBox",
    });

    const messageText = `Oh no! Your next location is ${this.model.hint}. Good luck!`;
    
    const { background, text, buttonBackground, buttonText } = this.createMessageBox(messageText);

    this.days++;
    messageGroup.add(background);
    messageGroup.add(text);
    messageGroup.add(buttonBackground);
    messageGroup.add(buttonText);
    return messageGroup;
  }

  // Helper to create message box components
  private createMessageBox(messageText: string) {
    const padding = 20;
    const maxWidth = Math.min(this.stage.width() * 0.7, 600);
    
    // Create text with wrapping to measure height
    const text = new Konva.Text({
      text: messageText,
      fontSize: 18,
      fontFamily: "Arial",
      fill: "black",
      width: maxWidth - padding * 2,
      align: "center",
      wrap: "word",
    });

    const textHeight = text.height();
    const boxWidth = maxWidth;
    const boxHeight = textHeight + padding * 2;

    // Center the box on the stage
    const boxX = (this.stage.width() - boxWidth) / 2;
    const boxY = (this.stage.height() - boxHeight) / 2;

    // Create white translucent background
    const background = new Konva.Rect({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      fill: "rgba(255, 255, 255, 0.9)",
      cornerRadius: 10,
      stroke: "black",
      strokeWidth: 2,
    });

    // Position the text
    text.x(boxX + padding);
    text.y(boxY + padding);

    // Create continue button
    const buttonWidth = 120;
    const buttonHeight = 40;
    const buttonX = boxX + (boxWidth - buttonWidth) / 2;
    const buttonY = boxY + boxHeight + 10;

    const buttonBackground = new Konva.Rect({
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
      fill: "red",
      cornerRadius: 5,
      name: messageText,
    });

    const buttonText = new Konva.Text({
      x: buttonX + buttonWidth / 2,
      y: buttonY + buttonHeight / 2,
      text: "Continue",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
      verticalAlign: "middle",
      name: messageText,
    });

    buttonText.offsetX(buttonText.width() / 2);
    buttonText.offsetY(buttonText.height() / 2);

    return { background, text, buttonBackground, buttonText };
  }

  // Remove existing markers from the layer
  removeMarkers(): void {
    const markers = this.layer.find((node: Konva.Node) => node.name() === "marker");
    markers.forEach((node) => node.destroy());
  }

  // Remove message boxes from the layer
  removeMessageBoxes(): void {
    const messages = this.layer.find((node: Konva.Node) => node.name() === "messageBox");
    messages.forEach((node) => node.destroy());
  }

  // Add a shape to the layer and move it to top
  addShape(shape: Konva.Shape | Konva.Group): void {
    this.layer.add(shape);
    shape.moveToTop();
  }

  // Render travel path visualization
  renderTravelPath(correctLocations: Location[]): void {
    // Hide markers but keep map and text visible
    const markers = this.layer.find((node: Konva.Node) => node.name() === "marker");
    markers.forEach((node) => node.hide());
    
    const pathGroup = new Konva.Group({
      name: "travelPath",
    });

    // Draw lines connecting correct locations in order
    if (correctLocations.length > 1) {
      for (let i = 0; i < correctLocations.length - 1; i++) {
        const start = correctLocations[i];
        const end = correctLocations[i + 1];
        
        const line = new Konva.Line({
          points: [start.x, start.y, end.x, end.y],
          stroke: "red",
          strokeWidth: 2,
        });
        
        pathGroup.add(line);
      }
    }

    // Draw yellow dots at each correct location
    correctLocations.forEach((location, index) => {
      const dot = new Konva.Circle({
        x: location.x,
        y: location.y,
        radius: 6,
        fill: "yellow",
        stroke: "black",
        strokeWidth: 1,
      });
      
      // Add number label
      const label = new Konva.Text({
        x: location.x,
        y: location.y - 20,
        text: `${index + 1}`,
        fontSize: 14,
        fontFamily: "Arial",
        fill: "black",
        align: "center",
      });
      label.offsetX(label.width() / 2);
      
      pathGroup.add(dot);
      pathGroup.add(label);
    });

    this.layer.add(pathGroup);
    pathGroup.moveToTop();

    // Create continue button for travel path
    const buttonWidth = 120;
    const buttonHeight = 40;
    const buttonX = (this.stage.width() - buttonWidth) / 2;
    const buttonY = this.stage.height() - 60;

    const buttonBackground = new Konva.Rect({
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
      fill: "red",
      cornerRadius: 5,
      name: "travelPathContinueButton",
    });

    const buttonText = new Konva.Text({
      x: buttonX + buttonWidth / 2,
      y: buttonY + buttonHeight / 2,
      text: "Continue",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
      verticalAlign: "middle",
      name: "travelPathContinueButton",
    });

    buttonText.offsetX(buttonText.width() / 2);
    buttonText.offsetY(buttonText.height() / 2);

    this.layer.add(buttonBackground);
    this.layer.add(buttonText);
    buttonBackground.moveToTop();
    buttonText.moveToTop();
    
    this.layer.draw();
  }

  // Redraw the layer
  draw(): void {
    this.layer.draw();
  }
}
