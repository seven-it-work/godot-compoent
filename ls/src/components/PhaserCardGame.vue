<template>
  <div class="phaser-game-container">
    <div id="phaser-game" ref="gameContainer"></div>
    <div class="game-controls">
      <button @click="resetGame" class="control-button">重置游戏</button>

      <button @click="addCard" class="control-button">添加新卡牌</button>

      <p>点击并拖动卡牌来移动它们</p>
      <p>将卡牌放置在右侧区域来翻转它们</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Phaser from 'phaser';
import { onMounted, onUnmounted, ref } from 'vue';

// 卡牌数据接口
interface CardData {
  id: number;
  name: string;
  value: number;
  suit: string;
  attack?: number;
  health?: number;
  description?: string;
}

// 引用游戏容器
const gameContainer = ref<HTMLElement | null>(null);

// 游戏实例
let game: Phaser.Game | null = null;

// 卡牌数据
const cardData: CardData[] = [
  { id: 1, name: '火球术', value: 6, suit: 'spell', description: '造成6点伤害' },
  { id: 2, name: '狼人', value: 3, suit: 'minion', attack: 3, health: 2, description: '冲锋' },
  { id: 3, name: '治疗术', value: 2, suit: 'spell', description: '恢复4点生命值' },
  {
    id: 4,
    name: '霜之哀伤',
    value: 5,
    suit: 'weapon',
    attack: 5,
    health: 3,
    description: '亡语：召唤一个食尸鬼',
  },
  { id: 5, name: '圣骑士', value: 1, suit: 'minion', attack: 1, health: 1, description: '圣盾' },
];

// 卡牌场景
class CardGameScene extends Phaser.Scene {
  private cards: Phaser.GameObjects.Group;
  private dropZone: Phaser.GameObjects.Rectangle;
  private deckPosition: { x: number; y: number };
  private handPosition: { x: number; y: number };

  constructor() {
    super('CardGameScene');

    this.cards = new Phaser.GameObjects.Group(this);
    this.dropZone = {} as Phaser.GameObjects.Rectangle;
    this.deckPosition = { x: 100, y: 300 };
    this.handPosition = { x: 150, y: 450 };
  }

  // 预加载资源
  preload() {
    // 移除远程插件加载，避免网络延迟和性能问题
  }

  // 创建游戏场景
  create() {
    // 创建背景
    this.cameras.main.setBackgroundColor(0x2c3e50);

    // 创建牌堆位置
    this.add.text(this.deckPosition.x, this.deckPosition.y - 150, '牌堆', {
      fontSize: '24px',
      color: '#ffffff',
    });

    // 创建手牌位置
    this.add.text(this.handPosition.x, this.handPosition.y + 120, '手牌', {
      fontSize: '24px',
      color: '#ffffff',
    });

    // 创建放置区域（右侧区域）
    this.dropZone = this.add.rectangle(600, 300, 200, 400, 0x3498db, 0.3);
    this.dropZone.setStrokeStyle(2, 0x2980b9);

    this.add.text(this.dropZone.x - 50, this.dropZone.y - 220, '放置区域', {
      fontSize: '24px',
      color: '#ffffff',
    });

    // 创建5张卡牌
    cardData.forEach((card, index) => {
      this.createCard(card, index);
    });

    // 设置拖拽事件
    this.input.on(
      'dragstart',
      (_pointer: any, gameObject: any) => {
        // 保存原始背景颜色
        if (gameObject.list && gameObject.list.length > 0) {
          gameObject._originalBgColor = gameObject.list[0].fillColor;
          gameObject.list[0].setFillStyle(0x3498db); // 改变背景颜色表示选中
        }
        this.children.bringToTop(gameObject);
      },
      this
    );

    this.input.on(
      'drag',
      (_pointer: any, gameObject: any, dragX: number, dragY: number) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      },
      this
    );

