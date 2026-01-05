import { Minion, minion_utils } from '@/server/controller/entity/Minion';

/**
 * PartyElemental类 - 继承自Minion，实现PartyElemental随从
 */
export class PartyElemental extends Minion {
  inTavern: boolean = true;

  constructor() {
    super();
    minion_utils.initMinionData(this, BASE_DATA);
  }
}

const BASE_DATA = {
  "id": 64056,
  "strId": "BGS_120",
  "cardType": "minion",
  "name": "Party Elemental",
  "nameCN": "派对元素",
  "text": "在你使用一张元素牌后，使一个被使用的元素之外的友方元素获得+{0}/+{1}。",
  "mechanics": [
    "TRIGGER_VISUAL"
  ],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_120_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BGS_120_cardArtFromHsJson256x.png",
  "tier": 2,
  "health": 2,
  "attack": 3,
  "minionTypes": [
    "elemental"
  ],
  "minionTypesCN": [
    "元素"
  ],
  "upgradeCard": {
    "id": 64058,
    "strId": "TB_BaconUps_160",
    "cardType": "minion",
    "name": "Party Elemental",
    "nameCN": "派对元素",
    "text": "在你使用一张元素牌后，使一个被使用的元素之外的友方元素获得+{0}/+{1}，\n触发两次。",
    "mechanics": [
      "TRIGGER_VISUAL"
    ],
    "referencedTags": [],
    "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_160_battlegroundsImageGold.png",
    "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/TB_BaconUps_160_cardArtFromHsJson256x.png",
    "tier": 2,
    "health": 4,
    "attack": 6,
    "minionTypes": [
      "elemental"
    ],
    "minionTypesCN": [
      "元素"
    ]
  }
};