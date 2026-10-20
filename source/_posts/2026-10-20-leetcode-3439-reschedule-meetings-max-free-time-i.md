---
title: LeetCode 3439. 重新安排會議得到最多空餘時間 I（滑動視窗圖解）
date: 2026-10-20 11:00:00
tags:
- [LeetCode]
- [algorithm]
- [sliding window]
- [java]
category:
- [LeetCode]
index_img: ../image/banner/leetcode_index.jpeg
banner_img: ../image/banner/LeetCode_banner.jpeg
---

## 3439. 重新安排會議得到最多空餘時間 I

### 題目描述

給你一個整數 `eventTime` 表示一個活動的總時長，這個活動開始於 `t = 0`，結束於 `t = eventTime`。

同時給你兩個長度為 `n` 的整數陣列 `startTime` 和 `endTime`。它們表示這次活動中 `n` 個時間**沒有重疊**的會議，其中第 `i` 個會議的時間為 `[startTime[i], endTime[i]]`。

你可以重新安排**至多** `k` 個會議，安排的規則是將會議時間平移，且保持原來的**會議時長**，你的目的是移動會議後**最大化**相鄰兩個會議之間的**最長**連續空餘時間。

移動前後所有會議之間的**相對**順序需要保持不變，而且會議時間也需要保持互不重疊。

請你回傳重新安排會議以後，可以得到的**最大**空餘時間。

注意，會議**不能**安排到整個活動的時間以外。

**範例 1**

```
輸入：eventTime = 5, k = 1, startTime = [1,3], endTime = [2,5]
輸出：2
解釋：將 [1, 2] 的會議安排到 [2, 3]，得到空餘時間 [0, 2]。
```

**範例 2**

```
輸入：eventTime = 10, k = 1, startTime = [0,2,9], endTime = [1,4,10]
輸出：6
解釋：將 [2, 4] 的會議安排到 [1, 3]，得到空餘時間 [3, 9]。
```

**範例 3**

```
輸入：eventTime = 5, k = 2, startTime = [0,1,2,3,4], endTime = [1,2,3,4,5]
輸出：0
解釋：活動中的所有時間都被會議安排滿了。
```

**限制**

* `1 <= eventTime <= 10^9`
* `n == startTime.length == endTime.length`
* `2 <= n <= 10^5`
* `1 <= k <= n`
* `0 <= startTime[i] < endTime[i] <= eventTime`
* `endTime[i] <= startTime[i + 1]`，其中 `i` 在範圍 `[0, n - 2]` 之間。

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/reschedule-meetings-for-maximum-free-time-i/solutions/3061619/zhuan-huan-cheng-ding-chang-hua-dong-chu-1kg1/)。圖解與步驟說明為自行補充。

### 前置知識：定長滑動視窗

定長視窗每次右移一格，少一個最左元素、多一個新元素，所以視窗和可以用 `s += 新 - 舊` 在 O(1) 內更新，不必每次重算。前面幾篇已經用過，例如 [2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/) 和 [1423](/2026/10/19/leetcode-1423-maximum-points-from-cards/)。

### 思路

這題不太好直接看出是滑動視窗，要分三步轉換。

#### 第一步：把會議時間軸看成「會議」和「空餘時間」交錯

整個活動是一條 `0 ~ eventTime` 的時間軸，會議把它切成一段一段。下面用範例 2（`eventTime = 10`），深色是會議、淺色是空餘時間。按「下一步」看每個空餘時間段是怎麼算出來的：

