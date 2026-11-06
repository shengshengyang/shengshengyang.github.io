---
title: LeetCode 1512. 好數對的數目（枚舉右、維護左圖解）
date: 2026-11-06 10:00:00
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

## 1512. 好數對的數目

### 題目描述

給你一個整數陣列 `nums`。如果一組數字 `(i, j)` 滿足 `nums[i] == nums[j]` 且 `i < j`，就可以認為這是一組**好數對**。

回傳好數對的數目。

**範例 1**

```
輸入：nums = [1,2,3,1,1,3]
輸出：4
解釋：有 4 組好數對，分別是 (0,3), (0,4), (3,4), (2,5)，下標從 0 開始
```

**範例 2**

```
輸入：nums = [1,1,1,1]
輸出：6
解釋：陣列中的每組數字都是好數對
```

**範例 3**

```
輸入：nums = [1,2,3]
輸出：0
```

**限制**

* `1 <= nums.length <= 100`
* `1 <= nums[i] <= 100`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/number-of-good-pairs/solutions/2974653/mei-ju-you-wei-hu-zuo-pythonjavaccgojsru-7u5v/)。圖解與步驟說明為自行補充。

### 前置知識：枚舉右，維護左

題目要數「兩個位置」的組合 `(i, j)`，直接枚舉兩個位置要 O(n²)。常見的化簡方式是**只枚舉其中一個位置，另一個位置用資料結構一次問出來**：

* 把 `j` 當成「右邊那個數」，從左到右枚舉。
* 枚舉到 `j` 時，左邊（也就是 `i < j` 的所有位置）已經看過了，我們把左邊的資訊記在一個**計數表**裡。
* 計數表回答「左邊有幾個數等於 `nums[j]`」，這個數量就是以 `j` 為右端點的好數對個數。

這個套路叫「枚舉右，維護左」。要維護的資訊是「每個值出現過幾次」，用陣列或哈希表都可以。

### 思路

#### 先看暴力

雙重迴圈，枚舉 `j`，再往左數有幾個 `nums[i] == nums[j]`：

```java
int ans = 0;
for (int j = 0; j < nums.length; j++) {
    for (int i = 0; i < j; i++) {
        if (nums[i] == nums[j]) ans++;
    }
}
```

時間 O(n²)。這題 n ≤ 100 所以能過，但「往左數有幾個」這件事其實每次都在重複計算。

#### 優化：邊走邊記

以 `nums = [1, 1, 2, 1]` 為例：

1. 走到 `nums[0] = 1`：左邊沒有數字，貢獻 0。
2. 走到 `nums[1] = 1`：左邊有 1 個 1，找到好數對 `(0, 1)`，貢獻 1。
3. 走到 `nums[2] = 2`：左邊沒有 2，貢獻 0。
4. 走到 `nums[3] = 1`：左邊有 2 個 1，找到 `(0, 3)` 和 `(1, 3)`，貢獻 2。

答案是 0 + 1 + 0 + 2 = 3。

一般地，走到元素 `x` 時，**把答案加上「之前遍歷過的 x 的個數」**，然後把 `x` 的個數加一。

演算法：

1. 準備一個計數表 `cnt`，記錄每個值之前出現過幾次，一開始全是 0。
2. 從左到右遍歷 `nums`，設目前的數是 `x`（也就是 `nums[j]`）。
3. 先 `ans += cnt[x]`。
4. 再把 `cnt[x]` 加一。
5. 遍歷結束，`ans` 就是答案。

**步驟 3 和 4 的順序不能換**，原因放在文末「答疑」，圖解裡也可以用切換按鈕親自試。

### 方法一：陣列計數

#### 思路

限制說 `1 <= nums[i] <= 100`，值域很小，直接開一個長度 101 的 `int` 陣列，`cnt[x]` 就是「之前遍歷過的 x 的個數」，下標就是值本身，不需要任何轉換。

#### 圖解（可互動）

