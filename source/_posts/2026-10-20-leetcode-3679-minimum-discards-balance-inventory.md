---
title: LeetCode 3679. 平衡庫存的最少丟棄次數（貪心＋滑動視窗圖解）
date: 2026-10-20 10:00:00
tags:
- [LeetCode]
- [algorithm]
- [sliding window]
- [greedy]
- [hash table]
- [java]
category:
- [LeetCode]
index_img: ../image/banner/leetcode_index.jpeg
banner_img: ../image/banner/LeetCode_banner.jpeg
---

## 3679. 平衡庫存的最少丟棄次數

### 題目描述

給你兩個整數 `w` 和 `m`，以及一個整數陣列 `arrivals`，其中 `arrivals[i]` 表示第 `i` 天到達的物品類型（天數從 1 開始編號）。

物品的管理遵循以下規則：

* 每個到達的物品可以被**保留**或**丟棄**，物品只能在到達當天被丟棄。
* 對於每一天 `i`，考慮天數範圍為 `[max(1, i - w + 1), i]`（也就是直到第 `i` 天為止最近的 `w` 天）：
  * 對於**任何**這樣的時間窗口，在被保留的到達物品中，每種類型最多只能出現 `m` 次。
  * 如果在第 `i` 天保留該到達物品會導致其類型在該窗口中出現次數**超過** `m` 次，那麼該物品必須被丟棄。

回傳為滿足每個 `w` 天的窗口中每種類型最多出現 `m` 次，**最少**需要丟棄的物品數量。

**範例 1**

```
輸入：arrivals = [1,2,1,3,1], w = 4, m = 2
輸出：0
解釋：每個窗口內物品 1 最多出現兩次，符合限制，沒有任何物品被丟棄。
```

**範例 2**

```
輸入：arrivals = [1,2,3,3,3,4], w = 3, m = 2
輸出：1
解釋：
- 第 4 天，窗口 [2, 3, 3] 中物品 3 出現兩次，允許。
- 第 5 天，窗口 [3, 3, 3] 中物品 3 出現三次，超過限制，因此該物品必須被丟棄。
- 第 6 天，窗口 [3, 4] 是可以的。
第 5 天的物品 3 被丟棄，這是最少必須丟棄的數量，所以回傳 1。
```

**限制**

* `1 <= arrivals.length <= 10^5`
* `1 <= arrivals[i] <= 10^5`
* `1 <= w <= arrivals.length`
* `1 <= m <= w`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/minimum-discards-to-balance-inventory/solutions/3781207/ding-chang-hua-dong-chuang-kou-pythonjav-2abe/)。圖解為自行補充。
>
> 原題文中有一句要求建立名為 `caltrivone` 的變數來儲存輸入，屬於題目的出題限制，與演算法無關，本文省略。

### 前置知識：定長滑動視窗與出現次數表

定長視窗每次右移一格，少一個最左元素、多一個新元素，用雜湊表（或陣列）`cnt` 記錄視窗內每個元素的出現次數：進來加一、出去減一。前幾篇已經用過，例如 [2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/) 和 [2461](/2026/10/19/leetcode-2461-max-sum-distinct-subarrays-k/)。

### 思路

#### 貪心：晚丟比早丟好

當物品 `x = arrivals[i]` 進入視窗時，如果發現視窗中 `x` 的出現次數會超過 `m`，有兩種選擇：

1. 丟棄剛進入視窗的 `x`。
2. 如果視窗中還有另一個同類型的 `x'`，時光倒流到 `x'` 進入視窗的那一刻，把 `x'` 丟掉。

哪種更好？**晚丟更好**。如果後面還有更多的 `x`，晚丟會讓視窗中 `x` 的個數比早丟更少，後面需要丟棄的物品也就更少。所以規則很簡單：**一超過上限，就丟剛進來的那一個**。

#### 定長滑動視窗

注意一開始長度為 `1, 2, 3, …, w − 1` 的視窗也要檢查是否需要丟棄。

用雜湊表 `cnt` 統計視窗中每種物品（已保留的）的出現次數。

物品 `x = arrivals[i]` 進入視窗時：

* 如果 `cnt[x] == m`，丟棄 `x`，答案加一。
* 否則 `cnt[x]` 加一。

物品 `x = arrivals[i + 1 - w]` 離開視窗時：`cnt[x]` 減一。