{% raw %}
<div class="swv" id="swv-a">
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
<style>
.swv .tl{display:flex;height:46px;border-radius:8px;overflow:hidden;border:1px solid var(--sw-line);background:var(--sw-card)}
.swv .tl>div{display:flex;align-items:center;justify-content:center;font-size:12px;white-space:nowrap;overflow:hidden;box-sizing:border-box;border-right:1px solid var(--sw-bg)}
.swv .tl .mt{background:var(--sw-fg);color:var(--sw-bg)}
.swv .tl .mh{background:var(--sw-fg);color:var(--sw-bg);box-shadow:inset 0 0 0 2px var(--sw-accent)}
.swv .tl .gp{background:var(--sw-card);color:var(--sw-fg2)}
.swv .tl .gh{background:var(--sw-card);color:var(--sw-fg);font-weight:600;box-shadow:inset 0 0 0 2px var(--sw-accent)}
.swv .tl .gm{background:var(--sw-ok);color:#fff;font-weight:600}
.swv .ax{position:relative;height:18px;font-size:11px;color:var(--sw-fg3);margin-bottom:4px}
.swv .ax span{position:absolute;top:2px;transform:translateX(-50%)}
.swv .ax span:first-child{transform:none}
.swv .ax span:last-child{transform:translateX(-100%)}
.swv .kb{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--sw-fg2);margin-bottom:10px;flex-wrap:wrap}
.swv .kb button{background:var(--sw-card);color:var(--sw-fg);border:1px solid var(--sw-line);border-radius:8px;padding:2px 10px;cursor:pointer;font-size:14px}
.swv .kb button.on{border-color:var(--sw-accent);color:var(--sw-accent);font-weight:600}
</style>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">eventTime = 10，startTime = [0,2,9]，endTime = [1,4,10]：深色是會議，淺色是空餘時間</div>
<div class="tlbox"></div>
<div class="lab">依序算出每個空餘時間段，存進 free 陣列</div>
<div class="row r-cells" style="--sw-n:4"></div>
<div class="row r-ix" style="--sw-n:4"></div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-a');
  var T=10,st0=[0,2,9],en=[1,4,10],n=st0.length;
  var free=[];
  (function(){for(var i=0;i<=n;i++)free.push(i===0?st0[0]:(i===n?T-en[n-1]:st0[i]-en[i-1]))})();
  function seg(cls,len,txt){
    if(len<=0)return '';
    return '<div class="'+cls+'" style="flex:0 0 '+(len/T*100)+'%">'+txt+'</div>';
  }
  function axis(){
    var s='<div class="ax">';
    for(var t=0;t<=T;t++)s+='<span style="left:'+(t/T*100)+'%">'+t+'</span>';
    return s+'</div>';
  }
  function mt(j,cls){return seg(cls||'mt',en[j]-st0[j],'['+st0[j]+','+en[j]+']')}

  var N=n+1,st=0;
  var q=function(c){return root.querySelector(c)};
  function draw(){
    var h='',j,box='';
    for(j=0;j<=n;j++){
      box+=seg(j===st?'gh':'gp',free[j],free[j]);
      if(j<n)box+=mt(j);
    }
    q('.tlbox').innerHTML='<div class="tl">'+box+'</div>'+axis();
    var y='',z='';
    for(j=0;j<N;j++){
      y+='<div class="c'+(j===st?' win in':(j<st?' win':' dim'))+'">'+(j<=st?free[j]:'?')+'</div>';
      z+='<div class="ix">free['+j+']</div>';
    }
    q('.r-cells').innerHTML=y;
    q('.r-ix').innerHTML=z;
    q('.stp').textContent='第 '+st+' 個空餘時間段（'+(st+1)+' / '+N+'）';
    var t;
    if(st===0)t='<div>最左邊：第一個會議開始之前，長度 = startTime[0] = <b>'+st0[0]+'</b>（從 0 開始，這一段是空的）</div>';
    else if(st===n)t='<div>最右邊：最後一個會議結束之後，長度 = eventTime - endTime['+(n-1)+'] = '+T+' - '+en[n-1]+' = <b>'+free[n]+'</b></div>';
    else t='<div>中間：夾在第 '+(st-1)+' 個和第 '+st+' 個會議之間，長度 = startTime['+st+'] - endTime['+(st-1)+'] = '+st0[st]+' - '+en[st-1]+' = <b>'+free[st]+'</b></div>';
    t+='<div style="color:var(--sw-fg2)">n = '+n+' 個會議，所以有 n + 1 = '+N+' 個空餘時間段（長度可以是 0）</div>';
    if(st===N-1)t+='<div>得到 free = ['+free.join(', ')+']，和題解範例 2 的 <b>[0,1,5,0]</b> 相同</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(N-1,st+1);
    else st=0;
    draw();
  });
  draw();
})();
</script>
</div>
{% endraw %}

