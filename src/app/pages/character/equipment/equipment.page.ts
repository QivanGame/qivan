import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameItem, IPlayerCharacter, ItemType } from '../../../../interfaces';
import { CharSelectState, CombatState } from '../../../../stores';
import { EquipItem, UnequipItem } from '../../../../stores/charselect/charselect.actions';
import { AnalyticsTrack } from '../../../../stores/game/game.actions';
import { getItemRarityClass, getStatTotals } from '../../../helpers';
import { setDiscordStatus } from '../../../helpers/electron';
import { AnalyticsService } from '../../../services/analytics.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
})
export class EquipmentPage implements OnInit {

  @Select(CharSelectState.activeCharacter) character$!: Observable<IPlayerCharacter>;
  @Select(CombatState.currentDungeon) dungeon$!: Observable<any>;

  public currentEquipSlot: ItemType | undefined;
  public equippableItems: IGameItem[] = [];

  public toolSlots = [
    { name: 'Pickaxe',      icon: 'pickaxe',      type: ItemType.Pickaxe },
    { name: 'Axe',          icon: 'axe',          type: ItemType.Axe },
    { name: 'Fishing Rod',  icon: 'fishing-pole', type: ItemType.FishingRod },
    { name: 'Fishing Bait', icon: 'fishing-pole', type: ItemType.FishingBait },
    { name: 'Scythe',       icon: 'scythe',       type: ItemType.Scythe },
    { name: 'Hunting Tool', icon: 'spear',        type: ItemType.HuntingTool },
    { name: 'Weapon',       icon: 'knife',        type: ItemType.Weapon }
  ];

  public armorSlots = [
    { name: 'Jewelry',      icon: 'ring',         type: ItemType.Jewelry },
    { name: 'Head',         icon: 'hat',          type: ItemType.HeadArmor },
    { name: 'Chest',        icon: 'shirt',        type: ItemType.ChestArmor },
    { name: 'Hands',        icon: 'gloves',       type: ItemType.HandArmor },
    { name: 'Legs',         icon: 'pants',        type: ItemType.LegArmor },
    { name: 'Feet',         icon: 'boots',        type: ItemType.FootArmor }
  ];

  constructor(private store: Store, private analyticsService: AnalyticsService) { }

  ngOnInit() {
    setDiscordStatus({
      state: 'Browsing their equipment...'
    });
  }

  loadEquipment(slot: ItemType) {
    this.currentEquipSlot = slot;

    const items = this.store.selectSnapshot(CharSelectState.activeCharacterInventory) || [];
    this.equippableItems = items.filter(item => item.type === slot);
  }

  unloadEquipment() {
    this.currentEquipSlot = undefined;
    this.equippableItems = [];
  }

  equip(item: IGameItem) {
    this.unloadEquipment();
    this.store.dispatch(new AnalyticsTrack(`EquipItem:${item.name}`, 1));
    this.store.dispatch(new EquipItem(item));
  }

  unequip(slot: ItemType) {
    this.unloadEquipment();

    this.store.dispatch(new UnequipItem(slot));
  }

  statTotals(character: IPlayerCharacter): Record<string, number> {
    const stats = getStatTotals(this.store.snapshot(), character);
    return { ...stats, healthBonus: 0, energyBonus: 0 };
  }

  getItemRarity(item: IGameItem): string {
    return getItemRarityClass(item);
  }

}
