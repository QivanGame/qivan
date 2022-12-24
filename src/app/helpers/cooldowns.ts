import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { IGameGatherLocation, IGameGathering } from '../../interfaces';

export function lowerCooldowns(ctx: StateContext<IGameGathering>, ticks = 1) {
  const state = ctx.getState();

  const cooldowns = state.cooldowns;
  Object.keys(cooldowns).forEach(locationKey => {
    const location = cooldowns[locationKey];
    if(location > 0) {
      cooldowns[locationKey] = location - ticks;
    }

    if(cooldowns[locationKey] <= 0) {
      delete cooldowns[locationKey];
    }
  });

  ctx.setState(patch<IGameGathering>({
    cooldowns
  }));
}

export function isLocationOnCooldown(ctx: StateContext<IGameGathering>, location: IGameGatherLocation) {
  const state = ctx.getState();

  return !!state.cooldowns[location.name];
}

export function putLocationOnCooldown(ctx: StateContext<IGameGathering>, location: IGameGatherLocation) {

  if(!location.cooldownTime) {
    return;
  }

  const state = ctx.getState();

  ctx.setState(patch<IGameGathering>({
    cooldowns: {
      ...state.cooldowns,
      [location.name]: location.cooldownTime
    }
  }));
}
