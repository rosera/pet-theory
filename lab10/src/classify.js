import * as tf from "@tensorflow/tfjs";
//import "core-js/stable";
import "@babel/polyfill";
//import "regenerator-runtime/runtime";
import { CLASSES } from "./labels.js";

const photo = document.getElementById("file");
const classify = document.getElementById("submit");
const modelPath =
    "https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1";

let model;
let myTensor;
let readyfied;
let results;

// TODO: onLoad function - load model
window.addEventListener('load', loadModel);
window.addEventListener('unload', disposeModel);

async function loadModel(){
  await tf.ready();

  model = await tf.loadGraphModel(modelPath, { fromTFHub: true });
}

async function disposeModel(){
   // Mega Clean
   tf.dispose([
     results[0],
     results[1],
     model,
     nmsDetections.selectedIndices,
     nmsDetections.selectedScores,
     prominentDetection.indices,
     prominentDetection.values,
     myTensor,
     readyfied,
     justBoxes,
     justValues,
   ]);
}


photo.addEventListener('change', (event) => {
  console.log("Load Image");

  let image = document.getElementById('output');
  let ctx = detection.getContext("2d");
  ctx.clearRect(0, 0, image.width, image.height);
  image.src = URL.createObjectURL(event.target.files[0]);
})

classify.addEventListener('click', (event) => {
  let btnPhoto  = document.getElementById('output');
  let detection = document.getElementById("detection");

  analysePhoto(btnPhoto, detection);
})

async function analysePhoto(mysteryImage, detection) {
   const myTensor = tf.browser.fromPixels(mysteryImage);
 
   // SSD Mobilenet single batch
   const readyfied = tf.expandDims(myTensor, 0);
   const results = await model.executeAsync(readyfied);


  // -----------------------------------------------------------------------
  // Prep Canvas
  const ctx = detection.getContext("2d");
  const imgWidth = mysteryImage.width;
  const imgHeight = mysteryImage.height;

  // NOTE: To use remote images add cross Origin header
  detection.crossOrigin = "anonymous";
  detection.width = imgWidth;
  detection.height = imgHeight;
  ctx.font = "16px sans-serif";
  ctx.textBaseline = "top";

  // Get a clean tensor of top indices
  const detectionThreshold = 0.4;
  const iouThreshold = 0.5;
  const maxBoxes = 20;
  const prominentDetection = tf.topk(results[0]);
  const justBoxes = results[1].squeeze();
  const justValues = prominentDetection.values.squeeze();

  // Move results back to JavaScript in parallel
  const [maxIndices, scores, boxes] = await Promise.all([
    prominentDetection.indices.data(),
    justValues.array(),
    justBoxes.array(),
  ]);

  // https://arxiv.org/pdf/1704.04503.pdf, use Async to keep visuals
  const nmsDetections = await tf.image.nonMaxSuppressionWithScoreAsync(
    justBoxes, // [numBoxes, 4]
    justValues, // [numBoxes]
    maxBoxes,
    iouThreshold,
    detectionThreshold,
    1 // 0 is normal NMS, 1 is Soft-NMS for overlapping support
  );

  const chosen = await nmsDetections.selectedIndices.data();

  chosen.forEach((detection) => {
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 4;
    ctx.globalCompositeOperation = "destination-over";
    const detectedIndex = maxIndices[detection];
    const detectedClass = CLASSES[detectedIndex];
    const detectedScore = scores[detection];
    const dBox = boxes[detection];

    // No negative values for start positions
    const startY = dBox[0] > 0 ? dBox[0] * imgHeight : 0;
    const startX = dBox[1] > 0 ? dBox[1] * imgWidth : 0;
    const height = (dBox[2] - dBox[0]) * imgHeight;
    const width = (dBox[3] - dBox[1]) * imgWidth;
    if (Math.round(detectedScore*100) > 80) {
      ctx.strokeStyle = "#3fa";
    } else {
      ctx.strokeStyle = "#6bb";
    }
    ctx.strokeRect(startX, startY, width, height);

    // Draw the label background.
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#FFF";
    const textHeight = 16;
    const textPad = 6;
    const label = `${detectedClass} ${Math.round(detectedScore * 100)}%`;
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(startX+4, startY+4, textWidth + textPad, textHeight + textPad);

    // Draw the text last to ensure it's on top.
    ctx.fillStyle = "#000";
    ctx.fillText(label, startX+6, startY+6);
  });

  console.log("Tensor Memory Status:", tf.memory().numTensors);
}
