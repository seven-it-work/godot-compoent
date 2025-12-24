import { Minion } from '@/game/Minion';

/**
 * 催眠机器人类 - 继承自Minion，实现催眠机器人的特殊效果
 */
export class Lullabot extends Minion {
  static BASE_DATA = {
  "id": 98582,
  "strId": "BG26_146",
  "cardType": "minion",
  "name": "Lullabot",
  "nameCN": "催眠机器人",
  "text": "<b>磁力</b>
在你的回合结束时，获得+1生命值。",
  "mechanics": [
    "MAGNETIC"
  ],
  "referencedTags": [],
  "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_146_battlegroundsImage.png",
  "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_146_cardArtFromHsJson256x.png",
  "tier": 1,
  "health": 2,
  "attack": 2,
  "minionTypes": [
    "mech"
  ],
  "minionTypesCN": [
    "机械"
  ],
  "upgradeCard": {
    "id": 98585,
    "strId": "BG26_146_G",
    "cardType": "minion",
    "name": "Lullabot",
    "nameCN": "催眠机器人",
    "text": "<b>磁力</b>
在你的回合结束时，获得+2生命值。",
    "mechanics": [
      "MAGNETIC"
    ],
    "referencedTags": [],
    "img": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_146_G_battlegroundsImageGold.png",
    "art": "https://battlegrounds.oss.gamerhub.cn/all_images/32.2.4.221850/BG26_146_G_cardArtFromHsJson256x.png",
    "tier": 1,
    "health": 4,
    "attack": 4,
    "minionTypes": [
      "mech"
    ],
    "minionTypesCN": [
      "机械"
    ]
  }
};

  /**
   * 重写回合结束时触发的方法
   * @param game - 游戏管理器或store实例
   * @使用方式：在你的回合结束时触发
   * 效果：在你的回合结束时，获得+1生命值
   */
  onTurnEnd(_game: any): void {
    // 获得+1生命值和+1最大生命值
    this.addBuff({
      id: `lullabot_health_${Date.now()}`,
      source: '催眠机器人',
      attackBonus: 0,
      healthBonus: 1,
      maxHealthBonus: 1,
      type: 'permanent',
    });
  }
}
