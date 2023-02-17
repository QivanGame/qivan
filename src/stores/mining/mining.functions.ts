import { StateContext } from '@ngxs/store';

import { cancelGathering } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';

export const defaultMining: () => IGameGathering = () => ({
  version: 0,
  unlocked: false,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
});

export function unlockMining(ctx: StateContext<IGameGathering>) {
  ctx.patchState({ unlocked: true });
}

export function resetMining(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultMining());
}

export function cancelMining(ctx: StateContext<IGameGathering>) {
  cancelGathering(ctx);
}
