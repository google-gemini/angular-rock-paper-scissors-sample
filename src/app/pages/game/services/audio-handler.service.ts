import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioHandler {
  playAudio(path: 'win' | 'lose' | 'tie' | 'countdown') {
    const audio = new Audio();
    audio.src = 'assets/' + path + '.mp3';
    audio.load();
    audio.play();
  }
}
