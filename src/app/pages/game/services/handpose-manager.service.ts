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
