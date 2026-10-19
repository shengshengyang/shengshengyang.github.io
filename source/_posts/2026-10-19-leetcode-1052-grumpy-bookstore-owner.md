---
title: LeetCode 1052. 愛生氣的書店老闆（定長滑動視窗圖解）
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

## 1052. 愛生氣的書店老闆

### 題目描述

有一個書店老闆，他的書店開了 `n` 分鐘。每分鐘都有一些顧客進入這家商店。給定一個長度為 `n` 的整數陣列 `customers`，其中 `customers[i]` 是在第 `i` 分鐘開始時進入商店的顧客數量，所有這些顧客在第 `i` 分鐘結束後離開。

在某些分鐘內，書店老闆會生氣。如果書店老闆在第 `i` 分鐘生氣，那麼 `grumpy[i] = 1`，否則 `grumpy[i] = 0`。

當書店老闆生氣時，那一分鐘的顧客就會不滿意；若老闆不生氣，則顧客是滿意的。

書店老闆知道一個祕密技巧，能抑制自己的情緒，可以讓自己連續 `minutes` 分鐘不生氣，但只能使用一次。

請回傳這一天營業下來，最多有多少客戶能夠感到滿意。

```
輸入：customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3
輸出：16
解釋：書店老闆在最後 3 分鐘保持冷靜。
感到滿意的最大客戶數量 = 1 + 1 + 1 + 1 + 7 + 5 = 16.
```

```
輸入：customers = [1], grumpy = [0], minutes = 1
輸出：1
```

限制：

- `n == customers.length == grumpy.length`
- `1 <= minutes <= n <= 2 * 10^4`
- `0 <= customers[i] <= 1000`
- `grumpy[i] == 0 or 1`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/grumpy-bookstore-owner/solutions/2751888/ding-chang-hua-dong-chuang-kou-fu-ti-dan-rch7/)。圖解為自行補充。

### 思路

本題可以拆成兩個問題：

1. 老闆不生氣時的顧客數量總和 `s0`。這些顧客本來就滿意。
2. 長度為 `minutes` 的連續子陣列中，「老闆生氣時的顧客數量」總和 `s1` 的最大值 `maxS1`。這些顧客靠祕密技巧被救回來。

最終答案為 `s0 + maxS1`。

第二個問題可以用**定長滑動視窗**解決。以 `customers=[3,1,4,1,5,9]`、`grumpy` 全為 1、`minutes=3` 為例：

1. 第一個長為 3 的視窗和：`3+1+4 = 8`。
2. 往右滑一格：加上 `customers[3]=1`，減去 `customers[0]=3`，得 `8+1-3 = 6`。
3. 再滑一格：加 `customers[4]=5`，減 `customers[1]=1`，得 `6+5-1 = 10`。
4. 再滑一格：加 `customers[5]=9`，減 `customers[2]=4`，得 `10+9-4 = 15`。

最大的視窗和為 15。

**為什麼要分開計算不生氣與生氣的顧客？** 因為不生氣的顧客可能落在視窗外面，必須獨立計算；視窗只需要關心「生氣的分鐘」能多救回幾人。

### 圖解（可互動）

使用範例 1：`customers = [1,0,1,2,1,1,7,5]`、`grumpy = [0,1,0,1,0,1,0,1]`、`minutes = 3`。按「下一步」觀察視窗右移時 `s1`（視窗內生氣的顧客數）與 `maxS1` 的變化。

{% raw %}
<div class="swv" id="swv-grumpy" style="--sw-n:8">
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
<div class="row r-gr"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="background:var(--sw-fg)"></i>老闆生氣（grumpy = 1）</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line)"></i>老闆不生氣（grumpy = 0）</span>
  <span><i style="border:1.5px solid var(--sw-accent)"></i>視窗內</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 剛離開</span>
