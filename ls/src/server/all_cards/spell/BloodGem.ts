import { Buff } from '@/server/controller/entity/Buff';
import { card_utils } from '@/server/controller/entity/Card';
import type { Minion } from '@/server/controller/entity/Minion';
import type { Player } from '@/server/controller/entity/Player';
import { Spell } from '@/server/controller/entity/Spell';

export class BloodGem extends Spell {
  // 使用是否有需要目标
  requiresTarget: boolean = true;

  constructor() {
    super();
    card_utils.initCardData(this, BASE_DATA);
  }

  useCardAfter(player: Player) {
    const targetCard = player.otherParams.targetCard;
    if (!targetCard) {
      throw new Error('未找到目标卡牌');
    }
    if (targetCard.type !== 'minion') {
      throw new Error('目标卡牌不是随从');
    }
    const minion = targetCard as Minion;
    minion.addBuff(new Buff(this.name, 1, 1));
  }
}

const BASE_DATA = {
  id: 70136,
  strId: 'BG20_GEM',
  cardType: 'spell',
  name: 'Blood Gem',
  nameCN: '鲜血宝石',
  text: '使一个随从获得+{0}\/+{1}。',
  mechanics: [],
  referencedTags: [],
  img: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/BG20_GEM_battlegroundsImage.png',
  art: 'https:\/\/battlegrounds.oss.gamerhub.cn\/all_images\/32.2.4.221850\/BG20_GEM_cardArtFromHsJson256x.png',
};
