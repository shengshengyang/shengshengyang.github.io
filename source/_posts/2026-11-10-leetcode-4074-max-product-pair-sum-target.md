---
title: LeetCode 4074. 和為目標值的最大乘積對（枚舉右維護左圖解）
date: 2026-11-10 14:00:00
tags:
- [LeetCode]
- [algorithm]
- [hash table]
- [java]
category:
- [LeetCode]
index_img: ../image/banner/leetcode_index.jpeg
banner_img: ../image/banner/LeetCode_banner.jpeg
---

## 4074. 和為目標值的最大乘積對

### 題目描述

給你一個整數陣列 `nums` 和一個整數 `target`。

當一個由**不同**下標組成的二元組 `(i, j)` 滿足以下條件，稱它是**有效的**：

* `nums[i] + nums[j] == target`
* `nums[i] > nums[j]`

回傳一個有效的二元組 `[i, j]`，使其乘積 `nums[i] * nums[j]` 在所有有效二元組中是**最大**的。如果不存在有效的二元組，回傳 `[-1, -1]`。

如果有多個有效二元組都能達到最大乘積，可以回傳其中的任意一個。

**範例 1**

```
輸入：nums = [1,2,3,4], target = 5
輸出：[2,1]
解釋：存在 2 個有效的二元組：
(3, 0)：4 + 1 = 5，乘積 4
(2, 1)：3 + 2 = 5，乘積 6
第二個二元組的乘積更大，所以答案是 [2, 1]。
```

**範例 2**

```
輸入：nums = [-3,-1,4,2], target = 1
輸出：[3,1]
解釋：存在 2 個有效的二元組：
(2, 0)：4 + (-3) = 1，乘積 -12
(3, 1)：2 + (-1) = 1，乘積 -2
由於 -2 > -12，因此答案是 [3, 1]。
```

**範例 3**

```
輸入：nums = [3,3,5], target = 6
輸出：[-1,-1]
解釋：nums[0] 和 nums[1] 的和雖然為 6，但它們是相等的，不滿足 nums[i] > nums[j]。
```

**限制**

* `2 <= nums.length <= 100`
* `-100 <= nums[i], target <= 100`

