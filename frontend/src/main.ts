// import Konva from "konva";
// import {IntroScene} from "./Intro/screens/IntroScene.ts";
// import { IntroScreenController } from "./Intro/screens/IntroScreenController.ts";

// // first we need to create a stage
// const stage = new Konva.Stage({
//   container: "container",
//   width: window.innerWidth,
//   height: window.innerHeight,
// });

// // then create layer
// const layer = new Konva.Layer();
// stage.add(layer);

// // create our shape
// const circle = new Konva.Circle({
//   x: stage.width() / 2,
//   y: stage.height() / 2,
//   radius: 70,
//   fill: "red",
//   stroke: "black",
//   strokeWidth: 4,
// });

// // let introScene :IntroScene;
// // introScene = new IntroScene(layer, stage);
// let introScreenController = new IntroScreenController(layer, stage);
// introScreenController.getView().show();

// layer.add(introScreenController.getView().getGroup());
// // add the shape to the layer
// //layer.add(circle);

// // add the layer to the stage
// stage.add(layer);
import Konva from "konva";
import { MoneyController } from "./MoneyMiniGame/MoneyController.ts";

const stage = new Konva.Stage({
  container: "container",
  width: window.innerWidth,
  height: window.innerHeight,
});

// then create layer
const layer = new Konva.Layer();
stage.add(layer);

// create our shape
const circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 70,
  fill: "red",
  stroke: "black",
  strokeWidth: 4,
});

//layer.add(circle);
console.log("Main Monet");

let controller = new MoneyController(stage, layer, stage.width(), stage.height());
controller.show();

layer.add(controller.getGroup());

// add the layer to the stage
stage.add(layer);
