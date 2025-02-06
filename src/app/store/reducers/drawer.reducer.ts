import { createReducer, on } from '@ngrx/store';
import * as DrawerActions from '../actions/drawer.actions';
import { DrawerState, initialState } from '../../models/app.state';

export const drawerReducer = createReducer(
  initialState,
  on(DrawerActions.openDrawer, state => ({ ...state, isOpen: true })),
  on(DrawerActions.closeDrawer, state => ({ ...state, isOpen: false }))
);

export const selectDrawerOpen = (state: { drawer: DrawerState }) => state.drawer.isOpen;
