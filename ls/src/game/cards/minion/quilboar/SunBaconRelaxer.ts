import { Minion } from '@/game/Minion';

/**
 * 晾膘的游客类 - 继承自Minion，实现晾膘的游客的特殊效果
 */
export class SunBaconRelaxer extends Minion {
  static BASE_DATA = {
  "id": 70147,
  "strId": "BG20_301",
  "cardType": "minion",
  "name": "Sun-Bacon Relaxer",
  "nameCN": "晾膘的游客",
  "text": "当你出售本随从时，获取2张<b>鲜血宝石</b>。",
  "mechanics": [],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_cardArtFromHsJson256x.png",
  "tokens": [
    {
      "id": 70136,
      "strId": "BG20_GEM",
      "cardType": "spell",
      "name": "Blood Gem",
      "nameCN": "鲜血宝石",
      "text": "使一个随从获得+{0}/+{1}。",
      "mechanics": [],
      "referencedTags": [],
      "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_battlegroundsImage.png",
      "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_cardArtFromHsJson256x.png"
    }
  ],
  "tier": 1,
  "health": 3,
  "attack": 2,
  "minionTypes": [
    "quilboar"
  ],
  "minionTypesCN": [
    "野猪人"
  ],
  "upgradeCard": {
    "id": 70148,
    "strId": "BG20_301_G",
    "cardType": "minion",
    "name": "Sun-Bacon Relaxer",
    "nameCN": "晾膘的游客",
    "text": "当你出售本随从时，获取4张<b>鲜血宝石</b>。",
    "mechanics": [],
    "referencedTags": [],
    "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_G_battlegroundsImageGold.png",
    "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_301_G_cardArtFromHsJson256x.png",
    "tokens": [
      {
        "id": 70136,
        "strId": "BG20_GEM",
        "cardType": "spell",
        "name": "Blood Gem",
        "nameCN": "鲜血宝石",
        "text": "使一个随从获得+{0}/+{1}。",
        "mechanics": [],
        "referencedTags": [],
        "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_battlegroundsImage.png",
        "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG20_GEM_cardArtFromHsJson256x.png"
      }
    ],
    "tier": 1,
    "health": 6,
    "attack": 4,
    "minionTypes": [
      "quilboar"
    ],
    "minionTypesCN": [
      "野猪人"
    ]
  }
};

  /**
   * 重写出售随从时触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：当玩家出售本随从时触发
   * 效果：当你出售本随从时，获取2张鲜血宝石
   */
  onSell(_game: any): void {
    // 当出售本随从时，获取2张鲜血宝石
    console.log('晾膘的游客：获取2张鲜血宝石');
  }
}
