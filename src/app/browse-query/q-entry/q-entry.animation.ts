import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export const animation = trigger('queryAnimation', [
  state('*', style({
    opacity: 1,
    transform: 'scale(1)'
  })),
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'scale(0.8)'
    }),
    animate(300)
  ]),
  transition('* => void', [
    animate(300, style({
      transform: 'scale(0.8)',
      opacity: 0
    }))
  ])
]);

export const swipeLeft = trigger('querySwipe', [
  transition('* => slideOutLeft', animate(1000, keyframes([
    style({transform: 'translate3d(0, 0, 0)', offset: 0}),
    style({transform: 'translate3d(-150%, 0, 0)', opacity: 0, offset: 1}),
  ])))
]);