重點整理：

* 有 `n` 個會議，就有 `n + 1` 個空餘時間段：最左邊一個、最右邊一個，中間有 `n − 1` 個夾在兩個相鄰會議之間。
* 空餘時間段的長度可以是 0（例如會議剛好接在一起，或第一個會議從 0 開始）。
* 三種長度的算法：
  * 最左邊：`startTime[0]`
  * 中間：`startTime[i] - endTime[i - 1]`
  * 最右邊：`eventTime - endTime[n - 1]`
* 範例 1 的空餘時間段是 `[1, 1, 0]`，範例 2 是 `[0, 1, 5, 0]`，範例 3 是 `[0, 0, 0, 0, 0, 0]`。

#### 第二步：移動會議，其實是在「合併」相鄰的空餘時間段

看範例 1（`eventTime = 5`，會議 `[1,2]` 和 `[3,5]`，空餘時間段是 `[0,1]`、`[2,3]`、`[]`）：

* 把會議 `[1, 2]` 向左移到 `[0, 1]`，左邊的空餘時間段 `[0, 1]` 消失，右邊多出 `[1, 3]`，長度變成 `1 + 1 = 2`。
* 把會議 `[1, 2]` 向右移到 `[2, 3]`，右邊的空餘時間段 `[2, 3]` 消失，左邊變成 `[0, 2]`，長度同樣是 `1 + 1 = 2`。

不管往哪邊移，都等於把這個會議**兩側**長為 1 的兩段空餘時間**合併**成一段。移動會議不會讓空餘時間的**總量**改變，只是把它們湊在一起。

推廣到 `k` 個會議：

* `k = 1`：移動一個會議，合併它兩側相鄰的 **2** 個空餘時間段。
* `k = 2`：移動兩個會議。因為會議的相對順序不能變，會議也不能互相穿過，要讓空餘時間湊成一大段，最好移動**相鄰的兩個會議**，把它們夾著的 **3** 個連續空餘時間段全部合併。如果移動的兩個會議不相鄰，湊出來的只是兩個分開的小段，不會比合併 3 個連續段更長。
* 一般地，最優做法是合併**連續 `k + 1` 個**空餘時間段。

下面用範例 2 實際看看。可以切換 `k`，再逐個視窗往右看：上排是原本的時間軸，藍框是視窗內的 `k + 1` 個空餘時間段和它們夾著的 `k` 個會議；下排是把這 `k` 個會議擠到一側後的樣子，綠色就是合併出來的連續空餘時間。

{% raw %}
<div class="swv" id="swv-b">
<div class="kb"><span>最多移動 k 個會議：</span><button type="button" data-k="0">k = 0</button><button type="button" data-k="1">k = 1</button><button type="button" data-k="2">k = 2</button><button type="button" data-k="3">k = 3</button></div>
<div class="ctl">
  <button type="button" data-a="prev">上一個視窗</button>
  <button type="button" data-a="next">下一個視窗</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">原本（藍框是視窗內連續 k + 1 個空餘時間段，以及它們夾著的 k 個會議）</div>
