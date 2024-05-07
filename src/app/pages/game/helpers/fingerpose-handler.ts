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

// @ts-expect-error fingerpose doesn't have types
import {GestureDescription, GestureEstimator, Finger, FingerCurl} from 'fingerpose';
import {Signs} from '../../../enums/signs';
// https://github.com/andypotato/fingerpose/blob/master/README.md for demo and more info on fingerpose

const RockGesture = new GestureDescription('Rock');
RockGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
RockGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  RockGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  RockGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

const PaperGesture = new GestureDescription('Paper');
for (const finger of Finger.all) {
  PaperGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

const ScissorsGesture = new GestureDescription('Scissors');
ScissorsGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
ScissorsGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

ScissorsGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
ScissorsGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

ScissorsGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
ScissorsGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

export const gestureList = new GestureEstimator([RockGesture, PaperGesture, ScissorsGesture]);

export type GestureResult = {
  name: Signs;
  score: number;
};

export const lookForGesture = (landmarks: number[][] | null): GestureResult | undefined => {
  if (!landmarks) {
    return undefined;
  }

  const {gestures} = gestureList.estimate(landmarks, 7.5);
  return gestures ? gestures[0] : undefined;
};