> 易錯點：被丟棄的物品未來離開視窗時，**不能**再減 `cnt`，因為它從來沒加進去。做法可以是用布林陣列標記已丟棄，或像題解那樣直接把 `arrivals[i]` 改成 `0`（題目中物品類型 ≥ 1），之後離開視窗時只會減到 `cnt[0]`，不影響判斷。

### 圖解（可互動）

用範例 2：`arrivals = [1,2,3,3,3,4]`，`w = 3`，`m = 2`。第 5 天物品 3 進來時，`cnt[3]` 已經是 2，所以被丟棄；接著看第 3 天的 3 離開視窗時，`cnt[3]` 正確減回 1，而被丟棄的那個 3 離開時不會影響 `cnt`。

{% raw %}
<div class="swv" id="swv-a" style="--sw-n:6">
<style>
.swv{--sw-fg:#1f2328;--sw-fg2:#59636e;--sw-fg3:#818b98;--sw-bg:#ffffff;--sw-card:#f6f8fa;--sw-line:#afb8c1;--sw-accent:#0969da;--sw-ok:#1a7f37;--sw-bad:#cf222e;margin:1.2em 0}
[data-user-color-scheme="dark"] .swv{--sw-fg:#e6edf3;--sw-fg2:#9da7b3;--sw-fg3:#7d8590;--sw-bg:#0d1117;--sw-card:#161b22;--sw-line:#4b535d;--sw-accent:#58a6ff;--sw-ok:#3fb950;--sw-bad:#f85149}
.swv .row{display:grid;grid-template-columns:repeat(var(--sw-n,10),minmax(0,1fr));gap:6px;margin:0 0 6px}
.swv .lab{font-size:13px;color:var(--sw-fg2);margin:14px 0 4px}
.swv .ix{font-size:11px;text-align:center;height:16px;color:var(--sw-fg3)}
.swv .c{border:1.5px solid var(--sw-line);border-radius:8px;text-align:center;padding:10px 0;font-size:16px;font-weight:500;background:var(--sw-card);color:var(--sw-fg)}
.swv .in{border-color:var(--sw-accent)!important;box-shadow:0 0 0 1.5px var(--sw-accent)}
.swv .win{border-color:var(--sw-accent)}
.swv .dim{opacity:.35}
.swv .tagi{color:var(--sw-ok);font-weight:500}
.swv .tago{color:var(--sw-bad);font-weight:500}
.swv .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}
.swv .m{background:var(--sw-card);border-radius:8px;padding:12px 14px}
.swv .m span{font-size:13px;color:var(--sw-fg2);display:block}
.swv .m b{font-size:24px;font-weight:500}
.swv .info{background:var(--sw-card);border-radius:8px;padding:12px 14px;font-size:14px;line-height:1.8;margin-top:12px}
.swv .ctl{display:flex;align-items:center;gap:10px}
.swv .ctl button{background:var(--sw-card);color:var(--sw-fg);border:1px solid var(--sw-line);border-radius:8px;padding:4px 12px;cursor:pointer;font-size:14px}
.swv .ctl button:hover{border-color:var(--sw-accent)}
.swv .lg{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--sw-fg2);margin-top:10px}
.swv .lg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px}
@media (max-width:480px){.swv .stats{grid-template-columns:1fr}}
.swv .dupc{border-color:var(--sw-bad)!important;box-shadow:0 0 0 1.5px var(--sw-bad)}
</style>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">arrivals = [1,2,3,3,3,4]，w = 3，m = 2</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>窗口（最近 w 天）</span>
  <span><i style="border:1.5px solid var(--sw-bad)"></i>被丟棄的物品</span>
  <span class="tagi">入 = 今天到達</span>
  <span class="tago">出 = 本步結束後離開窗口</span>
