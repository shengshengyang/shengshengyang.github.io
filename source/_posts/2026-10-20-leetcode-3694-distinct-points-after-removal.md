---
title: LeetCode 3694. 刪除子字串後不同的終點（定長滑動視窗圖解）
date: 2026-10-20 12:00:00
tags:
- [LeetCode]
- [algorithm]
- [sliding window]
- [hash table]
- [java]
category:
- [LeetCode]
index_img: ../image/banner/leetcode_index.jpeg
banner_img: ../image/banner/LeetCode_banner.jpeg
---

## 3694. 刪除子字串後不同的終點

### 題目描述

給你一個由字元 `'U'`、`'D'`、`'L'` 和 `'R'` 組成的字串 `s`，表示在無限的二維笛卡爾網格上的移動。

* `'U'`：從 `(x, y)` 移動到 `(x, y + 1)`。
* `'D'`：從 `(x, y)` 移動到 `(x, y - 1)`。
* `'L'`：從 `(x, y)` 移動到 `(x - 1, y)`。
* `'R'`：從 `(x, y)` 移動到 `(x + 1, y)`。

你還得到了一個正整數 `k`。

你**必須**選擇並移除**恰好一個**長度為 `k` 的連續子字串 `s`。然後，從座標 `(0, 0)` 開始，按順序執行剩餘的移動。

回傳可到達的**不同**最終座標的數量。

**範例 1**

```
輸入：s = "LUL", k = 1
輸出：2
解釋：移除長度為 1 的子字串後，s 可以是 "UL"、"LL" 或 "LU"。
執行這些移動後，最終座標將分別是 (-1, 1)、(-2, 0) 和 (-1, 1)。
有兩個不同的點 (-1, 1) 和 (-2, 0)，因此答案是 2。
```

**範例 2**

```
輸入：s = "UDLR", k = 4
輸出：1
解釋：移除長度為 4 的子字串後，s 只能是空字串，最終座標是 (0, 0)，只有一個不同的點。
```

**範例 3**

```
輸入：s = "UU", k = 1
輸出：1
解釋：移除長度為 1 的子字串後，s 變為 "U"，它總是以 (0, 1) 結束，因此只有一個不同的最終座標。
```

**限制**

* `1 <= s.length <= 10^5`
* `s` 只包含 `'U'`、`'D'`、`'L'` 和 `'R'`。
* `1 <= k <= s.length`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/distinct-points-reachable-after-substring-removal/solutions/3793905/deng-jie-zhuan-huan-ding-chang-hua-dong-3b67r/)。圖解與步驟說明為自行補充。

### 前置知識：定長滑動視窗

定長視窗每次右移一格，少一個最左元素、多一個新元素，所以視窗內的總和可以用「加新的、減舊的」在 O(1) 內更新。這題的「和」不是一個數字，而是一個二維位移 `(x, y)`，做法一樣。前面幾篇已經用過，例如 [2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/) 和 [3439](/2026/10/20/leetcode-3439-reschedule-meetings-max-free-time-i/)。

### 思路：終點的差別，只取決於被刪掉的那段位移

#### 第一步：刪掉一段，相當於終點減去這段的位移

設**不移除任何子字串**時，最終座標是 `(x, y)`。

如果我們刪掉了子字串 `"UR"`，就是少走了一次「`y` 加一」和一次「`x` 加一」，所以最終座標是 `(x − 1, y − 1)`。

換個角度，**站在最終座標的位置看**，刪掉子字串後的偏移量是 `(−1, −1)`。

這個關係對每一種移除方式都成立：

> 最終座標 = 不刪除時的終點 `(x, y)` − 被刪掉那段的位移

#### 第二步：不同終點 = 不同位移

`(x, y)` 是固定的，所以兩種移除方式的最終座標相不相同，完全取決於**被刪掉那段的位移相不相同**。問題因此變成：

> 對 `s` 中所有長為 `k` 的子字串，算出它們的位移 `(dx, dy)`，數有多少個**不同**的位移。

下面用 `s = "UDRUR"`、`k = 2` 實際走一遍。紅框是被移除的子字串，格子是座標平面（`O` 是起點），藍色圓點是這種移除方式的終點，綠色圈圈是之前已經出現過的終點，虛線框是不移除任何東西時的終點 `(2, 1)`。按「下一步」，注意最後兩種移除方式 `"RU"` 和 `"UR"`：順序不同，但位移都是 `(1, 1)`，所以終點相同，只算一個。

