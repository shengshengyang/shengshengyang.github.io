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

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/reschedule-meetings-for-maximum-free-time-i/solutions/3061619/zhuan-huan-cheng-ding-chang-hua-dong-chu-1kg1/)。圖解為自行補充。

### 前置知識：定長滑動視窗

定長視窗每次右移一格，少一個最左元素、多一個新元素，所以視窗和可以用 `s += 新 - 舊` 在 O(1) 內更新。前面幾篇已經用過，例如 [2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/) 和 [1423](/2026/10/19/leetcode-1423-maximum-points-from-cards/)。

### 思路：把問題轉成空餘時間段的視窗和

看範例 1：

* 把會議 `[1, 2]` 向左移到 `[0, 1]`，會產生空餘時間段 `[1, 3]`。
* 把會議 `[1, 2]` 向右移到 `[2, 3]`，會產生空餘時間段 `[0, 2]`。

這兩種做法，都相當於把兩個相鄰、長為 1 的空餘時間段 `[0, 1]` 和 `[2, 3]` **合併**成一個長為 `1 + 1 = 2` 的空餘時間段。

* `k = 1`：可以合併相鄰的 2 個空餘時間段。
* `k = 2`：為了讓答案盡量大，合併連續 3 個空餘時間段最優（題目要求會議的相對順序不變，所以只能合併連續的）。
* 一般地，最優做法是合併**連續 `k + 1` 個**空餘時間段。

問題於是變成：

> 給你 `n + 1` 個空餘時間段，合併其中連續 `k + 1` 個，得到的最大長度是多少？

最左邊和最右邊各有一個空餘時間段，中間有 `n − 1` 個夾在兩個相鄰會議之間，共 `n + 1` 個。空餘時間段的長度可以是 0。

這就是視窗大小為 `k + 1` 的定長滑動視窗，求最大視窗和。

三種空餘時間段的長度：

* 最左邊：`startTime[0]`。
* 中間：`startTime[i] - endTime[i - 1]`。
* 最右邊：`eventTime - endTime[n - 1]`。

範例 1 的空餘時間段是 `[1,1,0]`，範例 2 是 `[0,1,5,0]`，範例 3 是 `[0,0,0,0,0,0]`。

兩種寫法的差別只在「空餘時間段的長度」怎麼取得：

* 寫法一：先建一個長為 `n + 1` 的 `free` 陣列存起來。
* 寫法二：用一個函式 `get(i)` 即時計算，省掉陣列，空間 O(1)。

### 方法一：建 free 陣列

#### 思路

1. 建立長為 `n + 1` 的陣列 `free`，依上面三種規則填入各空餘時間段的長度。
2. 套定長滑窗模板，視窗長 `k + 1`：`i` 往右走，先 `s += free[i]`；若 `i < k`，視窗還沒滿，繼續；否則用 `s` 更新 `ans`，再 `s -= free[i - k]`。

#### 圖解（可互動）

用範例 2：`free = [0,1,5,0]`，`k = 1`，視窗長度 2。視窗和依序是 1、6、5，`ans` 會從 0 → 1 → 6 → 6。

{% raw %}
<div class="swv" id="swv-a" style="--sw-n:4">
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
  var root=document.getElementById('swv-a');
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

#### 圖解（可互動）

同樣用範例 2。看資訊區：這裡不會有 `free` 陣列，每一步都是直接由 `startTime`、`endTime` 算出該空餘時間段。

{% raw %}
<div class="swv" id="swv-b" style="--sw-n:4">
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
  var root=document.getElementById('swv-b');
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
