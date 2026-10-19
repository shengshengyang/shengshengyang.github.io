---
title: LeetCode 1052. 愛生氣的書店老闆（滑動視窗圖解）
date: 2026-10-19 10:00:00
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

## 1052. 愛生氣的書店老闆

### 題目描述

有一個書店老闆，他的書店開了 `n` 分鐘。每分鐘都有一些顧客進入這家商店。給定一個長度為 `n` 的整數陣列 `customers`，其中 `customers[i]` 是在第 `i` 分鐘開始時進入商店的顧客數量，所有這些顧客在第 `i` 分鐘結束後離開。

在某些分鐘內，書店老闆會生氣。如果書店老闆在第 `i` 分鐘生氣，那麼 `grumpy[i] = 1`，否則 `grumpy[i] = 0`。

當書店老闆生氣時，那一分鐘的顧客就會不滿意；若老闆不生氣，顧客是滿意的。

書店老闆知道一個秘密技巧，能抑制自己的情緒，可以讓自己連續 `minutes` 分鐘不生氣，但只能使用一次。

請回傳這一天營業下來，最多有多少客戶能夠感到滿意。

**範例 1**

```
輸入：customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3
輸出：16
解釋：書店老闆在最後 3 分鐘保持冷靜。
感到滿意的最大客戶數量 = 1 + 1 + 1 + 1 + 7 + 5 = 16。
```

**範例 2**

```
輸入：customers = [1], grumpy = [0], minutes = 1
輸出：1
```

**限制**

* `n == customers.length == grumpy.length`
* `1 <= minutes <= n <= 2 * 10^4`
* `0 <= customers[i] <= 1000`
* `grumpy[i] == 0 or 1`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/grumpy-bookstore-owner/solutions/2751888/ding-chang-hua-dong-chuang-kou-fu-ti-dan-rch7/)。圖解為自行補充。

### 思路

本題可以拆成兩個獨立的問題：

1. 老闆**本來就不生氣**時的顧客數量總和 `s0`。這些顧客不論如何都滿意。
2. 長度為 `minutes` 的連續子陣列中，老闆**生氣**時的顧客數量總和 `s1` 的最大值 `maxS1`。這些顧客因為秘密技巧而「被救回來」。

最終答案為 `s0 + maxS1`。

第二個問題是**定長滑動視窗**：

1. 視窗右端進來一格：若 `grumpy[i] == 1`，`s1 += customers[i]`。
2. 當視窗長度達到 `minutes` 後，`maxS1 = max(maxS1, s1)`。
3. 視窗左端離開一格：若 `grumpy[left] == 1`，`s1 -= customers[left]`。

為什麼要分開算？因為不生氣時的顧客就算落在視窗外面也一樣滿意，必須獨立計算，不能只看視窗內的總和。

### 圖解（可互動）

用範例 1 `customers = [1,0,1,2,1,1,7,5]`、`grumpy = [0,1,0,1,0,1,0,1]`、`minutes = 3` 一步一步看。深色格子代表老闆生氣（會被視窗救回來），淺色格子代表老闆本來就不生氣（已經計入 `s0`）。