{% raw %}
<div class="swv" id="swv-a" style="--sw-n:5">
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
.swv .gr{display:grid;gap:3px;margin:8px 0;max-width:260px}
.swv .gc{aspect-ratio:1/1;border-radius:6px;background:var(--sw-bg);border:1px solid var(--sw-line);display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--sw-fg2)}
.swv .gc.vis{background:var(--sw-card);color:var(--sw-fg)}
.swv .gc.org{border-color:var(--sw-fg);font-weight:600;color:var(--sw-fg)}
.swv .gc.fin{background:var(--sw-accent);border-color:var(--sw-accent);color:#fff;font-weight:600}
.swv .gc.fnd{border-color:var(--sw-ok);color:var(--sw-ok);font-weight:600}
.swv .gc.end{border-style:dashed;border-color:var(--sw-fg2)}
.swv .set{font-size:13px;color:var(--sw-fg2)}
</style>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">s = "UDRUR"，k = 2：依序移除每一個長為 2 的子字串（紅框），看剩下的移動會走到哪裡</div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="gr"></div>
<div class="lg">
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line)"></i>剩餘路徑經過的格子</span>
  <span><i style="background:var(--sw-accent)"></i>這一步的終點</span>
  <span><i style="border:1.5px solid var(--sw-ok)"></i>之前出現過的終點</span>
  <span><i style="border:1.5px dashed var(--sw-fg2)"></i>不移除任何東西的終點</span>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-a');
  var s="UDRUR",k=2,n=s.length;
  var D={U:[0,1],D:[0,-1],L:[-1,0],R:[1,0]};
  function fmt(p){return '('+p[0]+', '+p[1]+')'}

  var st=0,total=n-k+1;
  var q=function(c){return root.querySelector(c)};
  function run(str){
    var x=0,y=0,pts=[[0,0]];
    for(var i=0;i<str.length;i++){x+=D[str[i]][0];y+=D[str[i]][1];pts.push([x,y])}
    return pts;
  }
  var full=run(s),end=full[full.length-1];
  var xmin=-1,xmax=3,ymin=-1,ymax=3; // 固定範圍，切換步驟時格子不跳動
  function draw(){
    var l=st,sub=s.substr(l,k),rest=s.substr(0,l)+s.substr(l+k);
    var pts=run(rest),fin=pts[pts.length-1];
    var off=[0,0],i;
    for(i=0;i<k;i++){off[0]+=D[sub[i]][0];off[1]+=D[sub[i]][1]}
    var found=[],keys={};
    for(var t=0;t<=st;t++){
      var r=s.substr(0,t)+s.substr(t+k),p=run(r),f=p[p.length-1],key=f[0]+','+f[1];
      if(!keys[key]){keys[key]=1;found.push(f)}
    }
    var y='',z='',j;
    for(j=0;j<n;j++){
      y+='<div class="c'+(j>=l&&j<l+k?' dupc':' win')+'">'+s[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
    }
    q('.r-cells').innerHTML=y;q('.r-ix').innerHTML=z;
    var g='',vis={};
    for(i=0;i<pts.length;i++)vis[pts[i][0]+','+pts[i][1]]=1;
    var prevFound={};
    for(i=0;i<found.length;i++)prevFound[found[i][0]+','+found[i][1]]=1;
    for(var yy=ymax;yy>=ymin;yy--)for(var xx=xmin;xx<=xmax;xx++){
      var cl='gc',txt='',kk=xx+','+yy;
      if(vis[kk])cl+=' vis';
      if(xx===end[0]&&yy===end[1])cl+=' end';
      if(prevFound[kk]){cl+=' fnd';txt='◎'}
      if(xx===0&&yy===0){cl+=' org';txt='O'}
      if(xx===fin[0]&&yy===fin[1]){cl+=' fin';txt=txt||'●'}
      g+='<div class="'+cl+'">'+txt+'</div>';
    }
    var grid=q('.gr');
    grid.style.gridTemplateColumns='repeat('+(xmax-xmin+1)+',1fr)';
    grid.innerHTML=g;
    q('.stp').textContent='移除 s['+l+'..'+(l+k-1)+']（'+(st+1)+' / '+total+'）';
    var t='<div>移除子字串 "'+sub+'"，剩下 "'+rest+'"，從 (0, 0) 走完會到 <b>'+fmt(fin)+'</b></div>';
    t+='<div>不移除任何東西的終點是 '+fmt(end)+'；子字串 "'+sub+'" 的位移是 '+fmt(off)+'，所以終點 = '+fmt(end)+' − '+fmt(off)+' = <b>'+fmt([end[0]-off[0],end[1]-off[1]])+'</b></div>';
    var fs=[];for(i=0;i<found.length;i++)fs.push(fmt(found[i]));
    t+='<div>到目前為止不同的終點：'+fs.join('、')+'（共 <b>'+found.length+'</b> 個）</div>';
    if(st===total-1)t+='<div style="color:var(--sw-fg2)">全部移除方式都試過，答案 = '+found.length+'</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(total-1,st+1);
    else st=0;
    draw();
  });
  draw();
})();
</script>
</div>
{% endraw %}

