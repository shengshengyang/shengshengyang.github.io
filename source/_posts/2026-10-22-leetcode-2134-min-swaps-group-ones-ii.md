---
title: LeetCode 2134. 最少交換次數來組合所有的 1 II（環形陣列＋定長滑動視窗圖解）
date: 2026-10-22 10:00:00
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

## 2134. 最少交換次數來組合所有的 1 II

### 題目描述

**交換**定義為選中一個陣列中的兩個**互不相同**的位置並交換二者的值。

**環形**陣列是一個陣列，可以認為**第一個**元素和**最後一個**元素**相鄰**。

給你一個**二進位環形**陣列 `nums`，回傳在**任意位置**將陣列中的所有 `1` 聚集在一起需要的最少交換次數。

**範例 1**

```
輸入：nums = [0,1,0,1,1,0,0]
輸出：1
解釋：這裡列出一些能夠將所有 1 聚集在一起的方案：
[0,0,1,1,1,0,0] 交換 1 次。
[0,1,1,1,0,0,0] 交換 1 次。
[1,1,0,0,0,0,1] 交換 2 次（利用陣列的環形特性）。
無法在交換 0 次的情況下將陣列中的所有 1 聚集在一起。
因此，需要的最少交換次數為 1。
```

**範例 2**

```
輸入：nums = [0,1,1,1,0,0,1,1,0]
輸出：2
解釋：這裡列出一些能夠將所有 1 聚集在一起的方案：
[1,1,1,0,0,0,0,1,1] 交換 2 次（利用陣列的環形特性）。
[1,1,1,1,1,0,0,0,0] 交換 2 次。
無法在交換 0 次或 1 次的情況下將陣列中的所有 1 聚集在一起。
因此，需要的最少交換次數為 2。
```

**範例 3**

```
輸入：nums = [1,1,0,0,1]
輸出：0
解釋：得益於陣列的環形特性，所有的 1 已經聚集在一起。
因此，需要的最少交換次數為 0。
```

**限制**

* `1 <= nums.length <= 10^5`
* `nums[i]` 為 `0` 或者 `1`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/minimum-swaps-to-group-all-1s-together-ii/solutions/1200295/duan-huan-cheng-lian-hua-dong-chuang-kou-ws80/)。圖解與步驟說明為自行補充。

### 前置知識：定長滑動視窗

定長視窗每次右移一格，少一個最左邊的元素、多一個新元素，視窗內的和可以用「加新的、減舊的」在 O(1) 內更新。前面幾篇已經用過，例如 [2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/)、[1423](/2026/10/19/leetcode-1423-maximum-points-from-cards/)。這題多了一個「環形」，要處理視窗跨過尾巴的情況。

### 思路

這題的操作是「交換」，看起來很難算。但可以用一個簡單的等價問題取代：**最後所有的 1 會擠在一段連續的位置裡，那一段的長度一定是 1 的總個數**。

#### 第一步：目標是一個長度為 k 的全 1 視窗

設 `nums` 裡有 `k` 個 1。把所有 1 聚在一起，最後就是某一段**長度為 `k` 的連續位置**全是 1（環形陣列裡，這一段可以從尾巴繞回開頭）。

所以問題變成：選一段長度為 `k` 的視窗，把它變成全 1，最少要交換幾次？

#### 第二步：交換次數 = 視窗內 0 的個數

* 視窗內本來就是 1 的位置，不用動。
* 視窗內是 0 的位置，把它和**視窗外**的某個 1 交換，就能把一個 1 換進視窗。

視窗內 0 的個數，一定等於視窗外 1 的個數，因為全部 1 剛好 `k` 個、視窗長度也是 `k`：

> 視窗內的 1 + 視窗外的 1 = k = 視窗內的 1 + 視窗內的 0
> ⇒ 視窗外的 1 = 視窗內的 0

所以視窗內的 0 和視窗外的 1 可以**一一配對**，每交換一對，就多一個 1 進視窗，共需要「視窗內 0 的個數」次，而且沒有更省的做法。