<div class="tlbox1"></div>
<div class="lab">把視窗內的 k 個會議擠到一側之後（綠色是合併出來的連續空餘時間）</div>
<div class="tlbox2"></div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>這個視窗合併出的空餘時間 s</span><b class="sum">0</b></div>
  <div class="m"><span>目前最大值 ans</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-b');
  var T=10,st0=[0,2,9],en=[1,4,10],n=st0.length;
  var free=[];
  (function(){for(var i=0;i<=n;i++)free.push(i===0?st0[0]:(i===n?T-en[n-1]:st0[i]-en[i-1]))})();
  function seg(cls,len,txt){
    if(len<=0)return '';
    return '<div class="'+cls+'" style="flex:0 0 '+(len/T*100)+'%">'+txt+'</div>';
  }
  function axis(){
    var s='<div class="ax">';
    for(var t=0;t<=T;t++)s+='<span style="left:'+(t/T*100)+'%">'+t+'</span>';
    return s+'</div>';
  }
  function mt(j,cls){return seg(cls||'mt',en[j]-st0[j],'['+st0[j]+','+en[j]+']')}

  var k=1,st=0;
  var q=function(c){return root.querySelector(c)};
  function sums(){
    var r=[],i,j;
    for(i=0;i+k<=n;i++){var s=0;for(j=i;j<=i+k;j++)s+=free[j];r.push(s)}
    return r;
  }
  function draw(){
    var S=sums(),lo=st,hi=st+k,j,a='',b='',s=S[st],ans=0;
    for(j=0;j<=st;j++)ans=Math.max(ans,S[j]);
    for(j=0;j<=n;j++){
      a+=seg(j>=lo&&j<=hi?'gh':'gp',free[j],free[j]);
      if(j<n)a+=mt(j,j>=lo&&j<hi?'mh':'mt');
    }
    for(j=0;j<lo;j++){b+=seg('gp',free[j],free[j]);b+=mt(j)}
    for(j=lo;j<hi;j++)b+=mt(j,'mh');
    b+=seg('gm',s,s);
    for(j=hi;j<=n;j++){
      if(j>hi)b+=seg('gp',free[j],free[j]);
      if(j<n)b+=mt(j);
    }
    q('.tlbox1').innerHTML='<div class="tl">'+a+'</div>'+axis();
    q('.tlbox2').innerHTML='<div class="tl">'+b+'</div>'+axis();
    q('.sum').textContent=s;
    q('.ans').textContent=ans;
    q('.stp').textContent='視窗 ['+lo+', '+hi+']（'+(st+1)+' / '+S.length+'）';
    var btns=root.querySelectorAll('.kb button');
    for(j=0;j<btns.length;j++)btns[j].className=(+btns[j].getAttribute('data-k')===k)?'on':'';
    var ms=[];for(j=lo;j<hi;j++)ms.push('['+st0[j]+','+en[j]+']');
    var parts=[];for(j=lo;j<=hi;j++)parts.push(free[j]);
    var t='<div>視窗長度 k + 1 = '+(k+1)+'：空餘時間段 free['+lo+'..'+hi+'] = ['+parts.join(', ')+']</div>';
    t+=k===0?'<div>k = 0 不能移動任何會議，所以只能看單一空餘時間段本身：s = <b>'+s+'</b></div>'
      :'<div>它們夾著 '+k+' 個會議 '+ms.join('、')+'，全部往一側平移擠在一起，這 '+(k+1)+' 段空餘時間就合併成一段：'+parts.join(' + ')+' = <b>'+s+'</b></div>';
    t+='<div>ans = max（前面各視窗）= <b>'+ans+'</b></div>';
    if(st===S.length-1)t+='<div style="color:var(--sw-fg2)">所有視窗看完：k = '+k+' 時最長空餘時間 = '+ans+'（範例 2 取 k = 1，答案是 6）</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var kk=e.target.getAttribute&&e.target.getAttribute('data-k');
    if(kk!==null&&kk!==undefined){k=+kk;st=0;draw();return}
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    var len=sums().length;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(len-1,st+1);
    else st=0;
    draw();
  });
  draw();
})();
</script>
</div>
{% endraw %}

可以自己玩玩看：

* `k = 0`：不能移動任何會議，答案就是原本最長的單一空餘時間段（5）。
* `k = 1`：視窗長度 2，三個視窗的和依序是 `0+1 = 1`、`1+5 = 6`、`5+0 = 5`，最大是 6，就是範例 2 的答案。
* `k = 3`：視窗長度 4，剛好涵蓋所有空餘時間段，等於把全部會議擠到一側，得到 `eventTime` 減去所有會議時長。

#### 第三步：轉成定長滑動視窗

問題於是變成：