    this.input.on(
      'dragend',
      (_pointer: any, gameObject: any) => {
        // 恢复原始背景颜色
        if (gameObject.list && gameObject.list.length > 0 && gameObject._originalBgColor) {
          gameObject.list[0].setFillStyle(gameObject._originalBgColor);
        }

        // 检查是否放置在放置区域
        if (Phaser.Geom.Rectangle.Overlaps(this.dropZone.getBounds(), gameObject.getBounds())) {
          // 翻转卡牌
          this.flipCard(gameObject);
        } else {
          // 否则返回原位
          const cardIndex = this.cards.getChildren().indexOf(gameObject);
          const targetX = this.handPosition.x + cardIndex * 120;
          const targetY = this.handPosition.y;

          this.tweens.add({
            targets: gameObject,
            x: targetX,
            y: targetY,
            duration: 300,
            ease: 'Power2',
          });
        }
      },
      this
    );
  }

  // 创建单张卡牌（使用Phaser原生对象，提高性能）
  createCard(card: CardData, index: number) {
    // 创建一个容器来放置卡牌元素
    const cardContainer = this.add.container(this.deckPosition.x, this.deckPosition.y);

    // 创建卡牌背景（使用Phaser的图形对象）
    const cardBackground = this.add.rectangle(0, 0, 120, 180, 0xffffff);
    cardBackground.setStrokeStyle(2, 0x000000);
    cardBackground.setOrigin(0);

    // 创建卡牌头部
    const cardHeader = this.add.rectangle(0, 0, 120, 30, 0x3498db);
    cardHeader.setOrigin(0);

    // 创建卡牌名称文本
    const cardName = this.add.text(5, 5, card.name, {
      fontSize: '12px',
      color: '#ffffff',
      fontWeight: 'bold',
    } as any); // 使用类型断言避免TypeScript错误
    cardName.setOrigin(0);

    // 创建卡牌数值
    const cardValue = this.add.text(100, 5, card.value.toString(), {
      fontSize: '14px',
      color: '#ffffff',
      fontWeight: 'bold',
    } as any); // 使用类型断言避免TypeScript错误
    cardValue.setOrigin(0);

    // 创建卡牌类型
    const cardType = this.add.rectangle(0, 30, 50, 20, 0x2ecc71);
    cardType.setOrigin(0);
    const cardTypeText = this.add.text(5, 33, card.suit, {
      fontSize: '10px',
      color: '#ffffff',
      fontWeight: 'bold',
    } as any); // 使用类型断言避免TypeScript错误
    cardTypeText.setOrigin(0);

    // 创建卡牌描述
    const cardDescription = this.add.text(5, 55, card.description || '无描述', {
      fontSize: '9px',
      color: '#000000',
      wordWrap: {
        width: 110,
        useAdvancedWrap: true,
      },
    } as any); // 使用类型断言避免TypeScript错误
    cardDescription.setOrigin(0);

    // 如果是随从卡牌，添加攻击力和生命值
    let cardAttack: Phaser.GameObjects.Text | null = null;
    let cardHealth: Phaser.GameObjects.Text | null = null;
    if (card.attack !== undefined && card.health !== undefined) {
      const cardStatsBg = this.add.rectangle(0, 150, 120, 30, 0xecf0f1);
      cardStatsBg.setOrigin(0);

      cardAttack = this.add.text(10, 155, card.attack.toString(), {
        fontSize: '14px',
        color: '#e74c3c',
        fontWeight: 'bold',
      } as any); // 使用类型断言避免TypeScript错误
      cardAttack.setOrigin(0);

      cardHealth = this.add.text(100, 155, card.health.toString(), {
        fontSize: '14px',
        color: '#27ae60',
        fontWeight: 'bold',
      } as any); // 使用类型断言避免TypeScript错误
      cardHealth.setOrigin(0);
    }

    // 将所有元素添加到容器中
    cardContainer.add([
      cardBackground,
      cardHeader,
      cardName,
      cardValue,
      cardType,
      cardTypeText,
      cardDescription,
    ]);
    if (cardAttack && cardHealth) {
      cardContainer.add([cardAttack, cardHealth]);
    }

    // 设置卡牌的物理属性
    // 为容器设置交互区域和回调
    cardContainer.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, 120, 180),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true,
      draggable: true,
    });

    // 为卡牌添加数据
    (cardContainer as any).cardData = card;
    (cardContainer as any).isFlipped = false;

    // 启用拖拽
    this.input.setDraggable(cardContainer);

    // 卡片的动画效果
    cardContainer.setScale(0.9);

    // 将卡片分发到手牌位置
    const targetX = this.handPosition.x + index * 120;
    const targetY = this.handPosition.y;

    this.tweens.add({
      targets: cardContainer,
      x: targetX,
      y: targetY,
      duration: 1000,
      delay: index * 200,
      ease: 'Power2',
    });

    // 将卡牌添加到组中
    this.cards.add(cardContainer);
  }

  // 翻转卡牌
  flipCard(card: any) {
    // 使用Phaser的tween实现卡牌翻转效果
    const isFlipped = (card as any).isFlipped;

    // 翻转动画
    this.tweens.add({
      targets: card,
      scaleX: { from: 1, to: 0, duration: 150 },
      onComplete: () => {
        // 切换卡牌状态
        (card as any).isFlipped = !isFlipped;

        // 改变卡牌颜色以表示翻转状态
        const children = card.list;
        if (children.length > 0) {
          // 第一个子元素是卡牌背景
          const cardBackground = children[0] as Phaser.GameObjects.Rectangle;
          const cardHeader = children[1] as Phaser.GameObjects.Rectangle;

          if ((card as any).isFlipped) {
            // 正面颜色
            cardBackground.setFillStyle(0xffffff);
            cardHeader.setFillStyle(0xe74c3c);
          } else {
            // 背面颜色
            cardBackground.setFillStyle(0x34495e);
            cardHeader.setFillStyle(0x95a5a6);
          }
        }

        // 完成翻转动画
        this.tweens.add({
          targets: card,
          scaleX: { from: 0, to: 1, duration: 150 },
          ease: 'Power2',
        });
      },
      ease: 'Power2',
    });
  }
}

