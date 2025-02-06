import { createFeature, createReducer, on } from '@ngrx/store';
import { ThemeActions } from '../actions/theme.actions';
import { ThemeState, initialThemeState } from '../../models/app.state';
import { loadFromStorage, saveToStorage } from '../utils/utils';

const THEME_STORAGE_KEY = 'app_theme';

export const themeFeature = createFeature({
  name: 'theme',
  reducer: createReducer<ThemeState>(
    { theme: loadFromStorage(THEME_STORAGE_KEY, initialThemeState.theme) },
    on(ThemeActions.setTheme, (state, { theme }) => {
      saveToStorage(THEME_STORAGE_KEY, theme);
      return { theme };
    }),
    on(ThemeActions.toggleTheme, (state): ThemeState => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      saveToStorage(THEME_STORAGE_KEY, newTheme);
      return { theme: newTheme };
    })
  )
});

export const { selectTheme } = themeFeature;