> 給你 `n + 1` 個空餘時間段的長度，合併其中連續 `k + 1` 個，得到的最大長度是多少？

也就是：**長度為 `k + 1` 的視窗，求最大視窗和**，這是標準的定長滑動視窗。

視窗模板（和前面幾篇一樣）：

1. 入：新元素進入視窗，`s += free[i]`。
2. 若視窗還沒滿（`i < k`），繼續。注意視窗長度是 `k + 1`，所以 `i = 0 ~ k - 1` 時還不滿；到 `i = k` 視窗才剛好有 `k + 1` 個。
3. 更新：用 `s` 更新答案的最大值。
4. 出：最左邊的 `free[i - k]` 離開視窗，`s -= free[i - k]`。

兩種寫法的差別只在「空餘時間段的長度」怎麼取得：

* 寫法一：先建一個長為 `n + 1` 的 `free` 陣列存起來。
* 寫法二：用一個函式 `get(i)` 即時計算，省掉陣列，空間 O(1)。

### 方法一：建 free 陣列

#### 思路

1. 建立長為 `n + 1` 的陣列 `free`，依第一步的三種規則填入各空餘時間段的長度。
2. 套定長滑窗模板，視窗長 `k + 1`：`i` 往右走，先 `s += free[i]`；若 `i < k`，視窗還沒滿，繼續；否則用 `s` 更新 `ans`，再 `s -= free[i - k]`。

#### 圖解（可互動）

用範例 2：`free = [0,1,5,0]`，`k = 1`，視窗長度 2。視窗和依序是 1、6、5，`ans` 會從 0 → 1 → 6 → 6。

