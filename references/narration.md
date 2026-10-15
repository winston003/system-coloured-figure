# Narration, copy and access

## A worked beat table

A sounding rocket on a launch mount, twelve seconds before ignition. Six beats, each with a boundary, a label, one line of action and two of reason. The numbers are the ones the model already holds, so nothing here can drift from the drawing.

| at | short | what | why |
|---|---|---|---|
| −∞ | 倒计时 | 控制台的钟从 T-12 往下走。什么都还没动。 | 火箭挂在四条抱箍上，抱箍只扛它自己的重量——1,197 公斤，差不多一辆小车。发动机还没点，所以没有任何东西往外推。 |
| −3.2 s | 撤脐带 | 脐带臂笔直地退回去。 | 这是最后一件挂在火箭上的东西。它只沿一条直线滑出去，所以这一路火箭不会挨到任何侧向的拉扯。 |
| −2.2 s | 注水 | 水开始浇在沟槽上。 | 111,000 牛顿的火焰停在同一个点会把钢烧穿。水先把沟槽和槽壁浇透，火焰到的时候已经没有干的地方可烧了。 |
| 0 s | 点火 | 点火器点着。约 90 毫秒，推力就满到 111 kN。 | 固体发动机没法调小：从零到满只有一瞬。这 111 kN 全部压进发射架的四条腿里，一点都没用来往上顶。 |
| +0.42 s | 松箍 | 四条抱箍同时张开。 | 它们压着的 11.7 kN 就是火箭自己的重量，除此之外什么都没压。所以松开它们对发射架毫无损失——它从来没挡过推力。 |
| +0.59 s | 起飞 | 火箭加速爬升，冲出画面。 | 发动机的推力是火箭重量的 9.4 倍——所以它才需要被按在地上。从点火算起，三分之一秒就过 100 km/h。 |

Two things this table is doing that a plain caption cannot:

1. **Each reason answers a question the reader just formed.** "四条抱箍同时张开" is only interesting if the reader knows what those clamps were carrying. The reason line supplies it, at the instant it matters, rather than in a paragraph they skipped.
2. **The last beat exists only because the figure ends.** A figure that stops at T+0.6 has told you the mount's whole job and nothing about the rocket's. The narration makes the ending visible.

## The copy rules

**Keep every number. Drop every term.** The numbers are why the figure is worth looking at; the terms are why a reader gave up on the first sentence.

| Engineering voice | Plain voice | Why it is better |
|---|---|---|
| thrust-to-weight ratio of 9.4 | 推力是它自身重量的 9.4 倍 | The ratio stops meaning anything; "nine times its weight" does not |
| hold-down clamps | 抱箍 | 抱箍 already suggests what it grips; "hold-down" needs a second reading |
| the umbilical disconnect sequence | 最后一件挂在火箭上的东西退回去 | Names the position and the risk, not the procedure |
| 111 kN into the structural load path | 111 kN 全部压进四条支腿 | Says where the force goes, which is the whole point |
| the deluge soaks the trench | 水把沟槽和槽壁浇透，火焰到时没有干的地方可烧 | Gives the reason inside the sentence |
| peak acceleration 83 m/s² | 三分之一秒就过 100 km/h | Same fact, in a unit a reader has felt |
| 1,197 kg at ignition | 1,197 公斤，差不多一辆小车 | A number with nothing to picture is decoration |

Three tests before a line ships:

- **Picture test.** Can a twelve-year-old see it? "一把小车那么重" beats "1,197 kg".
- **Question test.** Does the reason line answer a question the action line just raised?
- **Length test.** `what` under ten words, `why` under thirty. A reason line that needs four clauses is a paragraph, and paragraphs under a figure do not get read.

## The layer, in full

```html
<div class="rq-notes" data-now="1">
  <div class="rq-steps" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
  <p class="rq-step"><span data-step>1 / 6 · 倒计时</span></p>
  <p class="rq-what" data-what aria-live="polite">控制台的钟从 T-12 往下走。什么都还没动。</p>
  <p class="rq-why" data-why>火箭挂在四条抱箍上……</p>
</div>
```

```css
.rq-notes { margin: 10px 4px 2px; }
.rq-steps { display: flex; gap: 4px; }
.rq-steps i { height: 2px; flex: 1; background: var(--anatomy-faint); transition: background 260ms var(--anatomy-ease); }
.rq-notes[data-now="1"] .rq-steps i:nth-child(-n + 1),
.rq-notes[data-now="2"] .rq-steps i:nth-child(-n + 2),
.rq-notes[data-now="3"] .rq-steps i:nth-child(-n + 3),
.rq-notes[data-now="4"] .rq-steps i:nth-child(-n + 4),
.rq-notes[data-now="5"] .rq-steps i:nth-child(-n + 5),
.rq-notes[data-now="6"] .rq-steps i:nth-child(-n + 6) { background: var(--anatomy-lit); }
.rq-step { margin: 7px 0 0; font: 500 11px/1.4 var(--anatomy-mono); letter-spacing: .06em; color: var(--anatomy-muted); text-transform: uppercase; }
.rq-what { margin: 3px 0 0; font-size: 15px; line-height: 1.45; color: var(--anatomy-strong); min-height: 1.45em; }
.rq-why  { margin: 2px 0 0; font-size: 13.5px; line-height: 1.5; color: var(--anatomy-text); max-width: 62ch; min-height: 3em; }
```

The lit-tick rules could be six lines of JavaScript instead. CSS wins because the progress rail then updates in the same frame as the text with no extra DOM writes, and because a reader who scrubs with the keyboard sees both change together.

## Access

- `aria-live="polite"` on the action line is the whole live-region story. Do not add a second hidden live region: two of them announce twice.
- The figure's own `role="slider"` already exposes `aria-valuenow` and `aria-valuetext`. Set `aria-valuetext` to the readout, and let the beat layer be the prose.
- The steps rail is `aria-hidden`. It repeats what `data-step` already says as text.
- Under `prefers-reduced-motion: reduce`, keep the tick transition off (`transition: none`) but keep the colour change: it is a state, not an animation.
- At 390 px the legend wraps to two rows and the reason line runs to four lines. That is fine; check it does not push the caption off the fold.

## What to check before shipping

1. Scrub to each boundary and confirm the beat changes at the right instant — a beat that fires a frame late reads as a bug.
2. Scrub backwards: the index must go down, and the DOM writes must not fight the easing.
3. Read only the `what` lines, in order, with the figure closed. If that is a coherent story, the copy works. If it needs the reasons to make sense, the actions are wrong.
