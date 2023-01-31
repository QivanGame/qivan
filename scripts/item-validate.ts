
const path = require('path');
const fs = require('fs-extra');
const readdir = require('recursive-readdir');
const { isUndefined } = require('lodash');

const validCategories = ['Tools', 'Armor', 'Foods', 'Jewelry', 'Potions', 'Seeds', 'Miscellaneous', 'Raw Materials', 'Refined Materials', 'Crafting Tables', 'Weapons'];

const validRarities = ['Junk', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

const validItemTypes = ['Pickaxe', 'Axe', 'FishingRod', 'FishingBait', 'Scythe', 'HuntingTool', 'LegArmor', 'ChestArmor', 'HeadArmor', 'FootArmor', 'HandArmor', 'Jewelry', 'Food', 'Potion', 'Weapon'];

const validStats = [
  'pickaxePower', 'axePower', 'fishingPower', 'scythePower', 'huntingPower',
  'pickaxeSpeed', 'axeSpeed', 'fishingSpeed', 'scytheSpeed', 'huntingSpeed',
  'armor', 'healing', 'attack', 'energyBonus', 'energyCost', 'energyRegen', 'healthBonus', 'speed'
];

const validTargets = ['Single', 'Self', 'AllEnemies', 'Ally', 'All'];

const loadContent = async () => {

  let hasBad = false;

  const allResources = await fs.readJson('src/assets/content/resources.json');
  const allItems = await fs.readJson('src/assets/content/items.json');
  const allAbilities = await fs.readJson('src/assets/content/abilities.json');
  const allEnemies = await fs.readJson('src/assets/content/enemies.json');
  const allThreats = await fs.readJson('src/assets/content/threats.json');

  Object.keys(allResources).forEach(key => {
    const resource = allResources[key];
    if(!validCategories.includes(resource.category)) {
      console.log(`⚠ Resource ${key} has an invalid category ${resource.category}.`);
      hasBad = true;
    }

    if(!validRarities.includes(resource.rarity)) {
      console.log(`⚠ Resource ${key} has an invalid rarity ${resource.rarity}.`);
      hasBad = true;
    }
  });

  Object.keys(allItems).forEach(key => {
    const item = allItems[key];

    if(!validCategories.includes(item.category)) {
      console.log(`⚠ Item ${key} has an invalid category ${item.category}.`);
      hasBad = true;
    }

    if(!validRarities.includes(item.rarity)) {
      console.log(`⚠ Item ${key} has an invalid rarity ${item.rarity}.`);
      hasBad = true;
    }

    if(!validItemTypes.includes(item.type)) {
      console.log(`⚠ Item ${key} has an invalid type ${item.type}.`);
      hasBad = true;
    }

    if(isUndefined(item.value)) {
      console.log(`⚠ Item ${key} is missing value.`);
      hasBad = true;
    }

    Object.keys(item.stats).forEach(stat => {
      if(!validStats.includes(stat)) {
        console.log(`⚠ Item ${key} has an invalid stat ${stat}.`);
        hasBad = true;
      }
    });
  });

  Object.keys(allAbilities).forEach(key => {
    const skill = allAbilities[key];

    if(!skill.name) {
      console.log(`⚠ Skill ${key} has no name.`);
      hasBad = true;
    }

    if(!skill.description) {
      console.log(`⚠ Skill ${key} has no description.`);
      hasBad = true;
    }

    if(!skill.icon) {
      console.log(`⚠ Skill ${key} has no icon.`);
      hasBad = true;
    }

    if(!validTargets.includes(skill.target)) {
      console.log(`⚠ Skill ${key} has an invalid target.`);
      hasBad = true;
    }

    if(!skill.type) {
      console.log(`⚠ Skill ${key} has an invalid type.`);
      hasBad = true;
    }

  });

  Object.keys(allEnemies).forEach(key => {
    const enemy = allEnemies[key];

    if(!enemy.name) {
      console.log(`⚠ Enemy ${key} has no name.`);
      hasBad = true;
    }

    if(!enemy.description) {
      console.log(`⚠ Enemy ${key} has no description.`);
      hasBad = true;
    }

    if(!enemy.icon) {
      console.log(`⚠ Enemy ${key} has no icon.`);
      hasBad = true;
    }

    if(!enemy.health) {
      console.log(`⚠ Enemy ${key} has no health.`);
      hasBad = true;
    }

    if(!enemy.energy) {
      console.log(`⚠ Enemy ${key} has no energy.`);
      hasBad = true;
    }

    Object.keys(enemy.stats).forEach(stat => {
      if(!validStats.includes(stat)) {
        console.log(`⚠ Enemy ${key} has an invalid stat ${stat}.`);
        hasBad = true;
      }
    });

    enemy.abilities.forEach((ability: string) => {
      if(!allAbilities[ability]) {
        console.log(`⚠ Enemy ${key} has an ability for ${ability} which is not a valid ability.`);
        hasBad = true;
      }
    });

    enemy.drops.forEach((drop: any) => {
      if(drop.item && !allItems[drop.item]) {
        console.log(`⚠ Enemy ${key} has a drop for ${drop.item} which is not a valid item.`);
        hasBad = true;
      }

      if(drop.resource && !allResources[drop.resource]) {
        console.log(`⚠ Enemy ${key} has a drop for ${drop.resource} which is not a valid resource.`);
        hasBad = true;
      }
    });
  });

  Object.keys(allThreats).forEach(key => {
    const threat = allThreats[key];

    if(!threat.name) {
      console.log(`⚠ Threat ${key} has no name.`);
      hasBad = true;
    }

    if(!threat.description) {
      console.log(`⚠ Threat ${key} has no description.`);
      hasBad = true;
    }

    if(!threat.icon) {
      console.log(`⚠ Threat ${key} has no icon.`);
      hasBad = true;
    }

    if(!threat.maxSkillGainLevel) {
      console.log(`⚠ Threat ${key} has no maxSkillGainLevel.`);
      hasBad = true;
    }

    if(!threat.level.min || !threat.level.max) {
      console.log(`⚠ Threat ${key} has no level range.`);
      hasBad = true;
    }

    threat.enemies.forEach((enemy: string) => {
      if(!allEnemies[enemy]) {
        console.log(`⚠ Threat ${key} has an enemy for ${enemy} which is not a valid enemy.`);
        hasBad = true;
      }
    })
  });

  const isValidItem = (item: string) => {
    return item === 'nothing' || allResources[item] || allItems[item];
  }

  const files = await readdir('src/assets/content', ['items.json', 'resources.json']);
  files.forEach(async (file: string) => {
    const data = await fs.readJson(file);

    const { recipes, transforms, locations } = data;

    const allRecipeResults: Record<string, boolean> = {};

    (recipes || []).forEach((recipe: any) => {
      if(allRecipeResults[recipe.result]) {
        console.log(`⚠ Result ${recipe.result} is a duplicate.`);
        hasBad = true;
      }

      allRecipeResults[recipe.result] = true;

      const result = recipe.result;

      if(!isValidItem(result)) {
        console.log(`⚠ Recipe result ${result} is not a valid resource or item.`);
        hasBad = true;
      }

      Object.keys(recipe.ingredients).forEach(ingredient => {
        if(!isValidItem(ingredient)) {
          console.log(`⚠ Recipe ingredient ${ingredient} is not a valid resource or item.`);
          hasBad = true;
        }
      });

      if(isUndefined(recipe.maxWorkers)) {
        console.log(`⚠ Recipe ${recipe.name} is missing maxWorkers.`);
        hasBad = true;
      }
    });

    (transforms || []).forEach((transform: any) => {
      const startingItem = transform.startingItem;
      if(!isValidItem(startingItem)) {
        console.log(`⚠ Transform starting item ${startingItem} is not a valid resource or item.`);
        hasBad = true;
      }

      transform.becomes.forEach(({ name }: any) => {
        if(!isValidItem(name)) {
          console.log(`⚠ Transform result ${name} is not a valid resource or item.`);
          hasBad = true;
        }
      });
    });

    const allLocationNames: Record<string, boolean> = {};

    (locations || []).forEach((location: any) => {
      if(allLocationNames[location.name]) {
        console.log(`⚠ Location ${location.name} is a duplicate.`);
        hasBad = true;
      }

      allLocationNames[location.name] = true;

      const resources = location.resources;
      resources.forEach((resource: any) => {
        const name = resource.name;
        if(!isValidItem(name)) {
          console.log(`⚠ Location resource ${name} is not a valid resource or item.`);
          hasBad = true;
        }
      });

      if(isUndefined(location.maxWorkers)) {
        console.log(`⚠ Location ${location.name} is missing maxWorkers.`);
        hasBad = true;
      }
    });
  });

  if(hasBad) {
    process.exit(1);
  }

  console.log('☑ Items validated.');
};

loadContent();