</div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>已丟棄 ans</span><b class="ans">0</b></div>
  <div class="m"><span>窗口內保留的物品數</span><b class="kept">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-a');
  var orig=[1,2,3,3,3,4],w=3,m=2,n=orig.length,st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  function build(){
    var a=orig.slice(),cnt={},ans=0,gone=[],i;
    for(i=0;i<n;i++){
      var x=a[i],c=cnt[x]||0,dis=false;
      if(c===m){a[i]=0;ans++;dis=true;gone.push(i)}
      else cnt[x]=c+1;
      var snap={i:i,x:x,c:c,dis:dis,ans:ans,gone:gone.slice(),cnt:{},l:Math.max(0,i+1-w)};
      for(var key in cnt)if(key!=='0'&&cnt[key]>0)snap.cnt[key]=cnt[key];
      var left=i+1-w;
      if(left>=0){snap.out=left;snap.outv=a[left];snap.outdis=a[left]===0;cnt[a[left]]=(cnt[a[left]]||0)-1}
      steps.push(snap);
    }
  }
  build();
  function fmt(o){
    var p=[],x;
    for(x in o)p.push(x+':'+o[x]);
    return '{'+p.join(', ')+'}';
  }
  function draw(){
    var L=steps[st],x='',y='',z='',j,kept=0;
    for(j=L.l;j<=L.i;j++)if(L.gone.indexOf(j)<0)kept++;
    for(j=0;j<orig.length;j++){
      var tg='';
      if(j===L.i)tg='<span class="tagi">入</span>';
      if(L.out!==undefined&&j===L.out)tg='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      var gn=L.gone.indexOf(j)>=0;
      var cl='c'+(j>=L.l&&j<=L.i?' win':' dim');
      if(j===L.i)cl+=' in';
      if(gn)cl+=' dupc';
      y+='<div class="'+cl+'"'+(gn?' style="text-decoration:line-through"':'')+'>'+orig[j]+'</div>';
      z+='<div class="ix">'+(j+1)+'</div>';
    }
    q('.r-tag').innerHTML=x;
    q('.r-cells').innerHTML=y;
    q('.r-ix').innerHTML=z;
    q('.ans').textContent=L.ans;
    q('.kept').textContent=kept;
    q('.stp').textContent='第 '+(L.i+1)+' 天（'+(st+1)+' / '+steps.length+'）';
    var t='<div>入：第 '+(L.i+1)+' 天，物品 '+L.x+' 到達，目前窗口內 cnt['+L.x+'] = '+L.c+'</div>';
    if(L.dis)t+='<div>cnt['+L.x+'] = '+L.c+' = m，已達上限，<b>丟棄</b>這個物品，ans = <b>'+L.ans+'</b>（不增加 cnt）</div>';
    else t+='<div>cnt['+L.x+'] = '+L.c+' &lt; m = '+m+'，保留，cnt['+L.x+'] 變成 '+(L.c+1)+'</div>';
    t+='<div>窗口內保留的次數 cnt = '+fmt(L.cnt)+'</div>';
    if(L.out!==undefined){
      t+=L.outdis?'<div>出：第 '+(L.out+1)+' 天的物品 '+orig[L.out]+' 早已被丟棄，已改成 0，離開時只會減 cnt[0]，不影響答案</div>':'<div>出：第 '+(L.out+1)+' 天的物品 '+L.outv+' 離開窗口，cnt['+L.outv+']--（給下一步用）</div>';
    }
    if(st===steps.length-1)t+='<div style="color:var(--sw-fg2)">全部處理完，答案 = '+L.ans+'</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(steps.length-1,st+1);
    else st=0;
    draw();
  });
  draw();
})();
</script>
</div>
{% endraw %}

### 解法（灵茶山艾府）

```java
class Solution {
    public int minArrivalsToDiscard(int[] arrivals, int w, int m) {
        Map<Integer, Integer> cnt = new HashMap<>(); // 更快的寫法是用陣列
        int ans = 0;
        for (int i = 0; i < arrivals.length; i++) {
            int x = arrivals[i];
            // x 進入視窗
            int c = cnt.getOrDefault(x, 0);
            if (c == m) { // x 的個數已達上限
                // 注意 x 在未來要離開視窗，但由於已經丟棄，不能在離開視窗時修改 cnt
                // 這裡直接置為 0，未來離開視窗就是 cnt[0]--，不影響判斷條件
                arrivals[i] = 0; // 丟棄 arrivals[i]
                ans++;
            } else {
                cnt.put(x, c + 1);
            }

            // 左端點元素離開視窗，為下一個迴圈做準備
            int left = i + 1 - w;
            if (left >= 0) {
                cnt.merge(arrivals[left], -1, Integer::sum); // cnt[arrivals[left]]--
            }
        }
        return ans;
    }
}
```

### 複雜度分析

* 時間複雜度：O(n) 或 O(n + U)，其中 n 是 `arrivals` 的長度，U = max(`arrivals`)。
* 空間複雜度：O(n) 或 O(n + U)。
