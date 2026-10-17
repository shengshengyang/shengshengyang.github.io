---
title: LeetCode 2379. 得到 K 個黑塊的最少塗色次數（滑動視窗圖解）
date: 2026-10-17 10:00:00
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

## 2379. 得到 K 個黑塊的最少塗色次數

### 題目描述

給你一個長度為 `n`、下標從 0 開始的字串 `blocks`，`blocks[i]` 要么是 `'W'`，要么是 `'B'`，表示第 `i` 塊的顏色：`'W'` 為白色，`'B'` 為黑色。

再給你一個整數 `k`，表示想要**連續**黑色塊的數目。

每一次操作，你可以選擇一個白色塊把它塗成黑色。請回傳至少出現一次連續 `k` 個黑色塊的**最少**操作次數。

**範例 1**

```
輸入：blocks = "WBBWWBBWBW", k = 7
輸出：3
解釋：把第 0、3、4 個塊塗成黑色，得到 "BBBBBBBWBW"，
可以證明無法用少於 3 次操作得到 7 個連續黑塊。
```

**範例 2**

```
輸入：blocks = "WBWBBBW", k = 2
輸出：0
解釋：已經有 2 個連續黑塊，不需要任何操作。
```

**限制**

* `n == blocks.length`
* `1 <= n <= 100`
* `blocks[i]` 為 `'W'` 或 `'B'`
* `1 <= k <= n`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[影片講解](https://www.bilibili.com/video/BV1Kd4y1Z7Fv)。圖解為自行補充。

### 前置知識：滑動視窗

視窗指的是陣列／字串中由起訖索引定義的一段連續元素，即閉區間 `[i, j]`。把視窗向右滑動 1 格，就變成 `[i+1, j+1]`：視窗**少了**元素 `i`，**多了**元素 `j+1`。

### 思路

最後要的是「連續 k 格全黑」，而每次操作只能把一個 `W` 變成 `B`，所以：

> 任選一段長度為 k 的區間，把裡面的 `W` 全部塗黑，成本就是這段區間內 `W` 的數量。

因此問題變成：**長度固定為 k 的滑動視窗，求視窗內 `W` 數量的最小值。**

1. 初始化：數出前 k 格內 `W` 的個數，記為 `cntW`，同時令 `ans = cntW`。
2. 視窗向右滑動一格：新進入的格子是 `W` 則 `cntW + 1`；剛離開的格子是 `W` 則 `cntW - 1`。
3. 每次滑動後 `ans = min(ans, cntW)`。
4. 視窗到達最右邊時，`ans` 就是答案。

### 圖解（可互動）

用範例 1 `blocks = "WBBWWBBWBW"`、`k = 7` 一步一步看視窗怎麼滑動。按「下一步」往右滑，觀察 `cntW`（視窗內 W 數量）與 `ans`（目前最小值）怎麼變化。

{% raw %}
<div class="swv" id="swv-1">
<style>
.swv{--sw-fg:#1f2328;--sw-fg2:#59636e;--sw-fg3:#818b98;--sw-bg:#ffffff;--sw-card:#f6f8fa;--sw-line:#afb8c1;--sw-accent:#0969da;--sw-ok:#1a7f37;--sw-bad:#cf222e;margin:1.2em 0}
[data-user-color-scheme="dark"] .swv{--sw-fg:#e6edf3;--sw-fg2:#9da7b3;--sw-fg3:#7d8590;--sw-bg:#0d1117;--sw-card:#161b22;--sw-line:#4b535d;--sw-accent:#58a6ff;--sw-ok:#3fb950;--sw-bad:#f85149}
.swv .row{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px;margin:0 0 6px}
.swv .lab{font-size:13px;color:var(--sw-fg2);margin:14px 0 4px}
.swv .ix{font-size:11px;text-align:center;height:16px;color:var(--sw-fg3)}
.swv .c{border:1.5px solid transparent;border-radius:8px;text-align:center;padding:10px 0;font-size:16px;font-weight:500}
.swv .B{background:var(--sw-fg);color:var(--sw-bg)}
.swv .W{background:var(--sw-card);color:var(--sw-fg);border-color:var(--sw-line)}
.swv .in{border-color:var(--sw-accent)!important;box-shadow:0 0 0 1.5px var(--sw-accent)}
.swv .win{border-color:var(--sw-accent)}
.swv .dim{opacity:.35}
.swv .tagi{color:var(--sw-ok);font-weight:500}
.swv .tago{color:var(--sw-bad);font-weight:500}
.swv .stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}
.swv .m{background:var(--sw-card);border-radius:8px;padding:12px 14px}
.swv .m span{font-size:13px;color:var(--sw-fg2);display:block}
.swv .m b{font-size:24px;font-weight:500}
.swv .info{background:var(--sw-card);border-radius:8px;padding:12px 14px;font-size:14px;line-height:1.8;margin-top:12px}
.swv .ctl{display:flex;align-items:center;gap:10px}
.swv .ctl button{background:var(--sw-card);color:var(--sw-fg);border:1px solid var(--sw-line);border-radius:8px;padding:4px 12px;cursor:pointer;font-size:14px}
.swv .ctl button:hover{border-color:var(--sw-accent)}
.swv .lg{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--sw-fg2);margin-top:10px}
.swv .lg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px}
</style>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">blocks = "WBBWWBBWBW"，k = 7</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="background:var(--sw-fg)"></i>B（算 0）</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line)"></i>W（算 1）</span>
  <span><i style="border:1.5px solid var(--sw-accent)"></i>視窗內</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 剛離開</span>