用範例 1 `nums = [1,2,3,1,1,3]`。每個 `j` 會走兩步：先 `ans += cnt[x]`（綠色格是左邊跟 x 相同的數，就是新找到的好數對的 `i`），再 `cnt[x]++`。按上方的按鈕可以切到「錯誤順序」，看看先計數會多算什麼。

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
<div class="kb"><span>執行順序：</span><button type="button" data-o="ok">先 ans += 再計數（正確）</button><button type="button" data-o="bad">先計數再 ans +=（錯誤）</button></div>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">nums = [1,2,3,1,1,3]</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lab cap"></div>
<div class="cn"></div>
<div class="stats">
  <div class="m"><span>x = nums[j]</span><b class="vx">—</b></div>
  <div class="m"><span class="cl">之前出現過幾次</span><b class="vc">—</b></div>
  <div class="m"><span>ans（好數對）</span><b class="va">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  /* ARR 為 nums；MODE：array 代表 int[] cnt，map 代表 HashMap */
  var root=document.getElementById('swv-a');
  var A=[1,2,3,1,1,3],MODE='array',n=A.length,ord='ok',st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  var keys=[];A.forEach(function(v){if(keys.indexOf(v)<0)keys.push(v)});keys.sort(function(a,b){return a-b});
  var CN=MODE==='map'?'cnt.get':'cnt';
  function cp(o){var r={};for(var k in o)r[k]=o[k];return r}
  function build(){
    var cnt={},ans=0,j,x,i,pr;
    steps=[{k:'init',cnt:{},ans:0}];
    for(j=0;j<n;j++){
      x=A[j];pr=[];
      for(i=0;i<j;i++)if(A[i]===x)pr.push(i);
      var c0=cnt[x]||0,ph=ord==='ok'?['add','inc']:['inc','add'];
      for(var p=0;p<2;p++){
        var s={k:ph[p],j:j,x:x,pr:pr};
        if(ph[p]==='inc'){s.before=cnt[x]||0;cnt[x]=(cnt[x]||0)+1;s.c=cnt[x]}
        else{s.c=cnt[x]||0;s.absent=(cnt[x]===undefined);ans+=s.c}
        s.cnt=cp(cnt);s.ans=ans;steps.push(s);
      }
    }
    steps.push({k:'done',cnt:cp(cnt),ans:ans});
  }
  function draw(){
    var L=steps[st],a='',b='',c='',i;
    for(i=0;i<n;i++){
      var cl='c';
      if(L.j!==undefined){
        if(i===L.j)cl+=' cur';
        else if(i<L.j){cl+=(L.k==='add'&&L.pr.indexOf(i)>=0)?' hit':' seen'}
        else cl+=' nx';
      }
      a+='<div class="tg">'+(L.j===i?'j':'')+'</div>';
      b+='<div class="'+cl+'">'+A[i]+'</div>';
      c+='<div class="ix">'+i+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    var h='',k,v;
    if(MODE==='array'){
      q('.cap').textContent='cnt 陣列（只畫出用到的下標，其餘都是 0）';
      for(i=0;i<keys.length;i++){
        k=keys[i];v=L.cnt[k]||0;
        h+='<div class="e'+(L.x===k?(L.k==='inc'?' up':' on'):'')+'">cnt['+k+']<b>'+v+'</b></div>';
      }
    }else{
      q('.cap').textContent='HashMap cnt（只存出現過的 key）';
      var any=false;
      for(i=0;i<keys.length;i++){
        k=keys[i];if(L.cnt[k]===undefined)continue;any=true;
        h+='<div class="e'+(L.x===k?(L.k==='inc'?' up':' on'):'')+'">'+k+' → <b>'+L.cnt[k]+'</b></div>';
      }
      if(!any)h='<div class="none">（空的 Map）</div>';
    }
    q('.cn').innerHTML=h;
    q('.vx').textContent=L.x===undefined?'—':L.x;
    q('.vc').textContent=L.c===undefined?'—':L.c;
    q('.va').textContent=L.ans;
    q('.cl').textContent=MODE==='map'?'c（getOrDefault 的結果）':'cnt[x]';
    q('.stp').textContent=(st+1)+' / '+steps.length;
    var t='',pairs,pc;
    if(L.k==='init'){
      t='<div>一開始 '+(MODE==='map'?'Map 是空的':'cnt 全是 0')+'，ans = 0。從左到右，把每個數當成 j（右邊那個），統計它左邊有幾個一樣的數。</div>';
    }else if(L.k==='add'){
      pairs=L.pr.map(function(i){return '('+i+', '+L.j+')'});
      if(ord==='bad')pairs.push('<span style="color:var(--sw-bad)">('+L.j+', '+L.j+')</span>');
      if(MODE==='map'){
        t='<div>j = '+L.j+'，x = '+L.x+'：'+(L.absent?'Map 裡沒有 '+L.x+'，getOrDefault 回傳 0':'c = getOrDefault('+L.x+', 0) = '+L.c)+'，所以 <b>ans += '+L.c+'</b></div>';
      }else{
        t='<div>j = '+L.j+'，x = '+L.x+'：cnt['+L.x+'] = '+L.c+'，所以 <b>ans += '+L.c+'</b></div>';
      }
      t+='<div>'+(pairs.length?'新增的好數對：'+pairs.join('、'):'左邊沒有 '+L.x+'，沒有新的好數對')+'</div>';
      if(ord==='bad')t+='<div style="color:var(--sw-bad)">因為已經先計數，nums['+L.j+'] 自己也被算進去，多出一對 ('+L.j+', '+L.j+')，但題目要求 i &lt; j。</div>';
      t+='<div style="color:var(--sw-fg2)">目前 ans = '+L.ans+'</div>';
    }else if(L.k==='inc'){
      t=MODE==='map'
        ?'<div>cnt.put('+L.x+', '+L.c+')：'+L.x+' 的出現次數從 '+L.before+' 變成 '+L.c+'</div>'
        :'<div>cnt['+L.x+']++：'+L.x+' 的出現次數從 '+L.before+' 變成 '+L.c+'</div>';
    }else{
      t='<div>遍歷結束，答案 = <b>'+L.ans+'</b>'+(ord==='bad'?'<span style="color:var(--sw-bad)">（偏大，正確答案是 '+okAns()+'）</span>':'')+'</div>';
    }
    q('.info').innerHTML=t;
    var kb=root.querySelectorAll('.kb button');
    for(i=0;i<kb.length;i++)kb[i].className=(kb[i].getAttribute('data-o')===ord)?'on':'';
  }
  function okAns(){var cnt={},s=0;A.forEach(function(x){s+=cnt[x]||0;cnt[x]=(cnt[x]||0)+1});return s}
  root.addEventListener('click',function(e){
    var o=e.target.getAttribute&&e.target.getAttribute('data-o');
    if(o){ord=o;st=0;build();draw();return}
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

#### 解法（灵茶山艾府）

```java
class Solution {
    public int numIdenticalPairs(int[] nums) {
        int ans = 0;
        int[] cnt = new int[101];
        for (int x : nums) { // x = nums[j]
            // 此時 cnt[x] 表示之前遍歷過的 x 的個數，加到 ans 中
            // 如果先執行 cnt[x]++，再執行 ans += cnt[x]，就把 i=j 這種情況也統計進來了，算出的答案會偏大
            ans += cnt[x];
            cnt[x]++;
        }
        return ans;
    }
}
```

#### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `nums` 的長度。每個元素只處理一次。
* 空間複雜度：題解寫 O(n)。更精確地說，陣列大小只跟值域有關，這題固定 101，所以是 O(U)（U 為值域大小，這裡是常數）。

### 方法二：哈希表計數

#### 思路

如果值域很大（例如 `nums[i]` 到 10⁹），開不了那麼大的陣列，就改用哈希表 `Map<Integer, Integer>`，**只記錄出現過的值**。

和陣列版唯一的差別是「讀」與「寫」的寫法：

* 讀：`cnt.getOrDefault(x, 0)`，沒出現過的值當作 0 次。
* 寫：`cnt.put(x, c + 1)`。

這裡先把 `c = getOrDefault(x, 0)` 存起來，用一次拿到的 `c` 同時完成「加到答案」與「更新次數」，不用查兩次表。

#### 圖解（可互動）

同樣的範例，注意右邊的 Map 一開始是空的，值第一次出現時才會新增一筆（例如 `j = 0` 時還沒有 `1`，`getOrDefault` 回傳 0）。

{% raw %}
<div class="swv" id="swv-b" style="--sw-n:6">
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
<div class="kb"><span>執行順序：</span><button type="button" data-o="ok">先 ans += 再計數（正確）</button><button type="button" data-o="bad">先計數再 ans +=（錯誤）</button></div>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">nums = [1,2,3,1,1,3]</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lab cap"></div>
<div class="cn"></div>
<div class="stats">
  <div class="m"><span>x = nums[j]</span><b class="vx">—</b></div>
  <div class="m"><span class="cl">之前出現過幾次</span><b class="vc">—</b></div>
  <div class="m"><span>ans（好數對）</span><b class="va">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  /* ARR 為 nums；MODE：array 代表 int[] cnt，map 代表 HashMap */
  var root=document.getElementById('swv-b');
  var A=[1,2,3,1,1,3],MODE='map',n=A.length,ord='ok',st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  var keys=[];A.forEach(function(v){if(keys.indexOf(v)<0)keys.push(v)});keys.sort(function(a,b){return a-b});
  var CN=MODE==='map'?'cnt.get':'cnt';
  function cp(o){var r={};for(var k in o)r[k]=o[k];return r}
  function build(){
    var cnt={},ans=0,j,x,i,pr;
    steps=[{k:'init',cnt:{},ans:0}];
    for(j=0;j<n;j++){
      x=A[j];pr=[];
      for(i=0;i<j;i++)if(A[i]===x)pr.push(i);
      var c0=cnt[x]||0,ph=ord==='ok'?['add','inc']:['inc','add'];
      for(var p=0;p<2;p++){
        var s={k:ph[p],j:j,x:x,pr:pr};
        if(ph[p]==='inc'){s.before=cnt[x]||0;cnt[x]=(cnt[x]||0)+1;s.c=cnt[x]}
        else{s.c=cnt[x]||0;s.absent=(cnt[x]===undefined);ans+=s.c}
        s.cnt=cp(cnt);s.ans=ans;steps.push(s);
      }
    }
    steps.push({k:'done',cnt:cp(cnt),ans:ans});
  }
  function draw(){
    var L=steps[st],a='',b='',c='',i;
    for(i=0;i<n;i++){
      var cl='c';
      if(L.j!==undefined){
        if(i===L.j)cl+=' cur';
        else if(i<L.j){cl+=(L.k==='add'&&L.pr.indexOf(i)>=0)?' hit':' seen'}
        else cl+=' nx';
      }
      a+='<div class="tg">'+(L.j===i?'j':'')+'</div>';
      b+='<div class="'+cl+'">'+A[i]+'</div>';
      c+='<div class="ix">'+i+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    var h='',k,v;
    if(MODE==='array'){
      q('.cap').textContent='cnt 陣列（只畫出用到的下標，其餘都是 0）';
      for(i=0;i<keys.length;i++){
        k=keys[i];v=L.cnt[k]||0;
        h+='<div class="e'+(L.x===k?(L.k==='inc'?' up':' on'):'')+'">cnt['+k+']<b>'+v+'</b></div>';
      }
    }else{
      q('.cap').textContent='HashMap cnt（只存出現過的 key）';
      var any=false;
      for(i=0;i<keys.length;i++){
        k=keys[i];if(L.cnt[k]===undefined)continue;any=true;
        h+='<div class="e'+(L.x===k?(L.k==='inc'?' up':' on'):'')+'">'+k+' → <b>'+L.cnt[k]+'</b></div>';
      }
      if(!any)h='<div class="none">（空的 Map）</div>';
    }
    q('.cn').innerHTML=h;
    q('.vx').textContent=L.x===undefined?'—':L.x;
    q('.vc').textContent=L.c===undefined?'—':L.c;
    q('.va').textContent=L.ans;
    q('.cl').textContent=MODE==='map'?'c（getOrDefault 的結果）':'cnt[x]';
    q('.stp').textContent=(st+1)+' / '+steps.length;
    var t='',pairs,pc;
    if(L.k==='init'){
      t='<div>一開始 '+(MODE==='map'?'Map 是空的':'cnt 全是 0')+'，ans = 0。從左到右，把每個數當成 j（右邊那個），統計它左邊有幾個一樣的數。</div>';
    }else if(L.k==='add'){
      pairs=L.pr.map(function(i){return '('+i+', '+L.j+')'});
      if(ord==='bad')pairs.push('<span style="color:var(--sw-bad)">('+L.j+', '+L.j+')</span>');
      if(MODE==='map'){
        t='<div>j = '+L.j+'，x = '+L.x+'：'+(L.absent?'Map 裡沒有 '+L.x+'，getOrDefault 回傳 0':'c = getOrDefault('+L.x+', 0) = '+L.c)+'，所以 <b>ans += '+L.c+'</b></div>';
      }else{
        t='<div>j = '+L.j+'，x = '+L.x+'：cnt['+L.x+'] = '+L.c+'，所以 <b>ans += '+L.c+'</b></div>';
      }
      t+='<div>'+(pairs.length?'新增的好數對：'+pairs.join('、'):'左邊沒有 '+L.x+'，沒有新的好數對')+'</div>';
      if(ord==='bad')t+='<div style="color:var(--sw-bad)">因為已經先計數，nums['+L.j+'] 自己也被算進去，多出一對 ('+L.j+', '+L.j+')，但題目要求 i &lt; j。</div>';
      t+='<div style="color:var(--sw-fg2)">目前 ans = '+L.ans+'</div>';
    }else if(L.k==='inc'){
      t=MODE==='map'
        ?'<div>cnt.put('+L.x+', '+L.c+')：'+L.x+' 的出現次數從 '+L.before+' 變成 '+L.c+'</div>'
        :'<div>cnt['+L.x+']++：'+L.x+' 的出現次數從 '+L.before+' 變成 '+L.c+'</div>';
    }else{
      t='<div>遍歷結束，答案 = <b>'+L.ans+'</b>'+(ord==='bad'?'<span style="color:var(--sw-bad)">（偏大，正確答案是 '+okAns()+'）</span>':'')+'</div>';
    }
    q('.info').innerHTML=t;
    var kb=root.querySelectorAll('.kb button');
    for(i=0;i<kb.length;i++)kb[i].className=(kb[i].getAttribute('data-o')===ord)?'on':'';
  }
  function okAns(){var cnt={},s=0;A.forEach(function(x){s+=cnt[x]||0;cnt[x]=(cnt[x]||0)+1});return s}
  root.addEventListener('click',function(e){
    var o=e.target.getAttribute&&e.target.getAttribute('data-o');
    if(o){ord=o;st=0;build();draw();return}
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

#### 解法（灵茶山艾府）

```java
class Solution {
    public int numIdenticalPairs(int[] nums) {
        int ans = 0;
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) {
            int c = cnt.getOrDefault(x, 0);
            ans += c;
            cnt.put(x, c + 1);
        }
        return ans;
    }
}
```

#### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `nums` 的長度。哈希表讀寫平均 O(1)。
* 空間複雜度：O(n)，最壞情況所有數都不同，Map 要存 n 筆。

### 答疑

**問：為什麼代碼要先更新答案，再更新 `cnt`？**

答：題目要求 `i < j`。如果先更新 `cnt`，再更新答案，就會把 `nums[j]` 自己也統計進來，相當於把 `i = j` 的情況也當成好數對，答案會偏大。以範例 1 為例，先計數的錯誤版本會算出 10，而正確答案是 4。（措辭為自行改寫）

### 相似題目

題解提到，更多相似題目可以看作者整理的資料結構題單中的「§0.1 枚舉右，維護左」。題單沒有給網址，這裡不放連結。
