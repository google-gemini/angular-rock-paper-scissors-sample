/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {GameHandler} from './../services/game-handler.service';
import {AiStrategy} from '../interfaces/ai-strategy';
import {ElementRef, WritableSignal} from '@angular/core';
import {HandPose} from '@tensorflow-models/handpose';
import {AnticipateStrategy} from '../services/ai-strategies/anticipate-strategy.service';
import {lookForGesture} from './fingerpose-handler';

const circleRadius = 5;

function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
  ctx.fill();
}

function drawPath(ctx: CanvasRenderingContext2D, points: number[][]) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();
}

function drawFinger(ctx: CanvasRenderingContext2D, keypoints: number[][]) {
  const pathPoints = [];
  for (let i = 0; i < keypoints.length; i++) {
    drawPoint(ctx, keypoints[i][0], keypoints[i][1]);
    pathPoints.push(keypoints[i]);
  }
  drawPath(ctx, pathPoints);
}

function drawHand(ctx: CanvasRenderingContext2D, keypoints: number[][]) {
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.fillStyle = '#FFFFFF';

  // draw palm
  drawPath(ctx, [
    keypoints[0],
    keypoints[5],
    keypoints[9],
    keypoints[13],
    keypoints[17],
    keypoints[0],
  ]);
  // thumb
  drawFinger(ctx, keypoints.slice(0, 5));
  // index
  drawFinger(ctx, keypoints.slice(5, 9));
  // middle
  drawFinger(ctx, keypoints.slice(9, 13));
  // ring
  drawFinger(ctx, keypoints.slice(13, 17));
  // pinky
  drawFinger(ctx, keypoints.slice(17, 21));
}

export const drawHandOnVideoCanvas = (
  freezeVideo: WritableSignal<boolean>,
  gameHandler: GameHandler,
  video?: ElementRef<HTMLVideoElement>,
  canvas?: ElementRef<HTMLCanvasElement>,
  videoStream?: MediaStream,
  model?: HandPose,
  aiStrategy?: AiStrategy,
): void => {
  const videoContext = video?.nativeElement;
  const canvasElem = canvas?.nativeElement;

  if (!videoContext || !canvasElem) {
    return;
  }

  const context = canvasElem.getContext('2d') as CanvasRenderingContext2D;

  const expectedHeight = 360;
  const expectedWidth = 640;
  const streamWidth = videoStream?.getVideoTracks()[0].getSettings().width as number;
  const streamHeight = videoStream?.getVideoTracks()[0].getSettings().height as number;

  // Need to resize width, height is 360, width is 640, and video size is set to cover
  const clippedWidth = streamWidth - (streamHeight * expectedWidth) / expectedHeight;

  context.canvas.height = streamHeight;
  context.canvas.width = streamWidth - clippedWidth;

  context.clearRect(0, 0, videoContext.width, videoContext.height);
  // shift over and flip so image appears mirrored
  context.translate(canvasElem.width, 0);
  context.scale(-1, 1);

  if (streamWidth === expectedWidth) {
    context.canvas.style.scale = `${streamWidth / streamHeight}`;
  }

  const runDetection = () => {
    model?.estimateHands(videoContext).then((predictions) => {
      context.drawImage(
        videoContext,
        clippedWidth / 2,
        0,
        streamWidth - clippedWidth,
        streamHeight,
        0,
        0,
        streamWidth - clippedWidth,
        streamHeight,
      );

      if (predictions && predictions[0]) {
        const translatedLandmarks = predictions[0].landmarks.map((point) => [
          point[0] - clippedWidth / 2,
          point[1],
          point[2],
        ]);
        drawHand(context, translatedLandmarks);
        if (aiStrategy instanceof AnticipateStrategy) {
          const currentGesture = lookForGesture(predictions[0].landmarks);
          if (currentGesture) {
            aiStrategy.increaseAnticipateScoreForSign(currentGesture.name);
          }
        }
        gameHandler.latestPosition.set(predictions[0].landmarks);
      } else {
        gameHandler.latestPosition.set(null);
      }
      if (!freezeVideo()) {
        requestAnimationFrame(runDetection);
      }
    });
  };
  runDetection();
};
