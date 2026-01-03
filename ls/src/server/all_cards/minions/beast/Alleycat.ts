import { Minion, minion_utils } from '@/server/controller/entity/Minion';
import { Player } from '@/server/controller/entity/Player';
import db_card from '@/server/db/db_card';

export class Alleycat extends Minion {
  inTavern: boolean = true;
  constructor() {
    super();
    minion_utils.initMinionData(this, data);
  }

  hasBattlecry: boolean = true;
  battlecry(player: Player) {
    super.battlecry(player);
    const BG_CFM_315t = db_card.getCardByStrId('BG_CFM_315t');
    if (!BG_CFM_315t) {
      throw new Error('未找到BG_CFM_315t');
    }
    const minionIndex = player.getMinionIndexOnBattlefield(this);
    player.添加随从到战场(BG_CFM_315t as Minion, minionIndex + 1);
  }
}

const data = {
  id: 96758,
  strId: 'BG_CFM_315',
  cardType: 'minion',
  name: 'Alleycat',
  nameCN: '雄斑虎',
  text: '<b>战吼：<\/b>召唤一头1\/1的雌斑虎。',
  mechanics: ['BATTLECRY'],
  referencedTags: [],
  img: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/BG_CFM_315_battlegroundsImage.png',
  art: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/BG_CFM_315_cardArtFromHsJson256x.png',
  tier: 1,
  health: 1,
  attack: 1,
  minionTypes: ['beast'],
  minionTypesCN: ['野兽'],
  upgradeCard: {
    id: 60053,
    strId: 'TB_BaconUps_093',
    cardType: 'minion',
    name: 'Alleycat',
    nameCN: '雄斑虎',
    text: '<b>战吼：<\/b>召唤一头2\/2的雌斑虎。',
    mechanics: ['BATTLECRY'],
    referencedTags: [],
    img: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/TB_BaconUps_093_battlegroundsImageGold.png',
    art: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/TB_BaconUps_093_cardArtFromHsJson256x.png',
  },
};