{% raw %}
<div class="swv" id="swv-c" style="--sw-n:4">
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">eventTime = 10，k = 1，startTime = [0,2,9]，endTime = [1,4,10]（空餘時間段共 n + 1 = 4 個，視窗長度 k + 1 = 2）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>視窗（k + 1 個空餘時間段）</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 更新後離開</span>
</div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>視窗總和 s</span><b class="sum">0</b></div>
  <div class="m"><span>目前最大值 ans</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var MODE=1;
  var root=document.getElementById('swv-c');
  var T=10,k=1,st0=[0,2,9],en=[1,4,10],n=st0.length,N=n+1,st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  function get(i){
    if(i===0)return st0[0];
    if(i===n)return T-en[n-1];
    return st0[i]-en[i-1];
  }
  function expr(i){
    if(i===0)return 'startTime[0] = '+st0[0];
    if(i===n)return 'eventTime - endTime['+(n-1)+'] = '+T+' - '+en[n-1]+' = '+get(i);
    return 'startTime['+i+'] - endTime['+(i-1)+'] = '+st0[i]+' - '+en[i-1]+' = '+get(i);
  }
  function build(){
    var free=[],i;
    for(i=0;i<=n;i++)free.push(get(i));
    var s=0,ans=0;
    for(i=0;i<k;i++)s+=free[i];
    steps.push({init:true,s:s,ans:ans,lo:0,hi:k-1});
    for(i=k;i<=n;i++){
      s+=free[i];
      var prev=ans;
      ans=Math.max(ans,s);
      steps.push({init:false,i:i,s:s,ans:ans,prev:prev,lo:i-k,hi:i});
      s-=free[i-k];
    }
    steps.free=free;
  }
  build();
  function draw(){
    var L=steps[st],free=steps.free,x='',y='',z='',j;
    for(j=0;j<N;j++){
      var tg='';
      if(!L.init&&j===L.i)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.lo)tg='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      var cl='c'+(j>=L.lo&&j<=L.hi?' win':' dim');
      if(!L.init&&j===L.i)cl+=' in';
      y+='<div class="'+cl+'">'+free[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=x;
    q('.r-cells').innerHTML=y;
    q('.r-ix').innerHTML=z;
    q('.sum').textContent=L.s;
    q('.ans').textContent=L.ans;
    q('.stp').textContent='視窗 ['+L.lo+', '+L.hi+']（'+(st+1)+' / '+steps.length+'）';
    var t='';
    if(L.init){
      t='<div>初始化：先累加前 k = '+k+' 個空餘時間段（i &lt; k 時只累加、不更新答案），s = <b>'+L.s+'</b></div>';
    }else{
      t=MODE===1
        ?'<div>入：free['+L.i+'] = '+free[L.i]+'，s += '+free[L.i]+'</div>'
        :'<div>入：get('+L.i+') = '+expr(L.i)+'，s += '+get(L.i)+'</div>';
      t+='<div>視窗 s = <b>'+L.s+'</b>；ans = max('+L.prev+', '+L.s+') = <b>'+L.ans+'</b></div>';
      t+=MODE===1
        ?'<div>出：free['+L.lo+'] = '+free[L.lo]+'，s -= '+free[L.lo]+'（給下一步用）</div>'
        :'<div>出：get('+L.lo+') = '+get(L.lo)+'，重新計算一次再 s -= '+get(L.lo)+'（給下一步用）</div>';
    }
    if(st===steps.length-1)t+='<div style="color:var(--sw-fg2)">全部視窗看完，答案 = '+L.ans+'</div>';
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

把這個過程寫成表格（`k = 1`）：

| `i` | `free[i]` | 入：`s += free[i]` | 視窗滿了嗎 | 更新：`ans` | 出：`s -= free[i-k]` |
|---|---|---|---|---|---|
| 0 | 0 | `s = 0` | 否（`i < k`），跳過 | 不更新 | 不減 |
| 1 | 1 | `s = 0 + 1 = 1` | 是 | `max(0, 1) = 1` | `s = 1 - free[0] = 1` |
| 2 | 5 | `s = 1 + 5 = 6` | 是 | `max(1, 6) = 6` | `s = 6 - free[1] = 5` |
| 3 | 0 | `s = 5 + 0 = 5` | 是 | `max(6, 5) = 6` | `s = 5 - free[2] = 0` |

最後 `ans = 6`。

#### 解法（灵茶山艾府）

```java
class Solution {
    public int maxFreeTime(int eventTime, int k, int[] startTime, int[] endTime) {
        int n = startTime.length;
        int[] free = new int[n + 1];
        free[0] = startTime[0]; // 最左邊的空餘時間段
        for (int i = 1; i < n; i++) {
            free[i] = startTime[i] - endTime[i - 1]; // 中間的空餘時間段
        }
        free[n] = eventTime - endTime[n - 1]; // 最右邊的空餘時間段

        // 套定長滑窗模板（視窗長為 k+1）
        int ans = 0;
        int s = 0;
        for (int i = 0; i <= n; i++) {
            s += free[i];
            if (i < k) {
                continue;
            }
            ans = Math.max(ans, s);
            s -= free[i - k];
        }
        return ans;
    }
}
```

#### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `startTime` 的長度。
* 空間複雜度：O(n)。

### 方法二：空間優化（用函式取代陣列）

#### 思路

流程和方法一完全相同，只是把「第 `i` 個空餘時間段的長度」包成函式 `get(i)`：進入視窗時算一次 `get(i)`，離開視窗時再算一次 `get(i - k)`。每個值多算一次，換來不用 `free` 陣列，空間降為 O(1)。

`get(i)` 對應第一步的三種情況：`i == 0` 是最左邊、`i == n` 是最右邊，其餘是中間。

#### 圖解（可互動）

同樣用範例 2。看資訊區：這裡不會有 `free` 陣列，每一步都是直接由 `startTime`、`endTime` 算出該空餘時間段。

{% raw %}
<div class="swv" id="swv-d" style="--sw-n:4">
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">eventTime = 10，k = 1，startTime = [0,2,9]，endTime = [1,4,10]（空餘時間段共 n + 1 = 4 個，視窗長度 k + 1 = 2）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>視窗（k + 1 個空餘時間段）</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 更新後離開</span>
</div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>視窗總和 s</span><b class="sum">0</b></div>
  <div class="m"><span>目前最大值 ans</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var MODE=2;
  var root=document.getElementById('swv-d');
  var T=10,k=1,st0=[0,2,9],en=[1,4,10],n=st0.length,N=n+1,st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  function get(i){
    if(i===0)return st0[0];
    if(i===n)return T-en[n-1];
    return st0[i]-en[i-1];
  }
  function expr(i){
    if(i===0)return 'startTime[0] = '+st0[0];
    if(i===n)return 'eventTime - endTime['+(n-1)+'] = '+T+' - '+en[n-1]+' = '+get(i);
    return 'startTime['+i+'] - endTime['+(i-1)+'] = '+st0[i]+' - '+en[i-1]+' = '+get(i);
  }
  function build(){
    var free=[],i;
    for(i=0;i<=n;i++)free.push(get(i));
    var s=0,ans=0;
    for(i=0;i<k;i++)s+=free[i];
    steps.push({init:true,s:s,ans:ans,lo:0,hi:k-1});
    for(i=k;i<=n;i++){
      s+=free[i];
      var prev=ans;
      ans=Math.max(ans,s);
      steps.push({init:false,i:i,s:s,ans:ans,prev:prev,lo:i-k,hi:i});
      s-=free[i-k];
    }
    steps.free=free;
  }
  build();
  function draw(){
    var L=steps[st],free=steps.free,x='',y='',z='',j;
    for(j=0;j<N;j++){
      var tg='';
      if(!L.init&&j===L.i)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.lo)tg='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      var cl='c'+(j>=L.lo&&j<=L.hi?' win':' dim');
      if(!L.init&&j===L.i)cl+=' in';
      y+='<div class="'+cl+'">'+free[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=x;
    q('.r-cells').innerHTML=y;
    q('.r-ix').innerHTML=z;
    q('.sum').textContent=L.s;
    q('.ans').textContent=L.ans;
    q('.stp').textContent='視窗 ['+L.lo+', '+L.hi+']（'+(st+1)+' / '+steps.length+'）';
    var t='';
    if(L.init){
      t='<div>初始化：先累加前 k = '+k+' 個空餘時間段（i &lt; k 時只累加、不更新答案），s = <b>'+L.s+'</b></div>';
    }else{
      t=MODE===1
        ?'<div>入：free['+L.i+'] = '+free[L.i]+'，s += '+free[L.i]+'</div>'
        :'<div>入：get('+L.i+') = '+expr(L.i)+'，s += '+get(L.i)+'</div>';
      t+='<div>視窗 s = <b>'+L.s+'</b>；ans = max('+L.prev+', '+L.s+') = <b>'+L.ans+'</b></div>';
      t+=MODE===1
        ?'<div>出：free['+L.lo+'] = '+free[L.lo]+'，s -= '+free[L.lo]+'（給下一步用）</div>'
        :'<div>出：get('+L.lo+') = '+get(L.lo)+'，重新計算一次再 s -= '+get(L.lo)+'（給下一步用）</div>';
    }
    if(st===steps.length-1)t+='<div style="color:var(--sw-fg2)">全部視窗看完，答案 = '+L.ans+'</div>';
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

#### 解法（灵茶山艾府）

```java
class Solution {
    public int maxFreeTime(int eventTime, int k, int[] startTime, int[] endTime) {
        int ans = 0;
        int s = 0;
        for (int i = 0; i <= startTime.length; i++) {
            s += get(i, eventTime, startTime, endTime);
            if (i < k) {
                continue;
            }
            ans = Math.max(ans, s);
            s -= get(i - k, eventTime, startTime, endTime);
        }
        return ans;
    }

    private int get(int i, int eventTime, int[] startTime, int[] endTime) {
        if (i == 0) {
            return startTime[0]; // 最左邊的空餘時間段
        }
        int n = startTime.length;
        if (i == n) {
            return eventTime - endTime[n - 1]; // 最右邊的空餘時間段
        }
        return startTime[i] - endTime[i - 1]; // 中間的空餘時間段
    }
}
```

#### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `startTime` 的長度。
* 空間複雜度：O(1)。