用範例 1 看看。`k = 3`，每個視窗（含繞回的）內有幾個 0，就要交換幾次：

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
.swv .dupc{border-color:var(--sw-bad)!important;box-shadow:0 0 0 1.5px var(--sw-bad)}
</style>
<style>
.swv .cp{border-style:dashed}
.swv .zr{color:var(--sw-bad)}
.swv .b1{background:var(--sw-fg);color:var(--sw-bg)}
.swv .b0{background:var(--sw-card);color:var(--sw-fg)}
.swv .ls{font-size:14px;line-height:1.9}
</style>
<div class="ctl">
  <button type="button" data-a="prev">上一個視窗</button>
  <button type="button" data-a="next">下一個視窗</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">nums = [0,1,0,1,1,0,0]（k = 3 個 1，所以視窗長度 = 3；陣列是環形，視窗可以從尾巴繞回開頭）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>視窗（要變成全 1）</span>
  <span><i style="background:var(--sw-fg)"></i>1</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line)"></i>0</span>
</div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>視窗內 0 的個數 = 需要交換的次數</span><b class="zc">0</b></div>
  <div class="m"><span>所有視窗中的最小值</span><b class="mn">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-a');
  var a=[0,1,0,1,1,0,0],n=a.length,k=0,st=0,i;
  for(i=0;i<n;i++)k+=a[i];
  var q=function(c){return root.querySelector(c)};
  function info(s){
    var inw={},z=[],o=[],j;
    for(j=0;j<k;j++){var p=(s+j)%n;inw[p]=1;if(a[p]===0)z.push(p)}
    for(j=0;j<n;j++)if(!inw[j]&&a[j]===1)o.push(j);
    return {inw:inw,z:z,o:o};
  }
  var mn=n;
  for(i=0;i<n;i++)mn=Math.min(mn,info(i).z.length);
  function draw(){
    var R=info(st),x='',y='',z='',j;
    for(j=0;j<n;j++){
      var tg='';
      if(j===st)tg='<span class="tagi">起點</span>';
      x+='<div class="ix">'+tg+'</div>';
      y+='<div class="c'+(a[j]?' b1':' b0')+(R.inw[j]?' win':' dim')+'">'+a[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=x;q('.r-cells').innerHTML=y;q('.r-ix').innerHTML=z;
    q('.zc').textContent=R.z.length;
    q('.mn').textContent=mn;
    var wrap=st+k>n;
    q('.stp').textContent='視窗起點 '+st+'（'+(st+1)+' / '+n+'）';
    var t='<div>視窗 = 下標 ['+(function(){var p=[];for(var m=0;m<k;m++)p.push((st+m)%n);return p.join(', ')})()+']'+(wrap?'（從尾巴繞回開頭）':'')+'，視窗內 0 的下標：['+R.z.join(', ')+']</div>';
    if(R.z.length===0)t+='<div>視窗內已經都是 1，<b>不需要交換</b></div>';
    else{
      t+='<div>視窗外的 1 的下標：['+R.o.join(', ')+']，剛好和視窗內的 0 一一配對：</div>';
      for(j=0;j<R.z.length;j++)t+='<div>交換 下標 '+R.z[j]+'（0） ↔ 下標 '+R.o[j]+'（1）</div>';
      t+='<div>共 <b>'+R.z.length+'</b> 次</div>';
    }
    t+='<div style="color:var(--sw-fg2)">視窗內 1 的個數 + 視窗外 1 的個數 = k = '+k+'，所以「視窗內的 0」和「視窗外的 1」數量一定一樣多。</div>';
    q('.info').innerHTML=t;
  }
  root.addEventListener('click',function(e){
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    if(b==='prev')st=Math.max(0,st-1);
    else if(b==='next')st=Math.min(n-1,st+1);
    else st=0;
    draw();
  });
  draw();
})();
</script>
</div>
{% endraw %}

