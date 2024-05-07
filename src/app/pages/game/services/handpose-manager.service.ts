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

import {Injectable, signal} from '@angular/core';
import * as handpose from '@tensorflow-models/handpose';

@Injectable({
  providedIn: 'root',
})
export class HandposeManager {
  private readonly handposeModel = signal<handpose.HandPose | null>(null);

  async load(): Promise<handpose.HandPose> {
    if (this.handposeModel()) {
      return this.handposeModel()!;
    }

    const model = await handpose.load();
    this.handposeModel.set(model);

    return model;
  }
}
