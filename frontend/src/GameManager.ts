import Konva from "konva";
import { IntroScreenController } from "./Intro/screens/IntroScreenController";
import { initMapView } from "./MapView";
import { MapController } from "./MapView/MapController";
import { MapModel } from "./MapView/MapModel";
import { MapView } from "./MapView/MapView";
import { PostcardController } from "./Postcard/PostcardController";
import { PostcardModel } from "./Postcard/PostcardModel";
import { PostcardView } from "./Postcard/PostcardView";
import { Location } from "./Postcard/Location";
import { FlagGameController } from "./FlagMinigame/FlagGameController";

export class GameManager {
    private containerId: string;
    private currentController: any = null;

    constructor(containerId: string) {
        this.containerId = containerId;
    }

    async start() {
        this.showIntro();
    }

    private clearContainer() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = "";
        }
        if (this.currentController && this.currentController.destroy) {
            this.currentController.destroy();
        }
        this.currentController = null;
    }

    private showIntro() {
        this.clearContainer();

        // Intro requires a Konva stage/layer setup
        const stage = new Konva.Stage({
            container: this.containerId,
            width: window.innerWidth,
            height: window.innerHeight,
        });
        const layer = new Konva.Layer();
        stage.add(layer);

        const introController = new IntroScreenController(layer, stage);
        this.currentController = introController;

        // We need to inject a way to know when intro is done.
        // Since IntroScreenController doesn't have a callback, we might need to modify it.
        // For now, I'll assume I'll modify IntroScreenController to accept a callback or I'll monkey-patch it.
        // Ideally, I should modify IntroScreenController.ts to accept an onComplete callback.

        // Temporary hack until I modify IntroScreenController:
        // I'll modify IntroScreenController next to add setOnComplete(cb)
        (introController as any).setOnComplete(() => {
            this.showMap();
        });
    }

    private async showMap() {
        this.clearContainer();

        // Manually initializing Map components to keep reference
        const model = new MapModel();
        const view = new MapView(this.containerId, model);
        await view.init();
        const controller = new MapController(model, view);
        this.currentController = controller;

        // Listen for "Location Found" event
        // I need to add this capability to MapController
        (controller as any).setOnLocationFound((locationData: any) => {
            this.showPostcard(locationData);
        });
    }

    private showPostcard(locationData: any) {
        // Postcard is an overlay, so we might NOT want to clear the map entirely?
        // Or maybe we do. The user said "integrate everything".
        // Usually postcards are overlays.
        // But for simplicity, let's clear and show postcard, or keep map and show postcard on top.
        // The PostcardView seems to create its own Konva stage or HTML elements?
        // Let's check PostcardView.ts.
        // It seems PostcardView uses Konva.

        // If I want to keep the map in background, I shouldn't destroy it.
        // But the current structure implies switching screens.
        // Let's try to keep it simple: Postcard is a separate screen for now, or overlay.

        // Let's assume overlay for better UX.
        // If overlay, I shouldn't clearContainer.

        // However, the PostcardController takes a PostcardView which might create a new Stage.

        const controller = new FlagGameController();
        this.currentController = controller;
        controller.start();

        // When flag game is done
        // FlagGameController destroys itself on close.
        // We need a callback for when it finishes to go back to Map or Next Location.
        // I'll need to modify FlagGameController to accept onFinish callback.
        (controller as any).setOnFinish(() => {
            this.showMap(); // Back to map for next location
        });
    }
}