</div>
<div class="stats">
  <div class="m"><span>視窗內 W 數量 cntW</span><b class="cnt">0</b></div>
  <div class="m"><span>目前最小值 ans</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-1');
  var s="WBBWWBBWBW",k=7,n=s.length,steps=n-k+1,st=0;
  var v=function(c){return c==='W'?1:0};
  var q=function(c){return root.querySelector(c)};
  function calc(t){
    var cnt=0,i;
    for(i=0;i<k;i++)cnt+=v(s[i]);
    var ans=cnt,log={init:true,cnt:cnt,ans:ans,lo:0,hi:k-1};
    for(i=k;i<k+t;i++){
      var add=v(s[i]),rem=v(s[i-k]);
      cnt+=add-rem;
      var prev=ans;
      ans=Math.min(ans,cnt);
      log={init:false,cnt:cnt,ans:ans,prev:prev,add:add,rem:rem,i:i,lo:i-k+1,hi:i};
    }
    return log;
  }
  function draw(){
    var L=calc(st),a='',b='',c='';
    for(var j=0;j<n;j++){
      var tg='';
      if(!L.init&&j===L.i)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.i-k)tg='<span class="tago">出</span>';
      a+='<div class="ix">'+tg+'</div>';
      var cl='c '+s[j]+(j>=L.lo&&j<=L.hi?' win':' dim');
      if(!L.init&&j===L.i)cl+=' in';
      b+='<div class="'+cl+'">'+s[j]+'</div>';
      c+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=a;
    q('.r-cells').innerHTML=b;
    q('.r-ix').innerHTML=c;
    q('.cnt').textContent=L.cnt;
    q('.ans').textContent=L.ans;
    q('.stp').textContent='視窗 ['+L.lo+', '+L.hi+']（'+(st+1)+' / '+steps+'）';
    var t='';
    if(L.init){
      t='<div>初始化：數前 k = '+k+' 格（index 0~'+(k-1)+'）裡有幾個 W → cntW = <b>'+L.cnt+'</b></div><div>ans = cntW = '+L.ans+'</div>';
    }else{
      t='<div>入：s['+L.i+'] = '+s[L.i]+'，加 '+L.add+'</div>';
      t+='<div>出：s['+(L.i-k)+'] = '+s[L.i-k]+'，減 '+L.rem+'</div>';
      t+='<div>cntW 變成 <b>'+L.cnt+'</b>（變化 '+(L.add-L.rem>=0?'+':'')+(L.add-L.rem)+'）；ans = min('+L.prev+', '+L.cnt+') = <b>'+L.ans+'</b></div>';
    }
    if(st===steps-1)t+='<div style="color:var(--sw-fg2)">視窗已到最右邊，答案 = '+L.ans+'</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var a=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!a)return;
    if(a==='prev')st=Math.max(0,st-1);
    else if(a==='next')st=Math.min(steps-1,st+1);
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
    public int minimumRecolors(String blocks, int k) {
        char[] s = blocks.toCharArray();
        int cntW = 0;
        // 先數出前 k 格內 W 的數量，作為初始視窗
        for (int i = 0; i < k; i++) {
            cntW += s[i] & 1;
        }
        int ans = cntW;
        // 視窗右移：右端進來一格，左端離開一格
        for (int i = k; i < s.length; i++) {
            cntW += (s[i] & 1) - (s[i - k] & 1);
            ans = Math.min(ans, cntW);
        }
        return ans;
    }
}
```

### 小技巧：`s[i] & 1`

`'W'` 的 ASCII 是 87（二進位最低位為 1），`'B'` 是 66（最低位為 0），所以 `s[i] & 1` 剛好把 `W` 當成 1、`B` 當成 0，不必寫 `if-else`。

字元 `W`、`B` 可視為隨機出現，用 `if-else` 會讓 CPU 的分支預測有約 50% 失敗率，回滾指令要多花 CPU 週期；改成位元運算可以去掉分支。不過這種寫法會降低可讀性，本題資料範圍小看不出差別，業務程式碼中建議還是寫清楚的版本。

### 複雜度分析

* 時間複雜度：O(n)，其中 n 為 `blocks` 的長度，每個字元最多進出視窗各一次。
* 空間複雜度：O(1)，只用到幾個額外變數（`toCharArray` 的陣列不計入的話）。
