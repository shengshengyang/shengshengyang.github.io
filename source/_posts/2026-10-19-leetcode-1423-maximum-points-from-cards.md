---
title: LeetCode 1423. 可獲得的最大點數（逆向思維＋滑動視窗圖解）
date: 2026-10-19 12:00:00
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

## 1423. 可獲得的最大點數

### 題目描述

幾張卡牌排成一行，每張卡牌都有一個對應的點數，點數由整數陣列 `cardPoints` 給出。

每次行動，你可以從行的開頭或者末尾拿一張卡牌，最終你必須**正好**拿 `k` 張卡牌。

你的點數就是你拿到手中的所有卡牌的點數之和。

給你一個整數陣列 `cardPoints` 和整數 `k`，請你回傳可以獲得的最大點數。

**範例 1**

```
輸入：cardPoints = [1,2,3,4,5,6,1], k = 3
輸出：12
解釋：第一次行動，不管拿哪張牌，點數總是 1。但是先拿最右邊的卡牌會最大化可獲得點數。
最優策略是拿右邊的三張牌，最終點數為 1 + 6 + 5 = 12。
```

**範例 2**

```
輸入：cardPoints = [2,2,2], k = 2
輸出：4
```

**範例 3**

```
輸入：cardPoints = [9,7,7,9,7,7,9], k = 7
輸出：55
解釋：必須拿起所有卡牌，點數為所有卡牌點數之和。
```

**範例 4**

```
輸入：cardPoints = [1,1000,1], k = 1
輸出：1
解釋：你無法拿到中間那張卡牌，所以最大點數為 1。
```

**範例 5**

```
輸入：cardPoints = [1,79,80,1,1,1,200,1], k = 3
輸出：202
```

**限制**

* `1 <= cardPoints.length <= 10^5`
* `1 <= cardPoints[i] <= 10^4`
* `1 <= k <= cardPoints.length`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/maximum-points-you-can-obtain-from-cards/solutions/2551432/liang-chong-fang-fa-ni-xiang-si-wei-zhen-e3gb/)。圖解為自行補充。

### 前置知識：定長滑動視窗

定長視窗每次右移一格，少一個最左元素、多一個新元素，所以視窗和可以用 `s += 新 - 舊` 在 O(1) 內更新。前面幾篇（[2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/)、[2461](/2026/10/19/leetcode-2461-max-sum-distinct-subarrays-k/)）已用過。

### 方法一：逆向思維

#### 思路

拿走 `k` 張，剩下 `n − k` 張（`n` 是 `cardPoints` 的長度）。因為

> 拿走的點數和 + 剩下的點數和 = 所有點數和（常數）

所以要**最大化**拿走的點數和，就是**最小化**剩下的點數和。

又因為只能從開頭或末尾拿牌，最後剩下的牌一定是**連續**的一段。於是問題變成：

> 計算長為 `n − k` 的連續子陣列和的**最小值**。

這就是定長滑動視窗：

1. 設 `m = n − k`，算第一個長為 `m` 的子陣列和 `s`，令 `minS = s`。
2. 視窗右移一格，`s` 增加 `cardPoints[i] - cardPoints[i - m]`，再用 `s` 更新 `minS`。
3. 答案 = 全部元素和 − `minS`。

#### 圖解（可互動）

下面用範例 1 示範方法一：`cardPoints = [1,2,3,4,5,6,1]`，`k = 3`，視窗長度 `m = 4`。視窗是「剩下的牌」，視窗外就是被拿走的牌。

{% raw %}

<div class="swv" id="swv-a" style="--sw-n:7">
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
</style>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">cardPoints = [1,2,3,4,5,6,1]，k = 3（剩下的視窗長度 m = n − k = 4）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>剩下的牌（視窗）</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line);opacity:.35"></i>被拿走的牌</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 剛離開</span>
</div>
<div class="stats">
  <div class="m"><span>視窗總和 s（剩下）</span><b class="sum">0</b></div>
  <div class="m"><span>最小值 minS</span><b class="mn">0</b></div>
  <div class="m"><span>答案 total − minS</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-a');
  var a=[1,2,3,4,5,6,1],k=3,n=a.length,m=n-k,steps=n-m+1,st=0,total=0;
  for(var z=0;z<n;z++)total+=a[z];
  var q=function(c){return root.querySelector(c)};
  function calc(t){
    var s=0,i;
    for(i=0;i<m;i++)s+=a[i];
    var mn=s,log={init:true,s:s,mn:mn,prev:s,lo:0,hi:m-1};
    for(var w=1;w<=t;w++){
      var add=a[w+m-1],rem=a[w-1];
      s+=add-rem;
      var prev=mn;
      mn=Math.min(mn,s);
      log={init:false,s:s,mn:mn,prev:prev,add:add,rem:rem,lo:w,hi:w+m-1};
    }
    return log;
  }
  function draw(){
    var L=calc(st),x='',y='',z='';
    for(var j=0;j<n;j++){
      var tg='';
      if(!L.init&&j===L.hi)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.lo-1)tg='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      var cl='c'+(j>=L.lo&&j<=L.hi?' win':' dim');
      if(!L.init&&j===L.hi)cl+=' in';
      y+='<div class="'+cl+'">'+a[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=x;
    q('.r-cells').innerHTML=y;
    q('.r-ix').innerHTML=z;
    q('.sum').textContent=L.s;
    q('.mn').textContent=L.mn;
    q('.ans').textContent=total-L.mn;
    q('.stp').textContent='視窗 ['+L.lo+', '+L.hi+']（'+(st+1)+' / '+steps+'）';
    var t='';
    if(L.init){
      t='<div>初始化：前 m = '+m+' 張的和 s = <b>'+L.s+'</b>，minS = s</div>';
    }else{
      t='<div>入：cardPoints['+L.hi+'] = '+L.add+'，出：cardPoints['+(L.lo-1)+'] = '+L.rem+'</div>';
      t+='<div>s 變化 '+(L.add-L.rem>=0?'+':'')+(L.add-L.rem)+'，變成 <b>'+L.s+'</b>；minS = min('+L.prev+', '+L.s+') = <b>'+L.mn+'</b></div>';
    }
    t+='<div>拿走的點數 = total − minS = '+total+' − '+L.mn+' = <b>'+(total-L.mn)+'</b></div>';
    if(st===steps-1)t+='<div style="color:var(--sw-fg2)">視窗已到最右邊，答案 = '+(total-L.mn)+'</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(steps-1,st+1);
    else st=0;
    draw();
  });
  draw();
})();
</script>
</div>