</div>
<div class="stats">
  <div class="m"><span>不生氣總和 s0</span><b class="s0">0</b></div>
  <div class="m"><span>視窗內生氣顧客 s1</span><b class="s1">0</b></div>
  <div class="m"><span>目前最大值 maxS1</span><b class="mx">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-grumpy');
  var cu=[1,0,1,2,1,1,7,5],gr=[0,1,0,1,0,1,0,1],k=3,n=cu.length,steps=n-k+1,st=0;
  var s0=0;for(var z=0;z<n;z++)if(!gr[z])s0+=cu[z];
  var q=function(c){return root.querySelector(c)};
  function calc(t){
    var s1=0,i;
    for(i=0;i<k;i++)if(gr[i])s1+=cu[i];
    var mx=s1,log={init:true,s1:s1,mx:mx,lo:0,hi:k-1};
    for(i=k;i<k+t;i++){
      var add=gr[i]?cu[i]:0,rem=gr[i-k]?cu[i-k]:0;
      s1+=add-rem;
      var prev=mx;
      mx=Math.max(mx,s1);
      log={init:false,s1:s1,mx:mx,prev:prev,add:add,rem:rem,i:i,lo:i-k+1,hi:i};
    }
    return log;
  }
  function draw(){
    var L=calc(st),a='',b='',g='',c='';
    for(var j=0;j<n;j++){
      var tg='';
      if(!L.init&&j===L.i)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.i-k)tg='<span class="tago">出</span>';
      a+='<div class="ix">'+tg+'</div>';
      var inwin=j>=L.lo&&j<=L.hi;
      var cl='c W'+(inwin?' win':' dim');
      if(!L.init&&j===L.i)cl+=' in';
      b+='<div class="'+cl+'">'+cu[j]+'</div>';
      g+='<div class="c '+(gr[j]?'B':'W')+(inwin?' win':' dim')+'" style="padding:4px 0;font-size:13px">'+gr[j]+'</div>';
      c+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=a;
    q('.r-cells').innerHTML=b;
    q('.r-gr').innerHTML=g;
    q('.r-ix').innerHTML=c;
    q('.s0').textContent=s0;
    q('.s1').textContent=L.s1;
    q('.mx').textContent=L.mx;
    q('.stp').textContent='視窗 ['+L.lo+', '+L.hi+']（'+(st+1)+' / '+steps+'）';
    var t='';
    if(L.init){
      t='<div>初始化：視窗 index 0~'+(k-1)+' 中，只加總 grumpy = 1 的顧客 → s1 = <b>'+L.s1+'</b></div><div>maxS1 = s1 = '+L.mx+'</div>';
    }else{
      t='<div>入：customers['+L.i+'] = '+cu[L.i]+'，grumpy = '+gr[L.i]+'，加 '+L.add+'</div>';
      t+='<div>出：customers['+(L.i-k)+'] = '+cu[L.i-k]+'，grumpy = '+gr[L.i-k]+'，減 '+L.rem+'</div>';
      t+='<div>s1 變成 <b>'+L.s1+'</b>；maxS1 = max('+L.prev+', '+L.s1+') = <b>'+L.mx+'</b></div>';
    }
    if(st===steps-1)t+='<div style="color:var(--sw-fg2)">視窗已到最右邊，答案 = s0 + maxS1 = '+s0+' + '+L.mx+' = <b>'+(s0+L.mx)+'</b></div>';
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
        int[] s = new int[2];
        int maxS1 = 0;
        for (int i = 0; i < customers.length; i++) {
            s[grumpy[i]] += customers[i];
            int left = i - minutes + 1; // 窗口左端點
            if (left < 0) { // 窗口長度不足 minutes
                continue;
            }
            maxS1 = Math.max(maxS1, s[1]);
            // 窗口最左邊元素離開窗口
            s[1] -= grumpy[left] > 0 ? customers[left] : 0;
        }
        return s[0] + maxS1;
    }
}
```

這裡 `s[0]` 累計整天不生氣時的顧客（不會被扣掉），`s[1]` 則是視窗內生氣時的顧客，視窗左端離開時才扣除。

### 複雜度分析

- 時間複雜度：O(n)，其中 n 為 `customers` 的長度。
- 空間複雜度：O(1)。