七個視窗內 0 的個數依序是 2、1、1、1、2、3、2，最小值是 1，就是範例 1 的答案。

於是問題變成：

> 環形陣列中，長度為 `k` 的視窗裡 **0 的個數的最小值**。

這是標準的定長滑動視窗。

#### 第三步：處理環形陣列

視窗要從尾巴繞回開頭怎麼辦？把陣列想成**攤平的序列**，接在後面再複製一段，下標超過 `n − 1` 就**取模 `n`** 映射回原本的位置：

* 第一個視窗是 `[0, k − 1]`，最後一個視窗是 `[n − 1, n + k − 2]`。
* `[n − 1, n + k − 2]` 的下一個視窗是 `[n, n + k − 1]`，在環形陣列裡這和 `[0, k − 1]` 完全一樣，所以**不需要再繼續枚舉**。
* 因此 `i` 只需要從 `0` 走到 `n + k − 2`，進入視窗的元素用 `nums[i % n]`。
* 離開視窗的元素 `nums[i − k + 1]`，因為 `i < n + k − 1`，所以 `i − k + 1 < n`，不用取模。

#### 第四步：統計 1 比統計 0 方便

視窗內 0 的個數 = `k − 視窗內 1 的個數`。與其數 0，不如數 1（直接把元素加起來，因為元素就是 0 或 1），先求視窗內 1 的個數的**最大值** `max1`，最後答案就是 `k − max1`。

特別情況：陣列裡完全沒有 1（`k = 0`），不需要交換，直接回傳 0。

### 圖解（可互動）

用範例 1：`nums = [0,1,0,1,1,0,0]`，`k = 3`，`n = 7`。陣列被攤平成長度 `n + k − 1 = 9` 的序列，虛線格是接在後面複製的那兩格（下標 7、8，對應原本的 0、1）。重點看：

* 前 `k − 1 = 2` 個元素只累加、不更新答案（窗口還沒滿）。
* 窗口 `[5, 7]`、`[6, 8]` 是跨過尾巴的窗口，用的是 `nums[i % n]`。
* `max1` 最後是 2，答案 = `3 − 2 = 1`。

{% raw %}
<div class="swv" id="swv-b" style="--sw-n:9">
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">nums = [0,1,0,1,1,0,0]，n = 7，k = 3：把陣列「攤平」成長度 n + k − 1 = 9 的序列（虛線格是接在後面的複製，下標要 % n）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>視窗</span>
  <span><i style="border:1.5px dashed var(--sw-fg2)"></i>環形接回來的複製</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 更新後離開</span>