{% endraw %}

範例 1 的最小值在第一個視窗就出現了，看不到「最佳值被更新」。換一組資料：`cardPoints = [3,1,5,2,1,1,6]`，`k = 3`，視窗長度 `m = 4`，四個視窗和依序是 11、9、9、10。`minS` 會在第二步從 11 更新成 9，答案 `19 − 9 = 10`（拿前 2 張加最後 1 張，或前 1 張加最後 2 張，都是 10）。

{% raw %}

<div class="swv" id="swv-b" style="--sw-n:7">
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">cardPoints = [3,1,5,2,1,1,6]，k = 3（剩下的視窗長度 m = n − k = 4）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>剩下的牌（視窗）</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line);opacity:.35"></i>被拿走的牌</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 剛離開</span>
</div>
<div class="stats">
  <div class="m"><span>視窗總和 s（剩下）</span><b class="sum">0</b></div>
  <div class="m"><span>最小值 minS</span><b class="mn">0</b></div>
  <div class="m"><span>答案 total − minS</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-b');
  var a=[3,1,5,2,1,1,6],k=3,n=a.length,m=n-k,steps=n-m+1,st=0,total=0;
  for(var z=0;z<n;z++)total+=a[z];
  var q=function(c){return root.querySelector(c)};
  function calc(t){
    var s=0,i;
    for(i=0;i<m;i++)s+=a[i];
    var mn=s,log={init:true,s:s,mn:mn,prev:s,lo:0,hi:m-1};
    for(var w=1;w<=t;w++){
      var add=a[w+m-1],rem=a[w-1];
      s+=add-rem;
      var prev=mn;
      mn=Math.min(mn,s);
      log={init:false,s:s,mn:mn,prev:prev,add:add,rem:rem,lo:w,hi:w+m-1};
    }
    return log;
  }
  function draw(){
    var L=calc(st),x='',y='',z='';
    for(var j=0;j<n;j++){
      var tg='';
      if(!L.init&&j===L.hi)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.lo-1)tg='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      var cl='c'+(j>=L.lo&&j<=L.hi?' win':' dim');
      if(!L.init&&j===L.hi)cl+=' in';
      y+='<div class="'+cl+'">'+a[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=x;
    q('.r-cells').innerHTML=y;
    q('.r-ix').innerHTML=z;
    q('.sum').textContent=L.s;
    q('.mn').textContent=L.mn;
    q('.ans').textContent=total-L.mn;
    q('.stp').textContent='視窗 ['+L.lo+', '+L.hi+']（'+(st+1)+' / '+steps+'）';
    var t='';
    if(L.init){
      t='<div>初始化：前 m = '+m+' 張的和 s = <b>'+L.s+'</b>，minS = s</div>';
    }else{
      t='<div>入：cardPoints['+L.hi+'] = '+L.add+'，出：cardPoints['+(L.lo-1)+'] = '+L.rem+'</div>';
      t+='<div>s 變化 '+(L.add-L.rem>=0?'+':'')+(L.add-L.rem)+'，變成 <b>'+L.s+'</b>；minS = min('+L.prev+', '+L.s+') = <b>'+L.mn+'</b></div>';
    }
    t+='<div>拿走的點數 = total − minS = '+total+' − '+L.mn+' = <b>'+(total-L.mn)+'</b></div>';
    if(st===steps-1)t+='<div style="color:var(--sw-fg2)">視窗已到最右邊，答案 = '+(total-L.mn)+'</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(steps-1,st+1);
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
    public int maxScore(int[] cardPoints, int k) {
        int n = cardPoints.length;
        int m = n - k;
        int s = 0;
        for (int i = 0; i < m; i++) {
            s += cardPoints[i];
        }

        int total = s;
        int minS = s;
        for (int i = m; i < n; i++) {
            total += cardPoints[i];
            s += cardPoints[i] - cardPoints[i - m];
            minS = Math.min(minS, s);
        }
        return total - minS;
    }
}
```

當 `m = 0`（`n = k`）時也正確：第一個迴圈不執行，`s = 0`、`minS = 0`，第二個迴圈只累加 `total`，最後回傳全部元素和。

#### 複雜度分析

* 時間複雜度：O(n)，其中 n 為 `cardPoints` 的長度。
* 空間複雜度：O(1)。

### 方法二：正向思維

#### 思路

拿走的牌一定是「前 `j` 張 + 後 `k − j` 張」，`j` 從 `k` 到 `0`。答案是這 `k + 1` 種組合的最大值：先算前 `k` 張的和，之後每次把前面的一張換成後面的一張，更新最大值。

#### 圖解（可互動）

方法二看的是「拿走的牌」：先拿前 `k` 張，之後每一步把頭段最右邊的一張放掉，改拿尾段最左邊的一張，共 `k + 1` 種組合，`ans` 取最大值。同樣用範例 1，這次 `ans` 會一路更新成 6 → 6 → 8 → 12。

{% raw %}

<div class="swv" id="swv-c" style="--sw-n:7">
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">cardPoints = [1,2,3,4,5,6,1]，k = 3（拿走的牌 = 前 j 張 + 後 k − j 張）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>被拿走的牌（頭段＋尾段）</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line);opacity:.35"></i>沒被拿的牌</span>
  <span class="tagi">入 = 換進來（尾段）</span>
  <span class="tago">出 = 換出去（頭段）</span>
</div>
<div class="stats">
  <div class="m"><span>前 j 張 ＋ 後 k−j 張</span><b class="jj">0</b></div>
  <div class="m"><span>拿走的點數 s</span><b class="sum">0</b></div>
  <div class="m"><span>最大值 ans</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-c');
  var a=[1,2,3,4,5,6,1],k=3,n=a.length,steps=k+1,st=0;
  var q=function(c){return root.querySelector(c)};
  function calc(t){
    var s=0,i;
    for(i=0;i<k;i++)s+=a[i];
    var ans=s,log={init:true,s:s,ans:ans,prev:s,head:k,tail:0};
    for(var w=1;w<=t;w++){
      var add=a[n-w],rem=a[k-w];
      s+=add-rem;
      var prev=ans;
      ans=Math.max(ans,s);
      log={init:false,s:s,ans:ans,prev:prev,add:add,rem:rem,head:k-w,tail:w,ai:n-w,ri:k-w};
    }
    return log;
  }
  function draw(){
    var L=calc(st),x='',y='',z='';
    for(var j=0;j<n;j++){
      var tg='';
      if(!L.init&&j===L.ai)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.ri)tg='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      var taken=j<L.head||j>=n-L.tail;
      var cl='c'+(taken?' win':' dim');
      if(!L.init&&j===L.ai)cl+=' in';
      y+='<div class="'+cl+'">'+a[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=x;
    q('.r-cells').innerHTML=y;
    q('.r-ix').innerHTML=z;
    q('.jj').textContent=L.head+' + '+L.tail;
    q('.sum').textContent=L.s;
    q('.ans').textContent=L.ans;
    q('.stp').textContent='前 '+L.head+' 張 + 後 '+L.tail+' 張（'+(st+1)+' / '+steps+'）';
    var t='';
    if(L.init){
      t='<div>初始化：先拿前 k = '+k+' 張，s = <b>'+L.s+'</b>，ans = s</div>';
    }else{
      t='<div>換牌：頭段放掉 cardPoints['+L.ri+'] = '+L.rem+'，改拿尾段 cardPoints['+L.ai+'] = '+L.add+'</div>';
      t+='<div>s 變化 '+(L.add-L.rem>=0?'+':'')+(L.add-L.rem)+'，變成 <b>'+L.s+'</b>；ans = max('+L.prev+', '+L.s+') = <b>'+L.ans+'</b></div>';
    }
    if(st===steps-1)t+='<div style="color:var(--sw-fg2)">已經變成後 k 張，答案 = '+L.ans+'</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(steps-1,st+1);
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
    public int maxScore(int[] cardPoints, int k) {
        int s = 0;
        for (int i = 0; i < k; i++) {
            s += cardPoints[i];
        }
        int ans = s;
        for (int i = 1; i <= k; i++) {
            s += cardPoints[cardPoints.length - i] - cardPoints[k - i];
            ans = Math.max(ans, s);
        }
        return ans;
    }
}
```

#### 複雜度分析

* 時間複雜度：O(k)。
* 空間複雜度：O(1)。

### 思考題

把題目改成：拿走的卡牌數量無限制，但 `cardPoints` 中有負數，如何求出可以獲得的最大點數和？（出自題解作者，本文不展開。）