// 组件挂载时初始化游戏
onMounted(() => {
  if (gameContainer.value) {
    // Phaser 游戏配置
    const config = {
      type: Phaser.AUTO,
      // 设置为通用手机分辨率 (16:9 比例)
      width: 1280,
      height: 720,
      parent: gameContainer.value as HTMLElement,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      // 添加响应式设计
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // 最小和最大尺寸
        min: {
          width: 800,
          height: 450,
        },
        max: {
          width: 1920,
          height: 1080,
        },
      },
      scene: CardGameScene,
    } as any;

    // 创建游戏实例
    game = new Phaser.Game(config);
  }
});

// 组件卸载时销毁游戏
onUnmounted(() => {
  if (game) {
    game.destroy(true);
    game = null;
  }
});

// 重置游戏
function resetGame() {
  if (game) {
    game.destroy(true);

    if (gameContainer.value) {
      const config = {
        type: Phaser.AUTO,
        // 设置为通用手机分辨率 (16:9 比例)
        width: 1280,
        height: 720,
        parent: gameContainer.value as HTMLElement,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false,
          },
        },
        // 添加响应式设计
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          // 最小和最大尺寸
          min: {
            width: 800,
            height: 450,
          },
          max: {
            width: 1920,
            height: 1080,
          },
        },
        scene: CardGameScene,
      } as any;

      game = new Phaser.Game(config);
    }
  }
}

// 添加新卡牌
function addCard() {
  if (game) {
    const scene = game.scene.getScene('CardGameScene') as any;

    if (scene && scene.cards) {
      const cardCount = scene.cards.getChildren().length;

      const newCard: CardData = {
        id: cardCount + 1,
        name: `卡牌${cardCount + 1}`,
        value: cardCount + 1,
        suit: cardCount % 2 === 0 ? 'minion' : 'spell',
        attack: cardCount % 2 === 0 ? Math.floor(Math.random() * 5) + 1 : undefined,
        health: cardCount % 2 === 0 ? Math.floor(Math.random() * 5) + 1 : undefined,
        description: `这是第${cardCount + 1}张卡牌`,
      };

      scene.createCard(newCard, cardCount);
    }
  }
}
</script>

<style scoped>
.phaser-game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #2c3e50;
  border-radius: 8px;
  margin: 20px;
  color: white;
  /* 确保容器不会导致页面滚动 */
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
}

#phaser-game {
  border: 2px solid #3498db;
  border-radius: 8px;
  margin-bottom: 20px;
  /* 确保游戏区域不会超出容器 */
  max-width: 100%;
  max-height: calc(100vh - 200px);
  overflow: hidden;
}

.game-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.control-button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.control-button:hover {
  background-color: #2980b9;
}
</style>