</div>
<div class="stats">
  <div class="m"><span>視窗內 1 的個數 cnt1</span><b class="c1">0</b></div>
  <div class="m"><span>目前最大值 max1</span><b class="mx">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-b');
  var a=[0,1,0,1,1,0,0],n=a.length,k=0,st=0,steps=[],i;
  for(i=0;i<n;i++)k+=a[i];
  var total,N=n+k-1;
  var q=function(c){return root.querySelector(c)};
  (function(){
    var cnt=0,mx=0;
    for(i=0;i<k-1;i++)cnt+=a[i%n];
    steps.push({init:true,cnt:cnt,mx:0,lo:0,hi:k-2});
    for(i=k-1;i<N;i++){
      cnt+=a[i%n];
      var prev=mx;mx=Math.max(mx,cnt);
      var l=i-k+1;
      steps.push({init:false,i:i,l:l,cnt:cnt,prev:prev,mx:mx,lo:l,hi:i,add:a[i%n],out:a[l]});
      cnt-=a[l];
    }
    total=steps.length;
  })();
  function draw(){
    var L=steps[st],x='',y='',z='',j;
    for(j=0;j<N;j++){
      var tg='';
      if(!L.init&&j===L.i)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.l)tg='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      var cl='c'+(a[j%n]?' b1':' b0')+(j>=L.lo&&j<=L.hi?' win':' dim')+(j>=n?' cp':'');
      if(!L.init&&j===L.i)cl+=' in';
      y+='<div class="'+cl+'">'+a[j%n]+'</div>';
      z+='<div class="ix">'+(j>=n?j+'→'+(j-n):j)+'</div>';
    }
    q('.r-tag').innerHTML=x;q('.r-cells').innerHTML=y;q('.r-ix').innerHTML=z;
    q('.c1').textContent=L.cnt;
    q('.mx').textContent=L.mx;
    q('.stp').textContent=(st+1)+' / '+total;
    var t='';
    if(L.init){
      t='<div>初始化：窗口還沒滿（要 k = '+k+' 個），先累加前 k − 1 = '+(k-1)+' 個，cnt1 = <b>'+L.cnt+'</b></div>';
    }else{
      t='<div>入：nums['+L.i+(L.i>=n?' % '+n+' = '+(L.i-n):'')+'] = '+L.add+'，cnt1 變成 <b>'+L.cnt+'</b></div>';
      t+='<div>更新：max1 = max('+L.prev+', '+L.cnt+') = <b>'+L.mx+'</b>（窗口內 0 的個數 = k − cnt1 = '+(k-L.cnt)+'）</div>';
      t+='<div>出：nums['+L.l+'] = '+L.out+' 離開窗口，cnt1 減 '+L.out+'（給下一步用）</div>';
    }
    if(st===total-1)t+='<div style="color:var(--sw-fg2)">全部窗口看完：答案 = k − max1 = '+k+' − '+L.mx+' = <b>'+(k-L.mx)+'</b></div>';
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

把過程寫成表格（`n = 7`，`k = 3`）：

| 窗口 | 內容 | 窗口內 1 的個數 | `max1` | 窗口內 0 的個數 |
|---|---|---|---|---|
| `[0,2]` | 0,1,0 | 1 | 1 | 2 |
| `[1,3]` | 1,0,1 | 2 | 2 | 1 |
| `[2,4]` | 0,1,1 | 2 | 2 | 1 |
| `[3,5]` | 1,1,0 | 2 | 2 | 1 |
| `[4,6]` | 1,0,0 | 1 | 2 | 2 |
| `[5,7]` | 0,0,**0**（`nums[7%7]=nums[0]`） | 0 | 2 | 3 |
| `[6,8]` | 0,**0**,**1**（`nums[0]`、`nums[1]`） | 1 | 2 | 2 |

答案 = `k − max1 = 3 − 2 = 1`。

### 解法（灵茶山艾府）

```java
class Solution {
    public int minSwaps(int[] nums) {
        // 統計 1 的個數
        int k = 0;
        for (int x : nums) {
            k += x;
        }
        if (k == 0) { // 沒有 1，無需交換
            return 0;
        }

        int n = nums.length;
        int max1 = 0;
        int cnt1 = 0;
        for (int i = 0; i < n + k - 1; i++) {
            // 1. 進入視窗
            cnt1 += nums[i % n];
            if (i < k - 1) { // 視窗大小不足 k
                continue;
            }
            // 2. 更新答案
            max1 = Math.max(max1, cnt1);
            // 3. 離開視窗，為下一個迴圈做準備
            cnt1 -= nums[i - k + 1]; // 由於我們保證 i < n+k-1，所以 i-k+1 < n，無需取模
        }
        return k - max1;
    }
}
```

幾個細節：

* `i` 的範圍是 `0 ~ n + k − 2`，這樣剛好窗口起點 `0 ~ n − 1` 各一次，不會重複。
* 進入視窗要取 `i % n`，離開視窗不用，因為 `i − k + 1 < n`。
* 整個陣列都是 1（`k = n`）時，`max1 = k`，答案是 0，不需要特別處理。

### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `nums` 的長度。統計 1 的個數 O(n)，滑動視窗最多走 `n + k − 1 ≤ 2n − 1` 步。
* 空間複雜度：O(1)。
