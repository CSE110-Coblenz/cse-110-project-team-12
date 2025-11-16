// MapModel.ts - Handles data and business logic

// Interface for clicked locations
export interface ClickedLocation {
  x: number;
  y: number;
  wasCorrect: boolean;
}

// Interface for location coordinates
export interface Location {
  x: number;
  y: number;
}

// Model class to manage application state
export class MapModel {
  // Game state
  public _daysTraveled: number = 0;
  private _hint: string = "example hint";
  private _city: string = "Example City";
  private _country: string = "Example Country";
  
  // Target location and tolerance
  private _correctLocation: Location = { x: 300, y: 400 };
  private _clickTolerance: number = 30;

  // Clicked locations history
  private _clickedLocations: ClickedLocation[] = [];

  // UI state flags
  private _messageBoxVisible: boolean = false;
  private _showingTravelPath: boolean = false;

  // Getters
  get daysTraveled(): number {
    return this._daysTraveled;
  }
  
  get hint(): string {
    return this._hint;
  }

  get city(): string {
    return this._city;
  }

  get country(): string {
    return this._country;
  }

  get correctLocation(): Location {
    return this._correctLocation;
  }

  get clickTolerance(): number {
    return this._clickTolerance;
  }

  get clickedLocations(): ClickedLocation[] {
    return [...this._clickedLocations];
  }

  get messageBoxVisible(): boolean {
    return this._messageBoxVisible;
  }

  get showingTravelPath(): boolean {
    return this._showingTravelPath;
  }

  // Setters
  set messageBoxVisible(value: boolean) {
    this._messageBoxVisible = value;
  }

  set showingTravelPath(value: boolean) {
    this._showingTravelPath = value;
  }

  // Business logic methods
  addClickedLocation(location: ClickedLocation): void {
    this._clickedLocations.push(location);
  }

  isClickCorrect(x: number, y: number): boolean {
    const distance = Math.sqrt(
      Math.pow(x - this._correctLocation.x, 2) +
        Math.pow(y - this._correctLocation.y, 2)
    );
    return distance <= this._clickTolerance;
  }

  getCorrectLocations(): Location[] {
    return this._clickedLocations
      .filter(loc => loc.wasCorrect)
      .map(loc => ({ x: loc.x, y: loc.y }));
  }

  getLastClickedLocationCorrectness(): boolean {
    if (this._clickedLocations.length === 0) return false;
    return this._clickedLocations[this._clickedLocations.length - 1].wasCorrect;
  }

  hasClickedLocations(): boolean {
    return this._clickedLocations.length > 0;
  }

  hasCorrectLocations(): boolean {
    return this.getCorrectLocations().length > 0;
  }
}