{% raw %}
<div class="swv" id="swv-1052" style="--sw-n:8">
<style>
.swv{--sw-fg:#1f2328;--sw-fg2:#59636e;--sw-fg3:#818b98;--sw-bg:#ffffff;--sw-card:#f6f8fa;--sw-line:#afb8c1;--sw-accent:#0969da;--sw-ok:#1a7f37;--sw-bad:#cf222e;margin:1.2em 0}
[data-user-color-scheme="dark"] .swv{--sw-fg:#e6edf3;--sw-fg2:#9da7b3;--sw-fg3:#7d8590;--sw-bg:#0d1117;--sw-card:#161b22;--sw-line:#4b535d;--sw-accent:#58a6ff;--sw-ok:#3fb950;--sw-bad:#f85149}
.swv .row{display:grid;grid-template-columns:repeat(var(--sw-n,10),minmax(0,1fr));gap:6px;margin:0 0 6px}
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
<div class="lab">customers = [1,0,1,2,1,1,7,5]，grumpy = [0,1,0,1,0,1,0,1]，minutes = 3</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="background:var(--sw-fg)"></i>老闆生氣（grumpy = 1，視窗可救）</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line)"></i>老闆不生氣（算進 s0）</span>
  <span><i style="border:1.5px solid var(--sw-accent)"></i>視窗內</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 剛離開</span>
</div>
<div class="stats">
  <div class="m"><span>不生氣顧客 s0</span><b class="s0">0</b></div>
  <div class="m"><span>視窗內生氣顧客 s1</span><b class="cnt">0</b></div>
  <div class="m"><span>目前最大 maxS1</span><b class="ans">0</b></div>
  <div class="m"><span>目前答案 s0 + maxS1</span><b class="tot">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-1052');
  var cs=[1,0,1,2,1,1,7,5],g=[0,1,0,1,0,1,0,1],k=3,n=cs.length,steps=n-k+1,st=0;
  var v=function(i){return g[i]?cs[i]:0};
  var q=function(c){return root.querySelector(c)};
  var s0=0;
  for(var z=0;z<n;z++)if(!g[z])s0+=cs[z];
  function calc(t){
    var cnt=0,i;
    for(i=0;i<k;i++)cnt+=v(i);
    var ans=cnt,log={init:true,cnt:cnt,ans:ans,lo:0,hi:k-1};
    for(i=k;i<k+t;i++){
      var add=v(i),rem=v(i-k);
      cnt+=add-rem;
      var prev=ans;
      ans=Math.max(ans,cnt);
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
      var cl='c '+(g[j]?'B':'W')+(j>=L.lo&&j<=L.hi?' win':' dim');
      if(!L.init&&j===L.i)cl+=' in';
      b+='<div class="'+cl+'">'+cs[j]+'</div>';
      c+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=a;
    q('.r-cells').innerHTML=b;
    q('.r-ix').innerHTML=c;
    q('.s0').textContent=s0;
    q('.cnt').textContent=L.cnt;
    q('.ans').textContent=L.ans;
    q('.tot').textContent=s0+L.ans;
    q('.stp').textContent='視窗 ['+L.lo+', '+L.hi+']（'+(st+1)+' / '+steps+'）';
    var t='';
    if(L.init){
      t='<div>s0 = 所有 grumpy = 0 的顧客總和 = <b>'+s0+'</b></div>';
      t+='<div>初始化：前 minutes = '+k+' 格裡，生氣時的顧客數 s1 = <b>'+L.cnt+'</b>，maxS1 = '+L.ans+'</div>';
    }else{
      t='<div>入：customers['+L.i+'] = '+cs[L.i]+'，grumpy = '+g[L.i]+'，加 '+L.add+'</div>';
      t+='<div>出：customers['+(L.i-k)+'] = '+cs[L.i-k]+'，grumpy = '+g[L.i-k]+'，減 '+L.rem+'</div>';
      t+='<div>s1 變成 <b>'+L.cnt+'</b>（變化 '+(L.add-L.rem>=0?'+':'')+(L.add-L.rem)+'）；maxS1 = max('+L.prev+', '+L.cnt+') = <b>'+L.ans+'</b></div>';
    }
    if(st===steps-1)t+='<div style="color:var(--sw-fg2)">視窗已到最右邊，答案 = s0 + maxS1 = '+s0+' + '+L.ans+' = '+(s0+L.ans)+'</div>';
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
    public int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
        int[] s = new int[2]; // s[0]：不生氣時的顧客總和；s[1]：視窗內生氣時的顧客和
        int maxS1 = 0;
        for (int i = 0; i < customers.length; i++) {
            s[grumpy[i]] += customers[i];
            int left = i - minutes + 1; // 視窗左端點
            if (left < 0) { // 視窗長度不足 minutes
                continue;
            }
            maxS1 = Math.max(maxS1, s[1]);
            // 視窗最左邊元素離開視窗
            s[1] -= grumpy[left] > 0 ? customers[left] : 0;
        }
        return s[0] + maxS1;
    }
}
```

### 小技巧：用 `s[grumpy[i]]` 一次分流

`grumpy[i]` 只會是 0 或 1，剛好可以當陣列索引：`s[grumpy[i]] += customers[i]` 一行就把顧客分進「不生氣」與「生氣」兩個累加器，不必寫 `if-else`。

要注意的是 `s[1]` 會隨視窗滑動而扣掉離開的元素，所以它代表的是「目前視窗內」的生氣顧客數；`s[0]` 則只增不減，是全程累加的不生氣顧客數。

### 複雜度分析

* 時間複雜度：O(n)，其中 n 為 `customers` 的長度，每個元素最多進出視窗各一次。
* 空間複雜度：O(1)，只用到長度為 2 的陣列和幾個變數。
