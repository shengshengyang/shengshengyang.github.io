---
title: LeetCode 2841. 幾乎唯一子陣列的最大和（滑動視窗圖解）
date: 2026-10-19 10:00:00
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

## 2841. 幾乎唯一子陣列的最大和

### 題目描述

給你一個整數陣列 `nums` 和兩個正整數 `m` 和 `k`。

請你回傳 `nums` 中長度為 `k` 的**幾乎唯一**子陣列的**最大和**，如果不存在幾乎唯一子陣列，請回傳 `0`。

如果 `nums` 的一個子陣列有至少 `m` 個互不相同的元素，我們稱它是**幾乎唯一**子陣列。

子陣列指的是一個陣列中一段連續非空的元素序列。

**範例 1**

```
輸入：nums = [2,6,7,3,1,7], m = 3, k = 4
輸出：18
解釋：總共有 3 個長度為 k = 4 的幾乎唯一子陣列，分別為 [2, 6, 7, 3]、[6, 7, 3, 1] 和 [7, 3, 1, 7]。
這些子陣列中，和最大的是 [2, 6, 7, 3]，和為 18。
```

**範例 2**

```
輸入：nums = [5,9,9,2,4,5,4], m = 1, k = 3
輸出：23
解釋：總共有 5 個長度為 k = 3 的幾乎唯一子陣列，
和最大的是 [5, 9, 9]，和為 23。
```

**範例 3**

```
輸入：nums = [1,2,1,2,1,2,1], m = 3, k = 3
輸出：0
解釋：不存在長度為 3、且含有至少 3 個互不相同元素的子陣列，所以答案為 0。
```

**限制**

* `1 <= nums.length <= 2 * 10^4`
* `1 <= m <= k <= nums.length`
* `1 <= nums[i] <= 10^9`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/maximum-sum-of-almost-unique-subarray/solutions/2424847/hua-dong-chuang-kou-fu-ti-dan-pythonjava-2vd6/)。圖解為自行補充。

### 前置知識：滑動視窗

視窗是陣列中由起訖索引定義的一段連續元素。定長視窗每次向右滑一格，就是**少一個**最左邊的元素、**多一個**新進來的元素，所以視窗內的總和可以 O(1) 更新，不必每次重算。

### 思路

題目要的是「長度固定為 `k` 的視窗，且視窗內不同元素個數 ≥ `m`，求最大和」，需要同時維護兩個量：

* 視窗總和 `s`：進來加、出去減。
* 視窗內**不同元素的個數**：這是難點。

怎麼統計一個陣列有多少不同元素？全丟進雜湊集合，集合大小就是答案。但在滑動視窗裡，元素 `x` 離開視窗時，要不要從集合刪掉？

* `x` 是視窗中唯一的一個：刪。
* 視窗裡還有別的 `x`：**不能刪**。

要知道 `x` 在視窗裡還剩幾個，就得記錄出現次數，所以改用**雜湊表**：key 是元素值，value 是它在視窗中的出現次數。

1. 入：`x = nums[i]` 進入視窗，`s += x`，`cnt[x]++`。若 `i < k - 1` 視窗還沒滿，繼續。
2. 更新：若 `cnt.size() >= m`，用 `s` 更新答案的最大值。
3. 出：`x = nums[i - k + 1]` 離開視窗，`s -= x`，`cnt[x]--`。若減完是 0，要把 `x` 從雜湊表**刪除**，否則 `cnt.size()` 會把出現 0 次的元素也算進去。

### 圖解（可互動）

使用範例 1：`nums = [2,6,7,3,1,7]`，`m = 3`，`k = 4`。可以看到雜湊表內容如何隨視窗變化，以及最後一個視窗裡 `7` 的次數變成 2，但不同元素只有 3 個。