#### 第三步：用定長滑動視窗算所有長為 k 的子字串位移

「所有長為 `k` 的子字串的位移」就是標準的定長滑動視窗：

1. 入：`s[i]` 進入視窗，位移加上 `s[i]` 的方向。
2. 若視窗還沒滿（長度不足 `k`），繼續。
3. 更新：把目前的位移 `(x, y)` 放進雜湊集合。
4. 出：`s[i − k + 1]` 離開視窗，位移減去它的方向，為下一個視窗做準備。

最後集合的大小就是答案。因為 `(x, y)` 是一對整數，Java 可以把它壓成一個 `long` 當作集合的元素，例如 `(long) (x + n) << 20 | (y + n)`（`+ n` 避免負數）。

兩種寫法的差別只在於要不要「真的算出第一個視窗的位移」：

* 優化前：照模板算每一個視窗的位移。
* 優化後：因為終點只和位移的**差**有關，所以只算「後續視窗相對第一個視窗的增減量」，第一個視窗直接當 `(0, 0)`。

### 方法一：優化前（直接算每個視窗的位移）

#### 思路

1. 方向表 `DIRS`：`L → (−1, 0)`、`R → (1, 0)`、`D → (0, −1)`、`U → (0, 1)`。
2. `i` 往右走，`s[i]` 進入視窗：`x += DIRS[c][0]`、`y += DIRS[c][1]`。
3. 若視窗還沒滿（`left = i + 1 − k < 0`），繼續。
4. 把目前的位移放進集合 `set`。
5. `s[left]` 離開視窗：`x`、`y` 各自減去它的方向。

#### 圖解（可互動）

用 `s = "UDRUR"`、`k = 2`。視窗位移依序是 `"UD" → (0, 0)`、`"DR" → (1, −1)`、`"RU" → (1, 1)`、`"UR" → (1, 1)`，最後一個重複，集合大小是 3。

