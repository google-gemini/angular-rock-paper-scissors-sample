import {Component, inject} from '@angular/core';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {DialogModule, DialogRef} from '@angular/cdk/dialog';

interface AccordionItem {
  label: string;
  contents: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CdkAccordionModule, DialogModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private readonly dialogRef = inject(DialogRef<AboutComponent>);

  ACCORDION_ITEMS: AccordionItem[] = [
    {
      label: 'Using Machine Learning in Browser',
      contents: `<p>
      This site uses
      <a target="_blank" href="https://www.tensorflow.org/js">Tensorflow.js</a>, a
      library for machine learning in Javascript. Video from the webcam is passed
      to a pre-trained image recognition model that detects a hand and returns 21
      landmark keypoints indicating its position. We then use
      <a target="_blank" href="https://www.npmjs.com/package/fingerpose"
        >fingerpose</a
      >, a finger gesture classifier, to define and recognize the hand gestures
      for Rock, Paper, and Scissors based on the position of each finger.
    </p>`,
    },
    {
      label: 'Computer Strategies',
      contents: `<p>
      Artificial intelligence can look like many things. From simple if-statements
      that may give the <i>impression</i> of reasoning, to real memory, learning,
      and reasoning, the study of AI is a wide and evolving field.
    </p>
    <h4>Random</h4>
    <p>
      The <i>random</i> method is the simplest, the code simply picks randomly
      from Rock, Paper, or Scissors with equal probability.
    </p>
    <h4>Conditional</h4>
    <p>
      The <i>conditional</i> approach uses a little more logic. It's based on the
      assumption that the player is using the popular
      <a
        target="_blank"
        href="https://en.wikipedia.org/wiki/Win%E2%80%93stay,_lose%E2%80%93switch"
        >win-stay, lose-shift strategy</a
      >, and chooses Rock, Paper, or Scissors based on what would beat their
      approach. This strategy is more advanced, since it must reference the result
      of the previous play, and tends to be more effective than choosing randomly.
    </p>
    <h4>Markov</h4>
    <p>
      The <i>markov</i> strategy uses a markov chain to predict the player's next
      decision based on their previous decisions. For example, if the player tends
      to play Paper after playing Rock and their last move was Rock, we can guess
      that Paper is likely their next move.
    </p>
    <h4>Anticipate</h4>
    <p>
      The <i>anticipate</i> strategy lets the computer cheat, just a little bit.
      Data from the webcam is processed during the countdown and whatever gesture
      was seen most often is what the code anticipates the player will play.
    </p>`,
    },
    {
      label: 'About the Author',
      contents: `<p>
      Hi, I'm Reagan (<a target="_blank" href="https://linktr.ee/IfThenCreate"
        >IfThenCreate)</a
      >, I'm a software engineer with too many side projects. I'm passionate about
      tech and art and figuring out what AI means for all of us. Check out more of
      my work on
      <a target="_blank" href="https://instagram.com/ifthencreate">Instagram</a>
      and <a target="_blank" href="https://tiktok.com/@ifthencreate">TikTok</a>.
    </p>`,
    },
    {
      label: 'About the Code',
      contents: `    <p>
      This site was built with
      <a target="_blank" href="https://angular.dev/">Angular v17</a> and uses
      Angular CDK! Sound effects are from
      <a target="_blank" href="https://mixkit.co/free-sound-effects/">MixKit.co</a
      >.
    </p>`,
    },
  ];

  close(): void {
    this.dialogRef.close();
  }
}
