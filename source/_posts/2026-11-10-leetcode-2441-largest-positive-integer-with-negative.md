---
title: LeetCode 2441. 與對應負數同時存在的最大正整數（哈希集合一次遍歷圖解）
date: 2026-11-10 10:00:00
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

## 2441. 與對應負數同時存在的最大正整數

### 題目描述

給你一個**不包含任何零**的整數陣列 `nums`，找出「自身與對應的負數都在陣列中存在」的最大正整數 `k`。

回傳正整數 `k`，如果不存在這樣的整數，回傳 `-1`。

**範例 1**

```
輸入：nums = [-1,2,-3,3]
輸出：3
解釋：3 是陣列中唯一一個滿足題目要求的 k。
```

**範例 2**

```
輸入：nums = [-1,10,6,7,-7,1]
輸出：7
解釋：陣列中存在 1 和 7 對應的負數，7 的值更大。
```

**範例 3**

```
輸入：nums = [-10,8,6,7,-2,-3]
輸出：-1
解釋：不存在滿足題目要求的 k，回傳 -1。
```

**限制**

* `1 <= nums.length <= 1000`
* `-1000 <= nums[i] <= 1000`
* `nums[i] != 0`

> 本題為[第 315 場周賽](https://leetcode.cn/contest/weekly-contest-315) Q1。本文題解思路與程式碼整理自 LeetCode 題解作者[灵茶山艾府](https://leetcode.cn/u/endlesscheng/)，[影片講解](https://www.bilibili.com/video/BV1Ae4y1i7PM/)。圖解與步驟說明為自行補充。

### 前置知識：哈希集合

`HashSet` 只回答一件事：「這個數有沒有放進去過」，查詢與新增平均都是 O(1)。這題不需要知道每個數出現幾次，只需要知道「在不在」，所以用集合就夠了，不必用 Map 計數。

### 思路

#### 把題目換成「找一對相反數」

「`k` 與 `-k` 都在陣列中」就是陣列裡有一對相反數 `(k, -k)`。要的是所有這樣的對裡，**正數那一邊最大**的那個 `k`。

#### 為什麼一次遍歷就夠

一對相反數 `a` 與 `-a` 在陣列中會有先後。不論誰先誰後，**後出現的那個**走到時，先出現的那個已經在集合裡了。所以：

1. 準備一個空的哈希集合 `s`，記錄已經遍歷過的數；`ans = -1`。
2. 從左到右遍歷，設目前的數是 `x`。
3. 如果 `-x` 在 `s` 裡，說明 `x` 和 `-x` 湊成一對，候選答案是 `|x|`（不管 `x` 是正是負，`|x|` 都是那個正整數 `k`），更新 `ans = max(ans, |x|)`。
4. 把 `x` 加進 `s`。
5. 遍歷結束回傳 `ans`。

#### 圖解（可互動）

用範例 2 `nums = [-1,10,6,7,-7,1]`。每個 `j` 走兩步：先查 `-x` 在不在集合（綠色格是先出現的那個相反數），再把 `x` 放進集合。留意最後一步：`x = 1` 也找到相反數 `-1`，但候選 1 比目前的 7 小，所以 `ans` 不變。

{% raw %}
<div class="swv" id="swv-a" style="--sw-n:6">
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
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">nums = [-1,10,6,7,-7,1]</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lab cap"></div>
<div class="cn"></div>
<div class="stats">
  <div class="m"><span>x = nums[j]</span><b class="vx">—</b></div>
  <div class="m"><span>−x 在集合裡嗎？</span><b class="vc">—</b></div>
  <div class="m"><span>ans（最大的 k）</span><b class="va">−1</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  /* 一邊遍歷一邊查 −x 是否在集合裡，再把 x 放進集合；ARR 為 nums */
  var root=document.getElementById('swv-a');
  var A=[-1,10,6,7,-7,1],n=A.length,st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  function build(){
    var set=[],ans=-1,j,x,i;
    steps=[{k:'init',set:[],ans:-1}];
    for(j=0;j<n;j++){
      x=A[j];
      var has=set.indexOf(-x)>=0,mi=-1;
      for(i=0;i<j;i++)if(A[i]===-x)mi=i;
      var old=ans;
      if(has)ans=Math.max(ans,Math.abs(x));
      steps.push({k:'chk',j:j,x:x,has:has,mi:mi,old:old,ans:ans,set:set.slice()});
      set.push(x);
      steps.push({k:'add',j:j,x:x,ans:ans,set:set.slice()});
    }
    steps.push({k:'done',ans:ans,set:set.slice()});
  }
  function draw(){
    var L=steps[st],a='',b='',c='',i,cl;
    for(i=0;i<n;i++){
      cl='c';
      if(L.j!==undefined){
        if(i===L.j)cl+=' cur';
        else if(i<L.j)cl+=(L.k==='chk'&&i===L.mi)?' hit':' seen';
        else cl+=' nx';
      }
      a+='<div class="tg">'+(L.j===i?'j':'')+'</div>';
      b+='<div class="'+cl+'">'+A[i]+'</div>';
      c+='<div class="ix">'+i+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    q('.cap').textContent='哈希集合 s（只存已經遍歷過的數）';
    var h='';
    for(i=0;i<L.set.length;i++){
      var v=L.set[i];
      h+='<div class="e'+(L.k==='chk'&&L.has&&v===-L.x?' on':'')+(L.k==='add'&&v===L.x&&i===L.set.length-1?' up':'')+'">'+v+'</div>';
    }
    if(!L.set.length)h='<div class="none">（空集合）</div>';
    q('.cn').innerHTML=h;
    q('.vx').textContent=L.x===undefined?'—':L.x;
    q('.vc').textContent=L.k==='chk'?(L.has?'在':'不在'):'—';
    q('.va').textContent=L.ans;
    q('.stp').textContent=(st+1)+' / '+steps.length;
    var t;
    if(L.k==='init')t='<div>集合一開始是空的，ans = −1（找不到就回傳 −1）。從左到右看每個 x，問：<b>−x 之前出現過嗎？</b></div>';
    else if(L.k==='chk'){
      t='<div>j = '+L.j+'，x = '+L.x+'，−x = '+(-L.x)+'：集合裡'+(L.has?'<b>有</b> '+(-L.x)+'，兩個數互為相反數':'沒有 '+(-L.x))+'</div>';
      if(L.has){
        var cand=Math.abs(L.x);
        t+='<div>候選 k = |x| = '+cand+'，ans = max('+L.old+', '+cand+') = <b>'+L.ans+'</b>'+(L.ans===L.old?'（沒有變大，ans 不變）':'（更新）')+'</div>';
      }else t+='<div>不更新 ans</div>';
    }else if(L.k==='add')t='<div>把 '+L.x+' 加進集合，之後的數可以用 −x 來查它</div>';
    else t='<div>遍歷結束，答案 = <b>'+L.ans+'</b></div>';
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
  build();draw();
})();
</script>
</div>
{% endraw %}

### 解法（灵茶山艾府）

```java
class Solution {
    public int findMaxK(int[] nums) {
        int ans = -1;
        var s = new HashSet<Integer>();
        for (int x : nums) {
            if (s.contains(-x)) {
                ans = Math.max(ans, Math.abs(x));
            }
            s.add(x);
        }
        return ans;
    }
}
```

### 補充說明（自行補充）

* **為什麼先查再加**：先查 `-x`、再加入 `x`，查詢時集合裡只有 `x` 左邊的數。這題保證 `nums[i] != 0`，所以 `x` 和 `-x` 不可能是同一個數，先加入再查結果也一樣；但如果題目允許 0，先加入會讓 0 自己配對自己，順序就要小心。
* **為什麼用 `Math.abs(x)`**：`x` 可能是負數，走到 `-7` 時查到 `7` 在集合裡，候選答案是 7，不是 -7。

### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `nums` 的長度。每個數只處理一次。
* 空間複雜度：O(n)，集合最多存 n 個數。
