import { animate, state, style, transition, trigger } from '@angular/animations';

export const animation = trigger('resultAnimation', [
  state('*', style({
    opacity: 1,
    transform: 'translateY(0)'
  })),
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translateY(50px)'
    }),
    animate(300)
  ]),
  transition('* => void', [
    animate(300, style({
      opacity: 0,
      transform: 'translateY(50px)'
    }))
  ])
]);