> 本題為第 193 場雙週賽 Q1。本文題解思路與程式碼整理自 LeetCode 題解作者[灵茶山艾府](https://leetcode.cn/u/endlesscheng/)，[影片講解](https://www.bilibili.com/video/BV1rHpj6kE8u/)。圖解與步驟說明為自行補充。

### 前置知識：枚舉右，維護左

要找「兩個位置」配成一對，可以只枚舉其中一個（右邊那個），把左邊已經看過的資訊記在哈希表裡，用 `target - x` 一次查出配對的另一個。這個套路和 [LeetCode 1512](/2026/11/06/leetcode-1512-number-of-good-pairs/)、[LeetCode 2441](/2026/11/10/leetcode-2441-largest-positive-integer-with-negative/) 相同，這題的哈希表要記的是「每個數出現的**下標**」，因為答案要回傳下標。

### 思路

#### 先把條件簡化

題目要求 `nums[i] > nums[j]`，但**不要求 `i < j`**。所以 `i`、`j` 誰在左邊都可以：

* 兩個數 `a`、`b` 和為 `target`，且 `a != b`，就一定有一個比較大。大的那個當 `i`，小的當 `j`，條件就滿足了。
* 因此「有效」其實只剩兩件事：兩個數的和是 `target`，而且**兩個數不相等**（`nums[i] == nums[j]` 不行）。
* 找到配對後，如果發現 `nums[i] < nums[j]`，把 `i` 和 `j` 交換即可。

#### 演算法

1. 準備哈希表 `pos`，記錄「數 → 下標」；`bestI = bestJ = -1`。
2. 從左到右遍歷，設目前的數是 `x = nums[i]`。
3. 如果 `x * 2 == target`，表示 `x == target - x`，兩個數相等，不符合條件，**直接跳過**。
4. 查 `pos` 有沒有 `target - x`。有的話，湊成一對，乘積是 `x * (target - x)`。如果它比目前最佳乘積大（或還沒有答案），更新 `bestI = i`、`bestJ = 配對的下標`。
5. 把 `x → i` 放進 `pos`。
6. 遍歷結束，如果有答案且 `nums[bestI] < nums[bestJ]`，交換兩個下標，確保 `nums[i] > nums[j]`。
7. 回傳 `[bestI, bestJ]`。

小提醒：乘積 `x * (target - x)` 是開口向下的拋物線，在 `x = target / 2` 時最大，所以也可以改成比較誰離 `target / 2` 更近，不必真的乘（題解註解提到的另一種寫法）。

#### 圖解（可互動）

預設是範例 2，過程中會遇到「找到配對且乘積更大，更新 best」。另一個按鈕是自編範例 `nums = [5,3,1,4]`、`target = 6`，可以看到 `3 × 2 = 6` 的情況被跳過，以及最後要交換 `i`、`j` 的情況。

{% raw %}
<div class="swv" id="swv-a" style="--sw-n:4">
<style>
.swv{--sw-fg:#1f2328;--sw-fg2:#59636e;--sw-fg3:#818b98;--sw-bg:#ffffff;--sw-card:#f6f8fa;--sw-line:#afb8c1;--sw-accent:#0969da;--sw-ok:#1a7f37;--sw-bad:#cf222e;margin:1.2em 0}
[data-user-color-scheme="dark"] .swv{--sw-fg:#e6edf3;--sw-fg2:#9da7b3;--sw-fg3:#7d8590;--sw-bg:#0d1117;--sw-card:#161b22;--sw-line:#4b535d;--sw-accent:#58a6ff;--sw-ok:#3fb950;--sw-bad:#f85149}
.swv .row{display:grid;grid-template-columns:repeat(var(--sw-n,6),minmax(0,1fr));gap:6px;margin:0 0 6px}
.swv .lab{font-size:13px;color:var(--sw-fg2);margin:14px 0 4px}
.swv .ix{font-size:11px;text-align:center;height:16px;color:var(--sw-fg3)}
.swv .tg{font-size:12px;text-align:center;min-height:18px;font-weight:600;color:var(--sw-accent)}
.swv .c{border:1.5px solid var(--sw-line);border-radius:8px;text-align:center;padding:10px 0;font-size:15px;font-weight:500;background:var(--sw-card);color:var(--sw-fg)}
.swv .c.seen{background:rgba(9,105,218,.10);border-color:var(--sw-accent)}
.swv .c.cur{box-shadow:0 0 0 2px var(--sw-fg);font-weight:700}
.swv .c.hit{background:rgba(26,127,55,.18);border-color:var(--sw-ok);color:var(--sw-ok)}
.swv .c.nx{opacity:.45}
.swv .cn{display:flex;flex-wrap:wrap;gap:8px}
.swv .cn .e{border:1.5px solid var(--sw-line);border-radius:8px;padding:8px 14px;background:var(--sw-card);font-size:14px;min-width:84px;text-align:center}
.swv .cn .e b{font-size:20px;font-weight:600;display:block}
.swv .cn .e.on{border-color:var(--sw-accent);box-shadow:0 0 0 2px var(--sw-accent)}
.swv .cn .e.up{border-color:var(--sw-ok);box-shadow:0 0 0 2px var(--sw-ok)}
.swv .cn .none{font-size:13px;color:var(--sw-fg3);padding:8px 0}
.swv .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}
.swv .m{background:var(--sw-card);border-radius:8px;padding:12px 14px}
.swv .m span{font-size:13px;color:var(--sw-fg2);display:block}
.swv .m b{font-size:22px;font-weight:500}
.swv .info{background:var(--sw-card);border-radius:8px;padding:12px 14px;font-size:14px;line-height:1.8;margin-top:12px}
.swv .ctl{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.swv .ctl button,.swv .kb button{background:var(--sw-card);color:var(--sw-fg);border:1px solid var(--sw-line);border-radius:8px;padding:4px 12px;cursor:pointer;font-size:14px}
.swv .ctl button:hover,.swv .kb button:hover{border-color:var(--sw-accent)}
.swv .kb{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--sw-fg2);margin-bottom:10px;flex-wrap:wrap}
.swv .kb button.on{border-color:var(--sw-accent);color:var(--sw-accent);font-weight:600}
@media (max-width:480px){.swv .stats{grid-template-columns:1fr}.swv .c{padding:8px 0;font-size:13px}}
</style>
<div class="kb"><span>範例：</span></div>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">nums（i 為目前枚舉的位置）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lab cap"></div>
<div class="cn"></div>
<div class="stats">
  <div class="m"><span>x = nums[i]</span><b class="vx">—</b></div>
  <div class="m"><span>target − x 在 Map 裡嗎？</span><b class="vc">—</b></div>
  <div class="m"><span>best（i, j）</span><b class="va">[−1, −1]</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  /* CASES：[[nums, target, 按鈕文字], ...]；Map 記錄每個數最後出現的下標 */
  var root=document.getElementById('swv-a');
  var CASES=[[[-3,-1,4,2],1,"範例 2"],[[5,3,1,4],6,"自編：[5,3,1,4]，target = 6"]],ci=0,A,T,n,st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  function fmt(i,j){return i<0?'[−1, −1]':'['+i+', '+j+']'}
  function snap(m){return m.map(function(p){return p.slice()})}
  function build(){
    A=CASES[ci][0];T=CASES[ci][1];n=A.length;
    var pos=[],bi=-1,bj=-1,i,x,k;
    function look(v){for(var p=0;p<pos.length;p++)if(pos[p][0]===v)return pos[p][1];return undefined}
    steps=[{k:'init',pos:[],bi:-1,bj:-1}];
    for(i=0;i<n;i++){
      x=A[i];
      if(x*2===T){steps.push({k:'skip',i:i,x:x,pos:snap(pos),bi:bi,bj:bj});continue}
      var j=look(T-x),s={k:'chk',i:i,x:x,y:T-x,j:j,pos:snap(pos),bi:bi,bj:bj};
      if(j!==undefined){
        s.prod=x*(T-x);
        s.old=bi<0?null:A[bi]*(T-A[bi]);
        s.upd=(bi<0||s.prod>s.old);
        if(s.upd){bi=i;bj=j}
      }
      s.nbi=bi;s.nbj=bj;steps.push(s);
      var f=false;for(k=0;k<pos.length;k++)if(pos[k][0]===x){pos[k][1]=i;f=true}
      if(!f)pos.push([x,i]);
      steps.push({k:'put',i:i,x:x,pos:snap(pos),bi:bi,bj:bj});
    }
    var sw=bi>=0&&A[bi]<A[bj];
    var fb=bi,fj=bj;if(sw){fb=bj;fj=bi}
    steps.push({k:'fin',pos:snap(pos),bi:bi,bj:bj,sw:sw,fi:fb,fj:fj});
  }
  function draw(){
    var L=steps[st],a='',b='',c='',i,cl;
    if(root.style)root.style.setProperty('--sw-n',n);
    for(i=0;i<n;i++){
      cl='c';
      if(L.i!==undefined){
        if(i===L.i)cl+=' cur';
        else if(L.k==='chk'&&i===L.j)cl+=' hit';
        else if(i<L.i)cl+=' seen';
        else cl+=' nx';
      }
      a+='<div class="tg">'+(L.i===i?'i':'')+'</div>';
      b+='<div class="'+cl+'">'+A[i]+'</div>';
      c+='<div class="ix">'+i+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    q('.cap').textContent='HashMap pos（數 → 最後出現的下標），target = '+T;
    var h='';
    for(i=0;i<L.pos.length;i++){
      var p=L.pos[i];
      h+='<div class="e'+(L.k==='chk'&&p[0]===L.y?' on':'')+(L.k==='put'&&p[0]===L.x?' up':'')+'">'+p[0]+' → <b>'+p[1]+'</b></div>';
    }
    if(!L.pos.length)h='<div class="none">（空的 Map）</div>';
    q('.cn').innerHTML=h;
    q('.vx').textContent=L.x===undefined?'—':L.x;
    q('.vc').textContent=L.k==='chk'?(L.j===undefined?'不在':'在，下標 '+L.j):'—';
    var bi=L.k==='chk'?L.nbi:L.bi,bj=L.k==='chk'?L.nbj:L.bj;
    q('.va').textContent=L.k==='fin'?fmt(L.fi,L.fj):fmt(bi,bj);
    q('.stp').textContent=(st+1)+' / '+steps.length;
    var t;
    if(L.k==='init')t='<div>target = '+T+'。Map 一開始是空的，best = [−1, −1]。從左到右看每個 x，問：<b>左邊有沒有 target − x？</b></div>';
    else if(L.k==='skip')t='<div>i = '+L.i+'，x = '+L.x+'：x × 2 = '+T+' = target，也就是 x = target − x。兩個數相等不符合 nums[i] &gt; nums[j]，直接跳過（連 Map 也不放）。</div>';
    else if(L.k==='chk'){
      t='<div>i = '+L.i+'，x = '+L.x+'，target − x = '+L.y+'：Map 裡'+(L.j===undefined?'沒有 '+L.y+'，沒有配對':'<b>有</b> '+L.y+'（下標 '+L.j+'），湊成一對 ('+L.i+', '+L.j+')')+'</div>';
      if(L.j!==undefined){
        t+='<div>乘積 = '+L.x+' × '+L.y+' = <b>'+L.prod+'</b>'+(L.old===null?'，目前還沒有答案，直接採用':'，目前最佳乘積 = '+L.old+'，'+(L.upd?'更大，<b>更新</b> best':'沒有更大，不更新'))+'</div>';
      }
    }else if(L.k==='put')t='<div>把 '+L.x+' → '+L.i+' 放進 Map，之後的數可以用 target − x 來查它</div>';
    else t='<div>遍歷結束，best = '+fmt(L.bi,L.bj)+'。'+(L.bi<0?'沒有有效二元組，回傳 [−1, −1]。':(L.sw?'nums['+L.bi+'] = '+A[L.bi]+' &lt; nums['+L.bj+'] = '+A[L.bj]+'，不符合 nums[i] &gt; nums[j]，<b>交換 i 和 j</b>，答案 = <b>'+fmt(L.fi,L.fj)+'</b>':'nums['+L.bi+'] = '+A[L.bi]+' &gt; nums['+L.bj+'] = '+A[L.bj]+'，不用交換，答案 = <b>'+fmt(L.fi,L.fj)+'</b>'))+'</div>';
    q('.info').innerHTML=t;
    var kb=root.querySelectorAll('.kb button');
    for(i=0;i<kb.length;i++)kb[i].className=(+kb[i].getAttribute('data-c')===ci)?'on':'';
  }
  (function(){
    var h='<span>範例：</span>';
    for(var i=0;i<CASES.length;i++)h+='<button type="button" data-c="'+i+'">'+CASES[i][2]+'</button>';
    q('.kb').innerHTML=h;
  })();
  root.addEventListener('click',function(e){
    var cc=e.target.getAttribute&&e.target.getAttribute('data-c');
    if(cc!==null&&cc!==undefined){ci=+cc;st=0;build();draw();return}
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(steps.length-1,st+1);
    else st=0;
    draw();
  });
  build();draw();
})();
</script>
</div>
{% endraw %}

### 解法（灵茶山艾府）

```java
class Solution {
    public int[] maxProductPair(int[] nums, int target) {
        Map<Integer, Integer> pos = new HashMap<>();
        int bestI = -1;
        int bestJ = -1;
        for (int i = 0; i < nums.length; i++) {
            int x = nums[i];
            if (x * 2 == target) { // x = target-x
                continue;
            }
            Integer j = pos.get(target - x);
            if (j != null && (bestI < 0 || x * (target - x) > nums[bestI] * (target - nums[bestI]))) { // 也可以比誰離 target/2 更近
                bestI = i;
                bestJ = j;
            }
            pos.put(x, i);
        }

        if (bestI >= 0 && nums[bestI] < nums[bestJ]) {
            // 保證 nums[bestI] > nums[bestJ]
            int tmp = bestI;
            bestI = bestJ;
            bestJ = tmp;
        }
        return new int[]{bestI, bestJ};
    }
}
```

### 補充說明（自行補充）

* **為什麼跳過時連 `pos.put` 也不做**：`x == target - x` 的數不可能和任何數配成有效的對（要配的另一半就是它自己的值，兩者相等），之後的數查 `target - y` 若剛好等於它，也是「相等」的情況，同樣無效，所以放不放都不影響。
* **同一個數出現多次**：`pos.put` 會用較新的下標覆蓋，只要乘積相同，題目允許回傳任意一個，所以不影響正確性。
* **範例 3 的 `[3,3,5]`**：`3 * 2 == 6`，兩個 3 都被跳過，`5` 查 `1` 也找不到，沒有配對，回傳 `[-1,-1]`。

### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `nums` 的長度。每個數只處理一次，哈希表讀寫平均 O(1)。
* 空間複雜度：O(n)，哈希表最多存 n 個數。

### 相似題目

題解提到，專題訓練見作者整理的資料結構題單「§0.1 枚舉右，維護左」。題單沒有給網址，這裡不放連結。
