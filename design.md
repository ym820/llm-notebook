# LLM 学习网页 - 设计

## 为什么做

学过的 ML / LLM 内容分散在 codebase、粗糙笔记和 cs336 作业里，文字太多，容易忘，也很难直接 pick up。目标是让学习复利：一个月后打开网页，能把某个主题重新推导一遍。

## 目标

- 以推导为主线，每个主题都能从头推到尾。
- 每个主题配 end to end 的可视化例子，例如 attention 的 weight matrix 在每一步怎么变化。
- 覆盖全面，沿 cs336 a1 的整条线。
- 有明确的节点，可以跳过已经 confident 的内容。
- UI 质量高，按 Emil Kowalski 的设计和动效规范做。

## 不做

- 不用真实模型的 tensor。
- 不在浏览器里跑真实模型。
- 第一期不做 `ml-engineering` 的硬件和性能内容，只在 resource accounting 处引用。
- 不做编辑器、搜索、账号、后端。

## 失败的样子

- 又变成一堵文字墙。
- 可视化只是装饰，数字对不上推导。
- 动效花哨，拖慢阅读。

## Fidelity 的判断(我的决定)

| 内容 | Fidelity | 原因 |
|---|---|---|
| 推导 | 完整、精确，带 shape 标注，符号和你的 `model.py` 一致 | 这是你要 pick up 的核心 |
| 可视化的数字 | 手工设计的小例子(约 4 个 token、d=4)，但由页面里的小段 JS 真实计算 | 小到能一眼看完，同时每一步数字都对得上公式，softmax 每行确实加起来是 1 |
| 例子的输入 | 人为挑选，让模式明显(例如某个 token 明显关注另一个) | 真实 tensor 是噪声，看不出东西 |
| 代码 | 你 repo 里的真实片段 | 把推导和你写过的东西连起来 |
| 实验结果 | writeup 里的真实数字和曲线 | 这部分真实值本身就是结论 |
| 玩具与真实的差距 | 每处标注一行，例如"这里 d=4，你的模型是 512" | 避免把玩具当成真的 |

全站用同一句短句贯穿所有章节，每章展示它在这一步变成了什么。

## 页面结构

```
┌──────────────────────────────────────────────────────────┐
│ 地图: tokens → embed → norm → RoPE → [attention] → FFN … │
├──────────────────────────────────────────────────────────┤
│ Attention                                    3/5 已掌握  │
│                                                          │
│ ● 1 直觉                              [已掌握，折叠]     │
│ ● 2 推导: QKᵀ/√d → mask → softmax → ·V                   │
│ ● 3 例子:  [Q] [K]  →  score 矩阵  ‹ 上一步  下一步 ›    │
│            同一个 4×4 矩阵随步骤变化，hover 看单个格子   │
│            的算式                                        │
│ ○ 4 你的代码: scaled_dot_product_attention               │
│ ○ 5 自测: 不看上面，回答 3 个问题 → 可标记整章已掌握     │
└──────────────────────────────────────────────────────────┘
```

- 每章固定五个节点：直觉、推导、例子、代码、自测。
- 每个节点可手动标记"已掌握"并折叠。自测放在最前面也能点开，答得出就直接跳过整章。
- 进度存在浏览器本地。

## 章节(第一期)

0. 全景：一句话走完整个模型
1. BPE：encoding 和 training
2. Embedding
3. RMSNorm 和 pre-norm
4. RoPE
5. Attention：scaled dot product、causal mask、multi-head
6. SwiGLU FFN
7. Transformer block 和 residual stream
8. LM head、cross entropy、perplexity
9. AdamW、LR schedule、gradient clipping
10. 训练和实验：LR sweep、batch size、ablation
11. Decoding：temperature、top-p
12. Resource accounting：参数量、FLOPs、显存

## 做法

考虑过三种：

- **A. 静态站点，内容手写，可视化在页面里用小例子计算(选这个)**。Astro + MDX，可视化是 React 组件，公式用 KaTeX，动效用 Motion。
- B. 从你的代码导出真实 tensor。你已否决。
- C. 单个 HTML 文件。十三章加公式和代码高亮，很快就难维护。

## 顺序

1. 先只做 Attention 一章，把节点结构、矩阵可视化组件和整体 UI 定下来，给你看。
2. 你认可后，按模型顺序补其余章节，复用同一套组件。

## 留给实现的

- 贯穿全站的那句话具体是什么。
- 视觉风格的具体取值(字体、颜色、间距)，在第 1 步的成品上给你看。