{% raw %}
<div class="swv" id="swv-b" style="--sw-n:5">
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">s = "UDRUR"，k = 2：視窗內移動的位移 (x, y)，放進集合</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>視窗位移 (x, y)</span><b class="xy">(0, 0)</b></div>
  <div class="m"><span>集合大小 set.size()</span><b class="sz">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-b');
  var s="UDRUR",k=2,n=s.length;
  var D={U:[0,1],D:[0,-1],L:[-1,0],R:[1,0]};
  function fmt(p){return '('+p[0]+', '+p[1]+')'}

  var st=0,steps=[],total;
  var q=function(c){return root.querySelector(c)};
  (function(){
    var x=0,y=0,set={},size=0,i,keys=[];
    for(i=0;i<k-1;i++){x+=D[s[i]][0];y+=D[s[i]][1]}
    steps.push({init:true,x:x,y:y,size:0,keys:[],lo:0,hi:k-2});
    for(i=k-1;i<n;i++){
      var l=i+1-k,add=D[s[i]];
      x+=add[0];y+=add[1];
      var key=x+','+y,dup=!!set[key];
      if(!dup){set[key]=1;size++;keys.push('('+x+', '+y+')')}
      var snap={init:false,i:i,l:l,x:x,y:y,dup:dup,size:size,keys:keys.slice(),lo:l,hi:i,add:s[i],out:s[l]};
      steps.push(snap);
      x-=D[s[l]][0];y-=D[s[l]][1];
    }
  })();
  total=steps.length;
  function draw(){
    var L=steps[st],a='',b='',c='',j;
    for(j=0;j<n;j++){
      var tg='';
      if(!L.init&&j===L.i)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.l)tg='<span class="tago">出</span>';
      a+='<div class="ix">'+tg+'</div>';
      b+='<div class="c'+(j>=L.lo&&j<=L.hi?' win':' dim')+(!L.init&&j===L.i?' in':'')+'">'+s[j]+'</div>';
      c+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    q('.xy').textContent='('+L.x+', '+L.y+')';
    q('.sz').textContent=L.size;
    q('.stp').textContent=(st+1)+' / '+total;
    var t='';
    if(L.init){
      t='<div>初始化：視窗還沒滿（要 k = '+k+' 個），先把前 k − 1 = '+(k-1)+' 個字元的位移累加起來：<b>('+L.x+', '+L.y+')</b></div>';
    }else{
      t='<div>入：s['+L.i+'] = "'+L.add+'"，位移加上 ('+D[L.add][0]+', '+D[L.add][1]+')，視窗位移變成 <b>('+L.x+', '+L.y+')</b></div>';
      t+=L.dup?'<div>(x, y) 已經在集合裡，重複，集合大小不變</div>':'<div>(x, y) 是新的位移，加入集合，集合大小 = <b>'+L.size+'</b></div>';
      t+='<div>出：s['+L.l+'] = "'+L.out+'" 離開視窗，位移減去 ('+D[L.out][0]+', '+D[L.out][1]+')（給下一步用）</div>';
    }
    t+='<div class="set">集合 = {'+L.keys.join(', ')+'}</div>';
    if(st===total-1)t+='<div style="color:var(--sw-fg2)">答案 = '+L.size+'</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(total-1,st+1);
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
    private static final int[][] DIRS = new int[128][];

    static {
        DIRS['L'] = new int[]{-1, 0};
        DIRS['R'] = new int[]{1, 0};
        DIRS['D'] = new int[]{0, -1};
        DIRS['U'] = new int[]{0, 1};
    }

    public int distinctPoints(String s, int k) {
        int n = s.length();
        Set<Long> set = new HashSet<>();
        int x = 0, y = 0;
        for (int i = 0; i < n; i++) {
            // 1. 入
            char c = s.charAt(i);
            x += DIRS[c][0];
            y += DIRS[c][1];

            int left = i + 1 - k; // 視窗左端點
            if (left < 0) { // 視窗大小不足 k
                continue;
            }

            // 2. 記錄答案
            // 把兩個 int 壓縮到一個 long 中，+n 避免負數
            set.add((long) (x + n) << 20 | (y + n)); // 測試發現 << 20 比 << 32 快很多

            // 3. 出，為下一個視窗做準備
            char out = s.charAt(left);
            x -= DIRS[out][0];
            y -= DIRS[out][1];
        }
        return set.size();
    }
}
```

#### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `s` 的長度。
* 空間複雜度：O(n − k)。有 `n − k + 1` 個視窗，所以雜湊表中至多保存 `n − k + 1` 個不同座標。

### 方法二：優化（只算相對第一個視窗的增減量）

#### 思路

所有視窗都可以由第一個視窗推出來，所以只需要算**相對第一個視窗**的增減量：

* 增減量不同，位移就不同，最終座標也就不同。
* 因此不需要算第一個視窗的位移，直接把它的增減量記為 `(0, 0)`。
* 後續視窗右移一格時，增減量 `+= 新進入字元的方向 − 離開字元的方向`，把它放進集合。

這樣迴圈從 `i = k` 開始，省掉了初始累加和「視窗還沒滿」的判斷。

#### 圖解（可互動）

同樣用 `s = "UDRUR"`、`k = 2`。注意這裡看到的 `(x, y)` 是**相對第一個視窗的差**，和方法一的位移相差一個固定的量，但「是否重複」的結果完全一樣，集合大小同樣是 3。

{% raw %}
<div class="swv" id="swv-c" style="--sw-n:5">
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">s = "UDRUR"，k = 2：只記錄「相對第一個視窗的增減量」，第一個視窗固定是 (0, 0)</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>相對第一個視窗的增減量 (x, y)</span><b class="xy">(0, 0)</b></div>
  <div class="m"><span>集合大小 set.size()</span><b class="sz">1</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-c');
  var s="UDRUR",k=2,n=s.length;
  var D={U:[0,1],D:[0,-1],L:[-1,0],R:[1,0]};
  function fmt(p){return '('+p[0]+', '+p[1]+')'}

  var st=0,steps=[],total;
  var q=function(c){return root.querySelector(c)};
  (function(){
    var x=0,y=0,set={'0,0':1},size=1,keys=['(0, 0)'];
    steps.push({init:true,x:0,y:0,size:1,keys:keys.slice(),lo:0,hi:k-1});
    for(var i=k;i<n;i++){
      var inn=D[s[i]],out=D[s[i-k]];
      x+=inn[0]-out[0];y+=inn[1]-out[1];
      var key=x+','+y,dup=!!set[key];
      if(!dup){set[key]=1;size++;keys.push('('+x+', '+y+')')}
      steps.push({init:false,i:i,l:i-k+1,x:x,y:y,dup:dup,size:size,keys:keys.slice(),lo:i-k+1,hi:i,add:s[i],out:s[i-k]});
    }
  })();
  total=steps.length;
  function draw(){
    var L=steps[st],a='',b='',c='',j;
    for(j=0;j<n;j++){
      var tg='';
      if(!L.init&&j===L.i)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.l-1)tg='<span class="tago">出</span>';
      a+='<div class="ix">'+tg+'</div>';
      b+='<div class="c'+(j>=L.lo&&j<=L.hi?' win':' dim')+(!L.init&&j===L.i?' in':'')+'">'+s[j]+'</div>';
      c+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    q('.xy').textContent='('+L.x+', '+L.y+')';
    q('.sz').textContent=L.size;
    q('.stp').textContent=(st+1)+' / '+total;
    var t='';
    if(L.init){
      t='<div>第一個視窗 "'+s.substr(0,k)+'" 當作基準，增減量 = <b>(0, 0)</b>，先放進集合，不用真的把它的位移算出來</div>';
    }else{
      t='<div>視窗右移：入 s['+L.i+'] = "'+L.add+'"（+('+D[L.add][0]+', '+D[L.add][1]+')），出 s['+(L.i-k)+'] = "'+L.out+'"（−('+D[L.out][0]+', '+D[L.out][1]+')）</div>';
      t+='<div>增減量變成 <b>('+L.x+', '+L.y+')</b>，'+(L.dup?'已在集合裡，重複，集合大小不變':'是新的，加入集合，集合大小 = <b>'+L.size+'</b>')+'</div>';
    }
    t+='<div class="set">集合 = {'+L.keys.join(', ')+'}</div>';
    if(st===total-1)t+='<div style="color:var(--sw-fg2)">答案 = '+L.size+'</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(total-1,st+1);
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
    private static final int[][] DIRS = new int[128][];

    static {
        DIRS['L'] = new int[]{-1, 0};
        DIRS['R'] = new int[]{1, 0};
        DIRS['D'] = new int[]{0, -1};
        DIRS['U'] = new int[]{0, 1};
    }

    public int distinctPoints(String s, int k) {
        int n = s.length();
        int x = 0, y = 0;
        Set<Long> set = new HashSet<>();
        set.add((long) n << 20 | n); // 第一個視窗
        for (int i = k; i < s.length(); i++) {
            char in = s.charAt(i);
            char out = s.charAt(i - k);
            x += DIRS[in][0] - DIRS[out][0];
            y += DIRS[in][1] - DIRS[out][1];
            set.add((long) (x + n) << 20 | (y + n));
        }
        return set.size();
    }
}
```

這裡 `set.add((long) n << 20 | n)` 就是把 `(0, 0)` 用同樣的壓縮方式（`+ n`）放進集合。

#### 複雜度分析

* 時間複雜度：O(n − k)，其中 n 是 `s` 的長度。
* 空間複雜度：O(n − k)。有 `n − k + 1` 個視窗，所以雜湊表中至多保存 `n − k + 1` 個不同座標。
