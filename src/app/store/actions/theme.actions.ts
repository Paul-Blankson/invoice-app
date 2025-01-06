import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ThemeActions = createActionGroup({
  source: 'Theme',
  events: {
    'Set Theme': props<{ theme: 'light' | 'dark' }>(),
    'Toggle Theme': emptyProps(),
  }
});