{% raw %}
<div class="swv" id="swv-a" style="--sw-n:6">
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
<div class="lab">nums = [2,6,7,3,1,7]，m = 3，k = 4</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>視窗內</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 剛離開</span>
</div>
<div class="stats">
  <div class="m"><span>視窗總和 s</span><b class="sum">0</b></div>
  <div class="m"><span>不同元素 cnt.size()</span><b class="dst">0</b></div>
  <div class="m"><span>目前最大值 ans</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-a');
  var a=[2,6,7,3,1,7],m=3,k=4,n=a.length,steps=n-k+1,st=0;
  var q=function(c){return root.querySelector(c)};
  function calc(t){
    var cnt={},s=0,i,ans=0,prev=0,ok=false,size=0;
    for(i=0;i<k;i++){s+=a[i];cnt[a[i]]=(cnt[a[i]]||0)+1}
    size=Object.keys(cnt).length;
    ok=size>=m;
    if(ok)ans=s;
    var log={init:true,s:s,cnt:JSON.parse(JSON.stringify(cnt)),size:size,ok:ok,ans:ans,prev:0,lo:0,hi:k-1};
    for(var w=1;w<=t;w++){
      var add=a[w+k-1],rem=a[w-1];
      s+=add-rem;
      cnt[add]=(cnt[add]||0)+1;
      cnt[rem]--;
      var gone=cnt[rem]===0;
      if(gone)delete cnt[rem];
      size=Object.keys(cnt).length;
      ok=size>=m;
      prev=ans;
      if(ok)ans=Math.max(ans,s);
      log={init:false,s:s,cnt:JSON.parse(JSON.stringify(cnt)),size:size,ok:ok,ans:ans,prev:prev,add:add,rem:rem,gone:gone,lo:w,hi:w+k-1};
    }
    return log;
  }
  function fmt(c){
    var p=[];
    for(var key in c)p.push(key+':'+c[key]);
    return '{'+p.join(', ')+'}';
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
    q('.dst').textContent=L.size;
    q('.ans').textContent=L.ans;
    q('.stp').textContent='視窗 ['+L.lo+', '+L.hi+']（'+(st+1)+' / '+steps+'）';
    var t='';
    if(L.init){
      t='<div>初始化：把前 k = '+k+' 格放進視窗，s = <b>'+L.s+'</b></div>';
    }else{
      t='<div>入：nums['+L.hi+'] = '+L.add+'，s 加 '+L.add+'，cnt['+L.add+']++</div>';
      t+='<div>出：nums['+(L.lo-1)+'] = '+L.rem+'，s 減 '+L.rem+'，cnt['+L.rem+']--'+(L.gone?'，變成 0 所以<b>從表中刪除</b>':'，還沒到 0 所以保留')+'</div>';
    }
    t+='<div>雜湊表 cnt = '+fmt(L.cnt)+'，不同元素 = <b>'+L.size+'</b>'+(L.size>=m?' ≥ ':' < ')+'m = '+m+'</div>';
    if(L.ok)t+='<div>符合條件：ans = max('+L.prev+', '+L.s+') = <b>'+L.ans+'</b></div>';
    else t+='<div>不符合條件，ans 維持 <b>'+L.ans+'</b></div>';
    if(st===steps-1)t+='<div style="color:var(--sw-fg2)">視窗已到最右邊，答案 = '+L.ans+'</div>';
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

### 解法（灵茶山艾府）

```java
class Solution {
    public long maxSum(List<Integer> nums, int m, int k) {
        Integer[] a = nums.toArray(Integer[]::new); // 轉成陣列，便於使用

        long ans = 0;
        long s = 0;
        Map<Integer, Integer> cnt = new HashMap<>();

        for (int i = 0; i < a.length; i++) {
            // 1. 進入視窗
            s += a[i];
            cnt.merge(a[i], 1, Integer::sum); // cnt[a[i]]++

            int left = i - k + 1;
            if (left < 0) { // 視窗大小不足 k
                continue;
            }

            // 2. 更新答案
            if (cnt.size() >= m) {
                ans = Math.max(ans, s);
            }

            // 3. 離開視窗
            int out = a[left];
            s -= out;
            int c = cnt.merge(out, -1, Integer::sum); // c = --cnt[out]
            if (c == 0) {
                cnt.remove(out); // 保證 cnt.size() 不計入出現 0 次的元素
            }
        }

        return ans;
    }
}
```

幾個細節：

* `s` 用 `long`：`k` 最大 2 * 10^4、元素最大 10^9，總和會超過 `int`。
* `cnt.merge(x, 1, Integer::sum)` 等價於 `cnt[x]++`，key 不存在時直接放 1。
* 離開視窗時一定要在次數歸零時 `remove`，這是這題最容易出錯的地方。

### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `nums` 的長度，每個元素進出視窗各一次。
* 空間複雜度：O(k)，雜湊表大小不會超過視窗長度 k。
