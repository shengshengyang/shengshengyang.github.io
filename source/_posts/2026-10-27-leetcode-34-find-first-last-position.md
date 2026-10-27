---
title: LeetCode 34. 在排序陣列中查找元素的第一個和最後一個位置（二分查找圖解）
date: 2026-10-27 10:00:00
tags:
- [LeetCode]
- [algorithm]
- [binary search]
- [java]
category:
- [LeetCode]
index_img: ../image/banner/leetcode_index.jpeg
banner_img: ../image/banner/LeetCode_banner.jpeg
---

## 34. 在排序陣列中查找元素的第一個和最後一個位置

### 題目描述

給你一個按照非遞減順序排列的整數陣列 `nums`，和一個目標值 `target`。請你找出給定目標值在陣列中的開始位置和結束位置。

如果陣列中不存在目標值 `target`，回傳 `[-1, -1]`。

你必須設計並實現時間複雜度為 `O(log n)` 的演算法解決此問題。

**範例 1**

```
輸入：nums = [5,7,7,8,8,10], target = 8
輸出：[3,4]
```

**範例 2**

```
輸入：nums = [5,7,7,8,8,10], target = 6
輸出：[-1,-1]
```

**範例 3**

```
輸入：nums = [], target = 0
輸出：[-1,-1]
```

**限制**

* `0 <= nums.length <= 10^5`
* `-10^9 <= nums[i] <= 10^9`
* `nums` 是一個非遞減陣列
* `-10^9 <= target <= 10^9`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/solutions/1980196/er-fen-cha-zhao-zong-shi-xie-bu-dui-yi-g-t9l9/)。題解提到搭配影片「基礎算法精講 04」（原文沒有附連結，本文不放）。圖解與步驟說明為自行補充。

### 前置知識：二分查找與 lowerBound

**二分查找**是在「有序」的陣列裡，每次看中間的數，一次排除一半，所以只要 `O(log n)`。

這題的關鍵是把問題改寫成**一個固定的小問題**，叫 `lowerBound`：

> `lowerBound(nums, x)`：回傳**最小的**滿足 `nums[i] >= x` 的下標 `i`。如果陣列為空，或所有數都 `< x`，回傳 `nums.length`。

#### 紅藍染色的想法

因為陣列是非遞減的，把每個數和 `x` 比較：`< x` 的染成**紅色**，`≥ x` 的染成**藍色**，整個陣列一定長成「**紅紅紅…藍藍藍…**」。`lowerBound` 就是在找**第一個藍色**的下標。

二分查找的過程，就是不斷縮小「還沒確定顏色」的範圍：

* `nums[mid] >= x`：`mid` 是藍色，它右邊也全是藍色，範圍往左縮。
* `nums[mid] < x`：`mid` 是紅色，它左邊也全是紅色，範圍往右縮。

範圍縮到空的時候，紅和藍的交界就找到了。

### 思路：兩次 lowerBound

1. **開始位置 `start`** = 第一個 `≥ target` 的下標 = `lowerBound(nums, target)`。
   * 如果 `start == nums.length`，或 `nums[start] != target`，代表陣列裡根本沒有 `target`，回傳 `[-1, -1]`。
2. **結束位置 `end`** = 最後一個 `≤ target` 的下標。不用另外寫二分，可以複用 `lowerBound`：
   * 最後一個 `≤ target` 的數，就是「第一個 `> target` 的數」左邊那一個。
   * 在全是整數的前提下，`> target` 等價於 `≥ target + 1`，所以第一個 `> target` 的下標是 `lowerBound(nums, target + 1)`。
   * 減一就是 `end`：`end = lowerBound(nums, target + 1) - 1`。

用範例 1：`target = 8`。

* `start = lowerBound(nums, 8) = 3`（`nums[3] = 8` 是第一個 `≥ 8`）。
* `end = lowerBound(nums, 9) - 1 = 5 - 1 = 4`（第一個 `≥ 9` 是 `nums[5] = 10`，下標 5）。
* 答案 `[3, 4]`。

#### 二分查找常用轉化表

這個表來自題解，換成不同需求都可以用 `lowerBound` 搞定（`n` 是陣列長度）：

| 需求 | 寫法 | 如果不存在 |
|---|---|---|
| `≥ x` 的第一個元素的下標 | `lowerBound(nums, x)` | 結果為 `n` |
| `> x` 的第一個元素的下標 | `lowerBound(nums, x + 1)` | 結果為 `n` |
| `< x` 的最後一個元素的下標 | `lowerBound(nums, x) - 1` | 結果為 `-1` |
| `≤ x` 的最後一個元素的下標 | `lowerBound(nums, x + 1) - 1` | 結果為 `-1` |

#### 三種寫法，只差在「區間怎麼定義」

`lowerBound` 的內容就是二分查找，常見有三種寫法，差別只在「搜尋範圍」是哪一種區間：

| | 方法一：閉區間 | 方法二：左閉右開 | 方法三：開區間 |
|---|---|---|---|
| 區間 | `[left, right]` | `[left, right)` | `(left, right)` |
| 初始值 | `left = 0`，`right = n − 1` | `left = 0`，`right = n` | `left = −1`，`right = n` |
| 迴圈條件（區間不為空） | `left <= right` | `left < right` | `left + 1 < right` |
| `nums[mid] >= x` | `right = mid − 1` | `right = mid` | `right = mid` |
| `nums[mid] < x` | `left = mid + 1` | `left = mid + 1` | `left = mid` |
| 迴圈結束後回傳 | `left`（此時 `left = right + 1`） | `left`（此時 `left = right`） | `right`（此時 `left + 1 = right`） |

怎麼判斷自己看到的是哪一種？看 `while` 的條件：`left <= right` 是閉區間，`left < right` 是左閉右開，`left + 1 < right` 是開區間。

下面三種寫法各自用同一個範例畫一遍：陣列 `[5,7,7,8,8,10]`，可以切換要找的是 `lowerBound(nums, 8)`（找 `start`）還是 `lowerBound(nums, 9)`（找 `end`）。兩端的 `−∞`、`+∞` 是想像出來的哨兵（`nums[−1] = −∞`、`nums[n] = +∞`），這樣 `−1` 一定是紅色、`n` 一定是藍色。圖中 `L`、`M`、`R` 分別標出 `left`、`mid`、`right`。

### 方法一：閉區間

#### 思路

搜尋範圍是閉區間 `[left, right]`，初始 `left = 0`、`right = n − 1`，`left <= right` 時範圍不為空。

迴圈不變量（每一輪開始時都成立）：

* `nums[left − 1] < x`（`left` 左邊全是紅色）
* `nums[right + 1] >= x`（`right` 右邊全是藍色）

每次取 `mid`：`nums[mid] >= x` 是藍色，`mid` 右邊都不用看，範圍縮到 `[left, mid − 1]`（`right = mid − 1`）；否則是紅色，範圍縮到 `[mid + 1, right]`（`left = mid + 1`）。

結束時 `left = right + 1`，此時 `nums[left − 1] < x`、`nums[left] = nums[right + 1] >= x`，所以 `left` 就是第一個 `≥ x` 的下標。

#### 圖解（可互動）

{% raw %}
<div class="swv" id="swv-a" style="--sw-n:8">
<style>
.swv{--sw-fg:#1f2328;--sw-fg2:#59636e;--sw-fg3:#818b98;--sw-bg:#ffffff;--sw-card:#f6f8fa;--sw-line:#afb8c1;--sw-accent:#0969da;--sw-ok:#1a7f37;--sw-bad:#cf222e;margin:1.2em 0}
[data-user-color-scheme="dark"] .swv{--sw-fg:#e6edf3;--sw-fg2:#9da7b3;--sw-fg3:#7d8590;--sw-bg:#0d1117;--sw-card:#161b22;--sw-line:#4b535d;--sw-accent:#58a6ff;--sw-ok:#3fb950;--sw-bad:#f85149}
.swv .row{display:grid;grid-template-columns:repeat(var(--sw-n,10),minmax(0,1fr));gap:6px;margin:0 0 6px}
.swv .lab{font-size:13px;color:var(--sw-fg2);margin:14px 0 4px}
.swv .ix{font-size:11px;text-align:center;height:16px;color:var(--sw-fg3)}
.swv .tg{font-size:12px;text-align:center;min-height:18px;font-weight:600;white-space:nowrap}
.swv .tg .L{color:var(--sw-ok)}
.swv .tg .R{color:var(--sw-bad)}
.swv .tg .M{color:var(--sw-accent)}
.swv .c{border:1.5px solid var(--sw-line);border-radius:8px;text-align:center;padding:10px 0;font-size:15px;font-weight:500;background:var(--sw-card);color:var(--sw-fg)}
.swv .c.rd{background:rgba(207,34,46,.13);border-color:var(--sw-bad);color:var(--sw-bad)}
.swv .c.bl{background:rgba(9,105,218,.13);border-color:var(--sw-accent);color:var(--sw-accent)}
.swv .c.un{background:var(--sw-card);color:var(--sw-fg)}
.swv .c.sn{border-style:dashed;font-size:12px}
.swv .c.md{box-shadow:0 0 0 2px var(--sw-fg)}
.swv .c.ans{box-shadow:0 0 0 2px var(--sw-ok)}
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
.swv .lg{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--sw-fg2);margin-top:10px}
.swv .lg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px}
@media (max-width:480px){.swv .stats{grid-template-columns:1fr}.swv .c{padding:8px 0;font-size:13px}}
</style>
<div class="kb"></div>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">nums = [5,7,7,8,8,10]，兩端的 −∞ 和 +∞ 是想像出來的哨兵（nums[−1] = −∞，nums[n] = +∞）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="background:rgba(207,34,46,.25);border:1px solid var(--sw-bad)"></i>紅：已確定 &lt; target</span>
  <span><i style="background:rgba(9,105,218,.25);border:1px solid var(--sw-accent)"></i>藍：已確定 ≥ target</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line)"></i>白：還沒確定（搜尋範圍）</span>
  <span><i style="border:2px solid var(--sw-fg)"></i>mid</span>
</div>
<div class="stats">
  <div class="m"><span>left</span><b class="vl">0</b></div>
  <div class="m"><span>right</span><b class="vr">0</b></div>
  <div class="m"><span>mid</span><b class="vm">—</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  /* 參數由下面三個佔位符填入：ARR 陣列、TARGETS 要找的 target（可多個，用按鈕切換）、MODE 為 closed、half 或 open */
  var root=document.getElementById('swv-a');
  var A=[5,7,7,8,8,10],TS=[[8,"第一次：lowerBound(nums, 8) → 找 start"],[9,"第二次：lowerBound(nums, 9) → 找 end（再減 1）"]],MODE='closed',n=A.length,ti=0,st=0,steps=[];
  var RULE={
    closed:{rng:'閉區間 [left, right]',ge:'right = mid − 1（範圍縮小到 [left, mid−1]）',lt:'left = mid + 1（範圍縮小到 [mid+1, right]）',ans:'left'},
    half:{rng:'左閉右開 [left, right)',ge:'right = mid（範圍縮小到 [left, mid)）',lt:'left = mid + 1（範圍縮小到 [mid+1, right)）',ans:'left'},
    open:{rng:'開區間 (left, right)',ge:'right = mid（範圍縮小到 (left, mid)）',lt:'left = mid（範圍縮小到 (mid, right)）',ans:'right'}
  }[MODE];
  var q=function(c){return root.querySelector(c)};
  function build(){
    var t=TS[ti][0],l,r,cond,mid,ge;
    steps=[];
    if(MODE==='closed'){l=0;r=n-1;cond=function(){return l<=r}}
    else if(MODE==='half'){l=0;r=n;cond=function(){return l<r}}
    else{l=-1;r=n;cond=function(){return l+1<r}}
    steps.push({k:'init',l:l,r:r,t:t});
    while(cond()){
      mid=l+Math.floor((r-l)/2);
      ge=A[mid]>=t;
      var s={k:'cmp',l:l,r:r,mid:mid,ge:ge,t:t};
      if(MODE==='closed'){if(ge)r=mid-1;else l=mid+1}
      else if(MODE==='half'){if(ge)r=mid;else l=mid+1}
      else{if(ge)r=mid;else l=mid}
      s.nl=l;s.nr=r;
      steps.push(s);
    }
    steps.push({k:'done',l:l,r:r,t:t,res:MODE==='open'?r:l});
  }
  function zone(i,L){
    if(i<0)return 'rd';
    if(i>=n)return 'bl';
    if(MODE==='closed')return i<L.l?'rd':(i>L.r?'bl':'un');
    if(MODE==='half')return i<L.l?'rd':(i>=L.r?'bl':'un');
    return i<=L.l?'rd':(i>=L.r?'bl':'un');
  }
  function draw(){
    var L=steps[st],a='',b='',c='',i,t=L.t;
    for(i=-1;i<=n;i++){
      var tg='';
      if(i===L.l)tg+='<span class="L">L</span>';
      if(L.mid!==undefined&&i===L.mid)tg+='<span class="M">M</span>';
      if(i===L.r)tg+='<span class="R">R</span>';
      a+='<div class="tg">'+tg+'</div>';
      var sn=(i<0||i>=n);
      var cl='c '+zone(i,L)+(sn?' sn':'')+(L.mid!==undefined&&i===L.mid?' md':'')+(L.k==='done'&&i===L.res?' ans':'');
      b+='<div class="'+cl+'">'+(i<0?'−∞':(i>=n?'+∞':A[i]))+'</div>';
      c+='<div class="ix">'+i+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    q('.vl').textContent=L.l;q('.vr').textContent=L.r;q('.vm').textContent=L.mid===undefined?'—':L.mid;
    q('.stp').textContent=(st+1)+' / '+steps.length;
    var h='';
    if(L.k==='init'){
      h='<div>初始範圍是'+RULE.rng+'：left = '+L.l+'，right = '+L.r+'</div><div>目標：找第一個 ≥ '+t+' 的下標（lowerBound）</div>';
    }else if(L.k==='cmp'){
      h='<div>mid = left + (right − left) / 2 = '+L.l+' + ('+L.r+' − '+L.l+') / 2 = <b>'+L.mid+'</b>，nums['+L.mid+'] = '+A[L.mid]+'</div>';
      h+=L.ge
        ?'<div>'+A[L.mid]+' ≥ '+t+'（藍）→ '+RULE.ge+'</div>'
        :'<div>'+A[L.mid]+' &lt; '+t+'（紅）→ '+RULE.lt+'</div>';
      h+='<div style="color:var(--sw-fg2)">更新後：left = '+L.nl+'，right = '+L.nr+'</div>';
    }else{
      h='<div>範圍空了，迴圈結束：left = '+L.l+'，right = '+L.r+'</div>';
      h+='<div>回傳 <b>'+RULE.ans+' = '+L.res+'</b>：'+(L.res>=n?'所有數都 &lt; '+t+'，回傳 n = '+n:'第一個 ≥ '+t+' 的是 nums['+L.res+'] = '+A[L.res])+'</div>';
    }
    q('.info').innerHTML=h;
    var kb=root.querySelectorAll('.kb button');
    for(i=0;i<kb.length;i++)kb[i].className=(+kb[i].getAttribute('data-t')===ti)?'on':'';
  }
  (function(){
    var h='<span>要找的是：</span>';
    for(var i=0;i<TS.length;i++)h+='<button type="button" data-t="'+i+'">'+TS[i][1]+'</button>';
    q('.kb').innerHTML=h;
  })();
  root.addEventListener('click',function(e){
    var tt=e.target.getAttribute&&e.target.getAttribute('data-t');
    if(tt!==null&&tt!==undefined){ti=+tt;st=0;build();draw();return}
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

注意範圍縮到最後，`left` 和 `right` 會**交錯**（`left = right + 1`），白色格子消失，紅藍的交界就是答案。

#### 解法（灵茶山艾府）

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int start = lowerBound(nums, target);
        if (start == nums.length || nums[start] != target) {
            return new int[]{-1, -1}; // nums 中沒有 target
        }
        // 如果 start 存在，那麼 end 必定存在
        int end = lowerBound(nums, target + 1) - 1;
        return new int[]{start, end};
    }

    // lowerBound 回傳最小的滿足 nums[i] >= target 的下標 i
    // 如果陣列為空，或者所有數都 < target，則回傳 nums.length
    // 要求 nums 是非遞減的，即 nums[i] <= nums[i + 1]
    private int lowerBound(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1; // 閉區間 [left, right]
        while (left <= right) { // 區間不為空
            // 迴圈不變量：
            // nums[left-1] < target
            // nums[right+1] >= target
            int mid = left + (right - left) / 2;
            if (nums[mid] >= target) {
                right = mid - 1; // 範圍縮小到 [left, mid-1]
            } else {
                left = mid + 1; // 範圍縮小到 [mid+1, right]
            }
        }
        // 迴圈結束後 left = right+1
        // 此時 nums[left-1] < target 而 nums[left] = nums[right+1] >= target
        // 所以 left 就是第一個 >= target 的元素下標
        return left;
    }
}
```

#### 複雜度分析

* 時間複雜度：O(log n)，其中 n 是 `nums` 的長度。`lowerBound` 呼叫兩次，每次 O(log n)。
* 空間複雜度：O(1)。

### 方法二：左閉右開區間

#### 思路

搜尋範圍是左閉右開 `[left, right)`，初始 `left = 0`、`right = n`，`left < right` 時範圍不為空。

迴圈不變量：`nums[left − 1] < x`、`nums[right] >= x`。

* `nums[mid] >= x`：`mid` 是藍色，它可能就是答案，所以右端點取到 `mid`（開區間不包含 `mid`，但 `mid` 已經是藍色，被記在右邊）：`right = mid`，範圍縮到 `[left, mid)`。
* `nums[mid] < x`：`left = mid + 1`，範圍縮到 `[mid + 1, right)`。

結束時 `left = right`，答案就是 `left`（等於 `right`）。

#### 圖解（可互動）

和方法一比較：`right` 初始是 `n`（指向哨兵 `+∞`），更新時 `right = mid` 而不是 `mid − 1`，結束時 `left` 和 `right` **重合**而不是交錯。

{% raw %}
<div class="swv" id="swv-b" style="--sw-n:8">
<style>
.swv{--sw-fg:#1f2328;--sw-fg2:#59636e;--sw-fg3:#818b98;--sw-bg:#ffffff;--sw-card:#f6f8fa;--sw-line:#afb8c1;--sw-accent:#0969da;--sw-ok:#1a7f37;--sw-bad:#cf222e;margin:1.2em 0}
[data-user-color-scheme="dark"] .swv{--sw-fg:#e6edf3;--sw-fg2:#9da7b3;--sw-fg3:#7d8590;--sw-bg:#0d1117;--sw-card:#161b22;--sw-line:#4b535d;--sw-accent:#58a6ff;--sw-ok:#3fb950;--sw-bad:#f85149}
.swv .row{display:grid;grid-template-columns:repeat(var(--sw-n,10),minmax(0,1fr));gap:6px;margin:0 0 6px}
.swv .lab{font-size:13px;color:var(--sw-fg2);margin:14px 0 4px}
.swv .ix{font-size:11px;text-align:center;height:16px;color:var(--sw-fg3)}
.swv .tg{font-size:12px;text-align:center;min-height:18px;font-weight:600;white-space:nowrap}
.swv .tg .L{color:var(--sw-ok)}
.swv .tg .R{color:var(--sw-bad)}
.swv .tg .M{color:var(--sw-accent)}
.swv .c{border:1.5px solid var(--sw-line);border-radius:8px;text-align:center;padding:10px 0;font-size:15px;font-weight:500;background:var(--sw-card);color:var(--sw-fg)}
.swv .c.rd{background:rgba(207,34,46,.13);border-color:var(--sw-bad);color:var(--sw-bad)}
.swv .c.bl{background:rgba(9,105,218,.13);border-color:var(--sw-accent);color:var(--sw-accent)}
.swv .c.un{background:var(--sw-card);color:var(--sw-fg)}
.swv .c.sn{border-style:dashed;font-size:12px}
.swv .c.md{box-shadow:0 0 0 2px var(--sw-fg)}
.swv .c.ans{box-shadow:0 0 0 2px var(--sw-ok)}
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
.swv .lg{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--sw-fg2);margin-top:10px}
.swv .lg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px}
@media (max-width:480px){.swv .stats{grid-template-columns:1fr}.swv .c{padding:8px 0;font-size:13px}}
</style>
<div class="kb"></div>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">nums = [5,7,7,8,8,10]，兩端的 −∞ 和 +∞ 是想像出來的哨兵（nums[−1] = −∞，nums[n] = +∞）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="background:rgba(207,34,46,.25);border:1px solid var(--sw-bad)"></i>紅：已確定 &lt; target</span>
  <span><i style="background:rgba(9,105,218,.25);border:1px solid var(--sw-accent)"></i>藍：已確定 ≥ target</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line)"></i>白：還沒確定（搜尋範圍）</span>
  <span><i style="border:2px solid var(--sw-fg)"></i>mid</span>
</div>
<div class="stats">
  <div class="m"><span>left</span><b class="vl">0</b></div>
  <div class="m"><span>right</span><b class="vr">0</b></div>
  <div class="m"><span>mid</span><b class="vm">—</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  /* 參數由下面三個佔位符填入：ARR 陣列、TARGETS 要找的 target（可多個，用按鈕切換）、MODE 為 closed、half 或 open */
  var root=document.getElementById('swv-b');
  var A=[5,7,7,8,8,10],TS=[[8,"第一次：lowerBound(nums, 8) → 找 start"],[9,"第二次：lowerBound(nums, 9) → 找 end（再減 1）"]],MODE='half',n=A.length,ti=0,st=0,steps=[];
  var RULE={
    closed:{rng:'閉區間 [left, right]',ge:'right = mid − 1（範圍縮小到 [left, mid−1]）',lt:'left = mid + 1（範圍縮小到 [mid+1, right]）',ans:'left'},
    half:{rng:'左閉右開 [left, right)',ge:'right = mid（範圍縮小到 [left, mid)）',lt:'left = mid + 1（範圍縮小到 [mid+1, right)）',ans:'left'},
    open:{rng:'開區間 (left, right)',ge:'right = mid（範圍縮小到 (left, mid)）',lt:'left = mid（範圍縮小到 (mid, right)）',ans:'right'}
  }[MODE];
  var q=function(c){return root.querySelector(c)};
  function build(){
    var t=TS[ti][0],l,r,cond,mid,ge;
    steps=[];
    if(MODE==='closed'){l=0;r=n-1;cond=function(){return l<=r}}
    else if(MODE==='half'){l=0;r=n;cond=function(){return l<r}}
    else{l=-1;r=n;cond=function(){return l+1<r}}
    steps.push({k:'init',l:l,r:r,t:t});
    while(cond()){
      mid=l+Math.floor((r-l)/2);
      ge=A[mid]>=t;
      var s={k:'cmp',l:l,r:r,mid:mid,ge:ge,t:t};
      if(MODE==='closed'){if(ge)r=mid-1;else l=mid+1}
      else if(MODE==='half'){if(ge)r=mid;else l=mid+1}
      else{if(ge)r=mid;else l=mid}
      s.nl=l;s.nr=r;
      steps.push(s);
    }
    steps.push({k:'done',l:l,r:r,t:t,res:MODE==='open'?r:l});
  }
  function zone(i,L){
    if(i<0)return 'rd';
    if(i>=n)return 'bl';
    if(MODE==='closed')return i<L.l?'rd':(i>L.r?'bl':'un');
    if(MODE==='half')return i<L.l?'rd':(i>=L.r?'bl':'un');
    return i<=L.l?'rd':(i>=L.r?'bl':'un');
  }
  function draw(){
    var L=steps[st],a='',b='',c='',i,t=L.t;
    for(i=-1;i<=n;i++){
      var tg='';
      if(i===L.l)tg+='<span class="L">L</span>';
      if(L.mid!==undefined&&i===L.mid)tg+='<span class="M">M</span>';
      if(i===L.r)tg+='<span class="R">R</span>';
      a+='<div class="tg">'+tg+'</div>';
      var sn=(i<0||i>=n);
      var cl='c '+zone(i,L)+(sn?' sn':'')+(L.mid!==undefined&&i===L.mid?' md':'')+(L.k==='done'&&i===L.res?' ans':'');
      b+='<div class="'+cl+'">'+(i<0?'−∞':(i>=n?'+∞':A[i]))+'</div>';
      c+='<div class="ix">'+i+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    q('.vl').textContent=L.l;q('.vr').textContent=L.r;q('.vm').textContent=L.mid===undefined?'—':L.mid;
    q('.stp').textContent=(st+1)+' / '+steps.length;
    var h='';
    if(L.k==='init'){
      h='<div>初始範圍是'+RULE.rng+'：left = '+L.l+'，right = '+L.r+'</div><div>目標：找第一個 ≥ '+t+' 的下標（lowerBound）</div>';
    }else if(L.k==='cmp'){
      h='<div>mid = left + (right − left) / 2 = '+L.l+' + ('+L.r+' − '+L.l+') / 2 = <b>'+L.mid+'</b>，nums['+L.mid+'] = '+A[L.mid]+'</div>';
      h+=L.ge
        ?'<div>'+A[L.mid]+' ≥ '+t+'（藍）→ '+RULE.ge+'</div>'
        :'<div>'+A[L.mid]+' &lt; '+t+'（紅）→ '+RULE.lt+'</div>';
      h+='<div style="color:var(--sw-fg2)">更新後：left = '+L.nl+'，right = '+L.nr+'</div>';
    }else{
      h='<div>範圍空了，迴圈結束：left = '+L.l+'，right = '+L.r+'</div>';
      h+='<div>回傳 <b>'+RULE.ans+' = '+L.res+'</b>：'+(L.res>=n?'所有數都 &lt; '+t+'，回傳 n = '+n:'第一個 ≥ '+t+' 的是 nums['+L.res+'] = '+A[L.res])+'</div>';
    }
    q('.info').innerHTML=h;
    var kb=root.querySelectorAll('.kb button');
    for(i=0;i<kb.length;i++)kb[i].className=(+kb[i].getAttribute('data-t')===ti)?'on':'';
  }
  (function(){
    var h='<span>要找的是：</span>';
    for(var i=0;i<TS.length;i++)h+='<button type="button" data-t="'+i+'">'+TS[i][1]+'</button>';
    q('.kb').innerHTML=h;
  })();
  root.addEventListener('click',function(e){
    var tt=e.target.getAttribute&&e.target.getAttribute('data-t');
    if(tt!==null&&tt!==undefined){ti=+tt;st=0;build();draw();return}
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
    public int[] searchRange(int[] nums, int target) {
        int start = lowerBound(nums, target);
        if (start == nums.length || nums[start] != target) {
            return new int[]{-1, -1}; // nums 中沒有 target
        }
        // 如果 start 存在，那麼 end 必定存在
        int end = lowerBound(nums, target + 1) - 1;
        return new int[]{start, end};
    }

    // lowerBound 回傳最小的滿足 nums[i] >= target 的下標 i
    // 如果陣列為空，或者所有數都 < target，則回傳 nums.length
    // 要求 nums 是非遞減的，即 nums[i] <= nums[i + 1]
    private int lowerBound(int[] nums, int target) {
        int left = 0;
        int right = nums.length; // 左閉右開區間 [left, right)
        while (left < right) { // 區間不為空
            // 迴圈不變量：
            // nums[left-1] < target
            // nums[right] >= target
            int mid = left + (right - left) / 2;
            if (nums[mid] >= target) {
                right = mid; // 範圍縮小到 [left, mid)
            } else {
                left = mid + 1; // 範圍縮小到 [mid+1, right)
            }
        }
        // 迴圈結束後 left = right
        // 此時 nums[left-1] < target 而 nums[left] = nums[right] >= target
        // 所以 left 就是第一個 >= target 的元素下標
        return left;
    }
}
```

#### 複雜度分析

* 時間複雜度：O(log n)。
* 空間複雜度：O(1)。

### 方法三：開區間

#### 思路

搜尋範圍是開區間 `(left, right)`，初始 `left = −1`、`right = n`（這兩個下標都不在陣列裡，是兩個哨兵），`left + 1 < right` 時範圍不為空。

可以假設 `nums[−1] = −∞`、`nums[n] = +∞`，陣列仍然有序，所以 `nums[−1] < x`（紅）、`nums[n] >= x`（藍），這就是為什麼初始值是 `−1` 和 `n`。

迴圈不變量：`nums[left] < x`、`nums[right] >= x`，也就是 `left` 一直是紅色、`right` 一直是藍色。

* `nums[mid] >= x`：`mid` 是藍色，`right = mid`。
* `nums[mid] < x`：`mid` 是紅色，`left = mid`。

兩邊更新時都是「直接指向 `mid`」，不用加減一。結束時 `left + 1 = right`，`left` 是最後一個紅色、`right` 是第一個藍色，所以答案是 `right`。

#### 圖解（可互動）

這個寫法最直接對應「紅藍染色」：`L` 永遠停在紅色格子、`R` 永遠停在藍色格子，兩者碰到一起（相鄰）就結束，答案是 `R`。

{% raw %}
<div class="swv" id="swv-c" style="--sw-n:8">
<style>
.swv{--sw-fg:#1f2328;--sw-fg2:#59636e;--sw-fg3:#818b98;--sw-bg:#ffffff;--sw-card:#f6f8fa;--sw-line:#afb8c1;--sw-accent:#0969da;--sw-ok:#1a7f37;--sw-bad:#cf222e;margin:1.2em 0}
[data-user-color-scheme="dark"] .swv{--sw-fg:#e6edf3;--sw-fg2:#9da7b3;--sw-fg3:#7d8590;--sw-bg:#0d1117;--sw-card:#161b22;--sw-line:#4b535d;--sw-accent:#58a6ff;--sw-ok:#3fb950;--sw-bad:#f85149}
.swv .row{display:grid;grid-template-columns:repeat(var(--sw-n,10),minmax(0,1fr));gap:6px;margin:0 0 6px}
.swv .lab{font-size:13px;color:var(--sw-fg2);margin:14px 0 4px}
.swv .ix{font-size:11px;text-align:center;height:16px;color:var(--sw-fg3)}
.swv .tg{font-size:12px;text-align:center;min-height:18px;font-weight:600;white-space:nowrap}
.swv .tg .L{color:var(--sw-ok)}
.swv .tg .R{color:var(--sw-bad)}
.swv .tg .M{color:var(--sw-accent)}
.swv .c{border:1.5px solid var(--sw-line);border-radius:8px;text-align:center;padding:10px 0;font-size:15px;font-weight:500;background:var(--sw-card);color:var(--sw-fg)}
.swv .c.rd{background:rgba(207,34,46,.13);border-color:var(--sw-bad);color:var(--sw-bad)}
.swv .c.bl{background:rgba(9,105,218,.13);border-color:var(--sw-accent);color:var(--sw-accent)}
.swv .c.un{background:var(--sw-card);color:var(--sw-fg)}
.swv .c.sn{border-style:dashed;font-size:12px}
.swv .c.md{box-shadow:0 0 0 2px var(--sw-fg)}
.swv .c.ans{box-shadow:0 0 0 2px var(--sw-ok)}
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
.swv .lg{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--sw-fg2);margin-top:10px}
.swv .lg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px}
@media (max-width:480px){.swv .stats{grid-template-columns:1fr}.swv .c{padding:8px 0;font-size:13px}}
</style>
<div class="kb"></div>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">nums = [5,7,7,8,8,10]，兩端的 −∞ 和 +∞ 是想像出來的哨兵（nums[−1] = −∞，nums[n] = +∞）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="background:rgba(207,34,46,.25);border:1px solid var(--sw-bad)"></i>紅：已確定 &lt; target</span>
  <span><i style="background:rgba(9,105,218,.25);border:1px solid var(--sw-accent)"></i>藍：已確定 ≥ target</span>
  <span><i style="background:var(--sw-card);border:1px solid var(--sw-line)"></i>白：還沒確定（搜尋範圍）</span>
  <span><i style="border:2px solid var(--sw-fg)"></i>mid</span>
</div>
<div class="stats">
  <div class="m"><span>left</span><b class="vl">0</b></div>
  <div class="m"><span>right</span><b class="vr">0</b></div>
  <div class="m"><span>mid</span><b class="vm">—</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  /* 參數由下面三個佔位符填入：ARR 陣列、TARGETS 要找的 target（可多個，用按鈕切換）、MODE 為 closed、half 或 open */
  var root=document.getElementById('swv-c');
  var A=[5,7,7,8,8,10],TS=[[8,"第一次：lowerBound(nums, 8) → 找 start"],[9,"第二次：lowerBound(nums, 9) → 找 end（再減 1）"]],MODE='open',n=A.length,ti=0,st=0,steps=[];
  var RULE={
    closed:{rng:'閉區間 [left, right]',ge:'right = mid − 1（範圍縮小到 [left, mid−1]）',lt:'left = mid + 1（範圍縮小到 [mid+1, right]）',ans:'left'},
    half:{rng:'左閉右開 [left, right)',ge:'right = mid（範圍縮小到 [left, mid)）',lt:'left = mid + 1（範圍縮小到 [mid+1, right)）',ans:'left'},
    open:{rng:'開區間 (left, right)',ge:'right = mid（範圍縮小到 (left, mid)）',lt:'left = mid（範圍縮小到 (mid, right)）',ans:'right'}
  }[MODE];
  var q=function(c){return root.querySelector(c)};
  function build(){
    var t=TS[ti][0],l,r,cond,mid,ge;
    steps=[];
    if(MODE==='closed'){l=0;r=n-1;cond=function(){return l<=r}}
    else if(MODE==='half'){l=0;r=n;cond=function(){return l<r}}
    else{l=-1;r=n;cond=function(){return l+1<r}}
    steps.push({k:'init',l:l,r:r,t:t});
    while(cond()){
      mid=l+Math.floor((r-l)/2);
      ge=A[mid]>=t;
      var s={k:'cmp',l:l,r:r,mid:mid,ge:ge,t:t};
      if(MODE==='closed'){if(ge)r=mid-1;else l=mid+1}
      else if(MODE==='half'){if(ge)r=mid;else l=mid+1}
      else{if(ge)r=mid;else l=mid}
      s.nl=l;s.nr=r;
      steps.push(s);
    }
    steps.push({k:'done',l:l,r:r,t:t,res:MODE==='open'?r:l});
  }
  function zone(i,L){
    if(i<0)return 'rd';
    if(i>=n)return 'bl';
    if(MODE==='closed')return i<L.l?'rd':(i>L.r?'bl':'un');
    if(MODE==='half')return i<L.l?'rd':(i>=L.r?'bl':'un');
    return i<=L.l?'rd':(i>=L.r?'bl':'un');
  }
  function draw(){
    var L=steps[st],a='',b='',c='',i,t=L.t;
    for(i=-1;i<=n;i++){
      var tg='';
      if(i===L.l)tg+='<span class="L">L</span>';
      if(L.mid!==undefined&&i===L.mid)tg+='<span class="M">M</span>';
      if(i===L.r)tg+='<span class="R">R</span>';
      a+='<div class="tg">'+tg+'</div>';
      var sn=(i<0||i>=n);
      var cl='c '+zone(i,L)+(sn?' sn':'')+(L.mid!==undefined&&i===L.mid?' md':'')+(L.k==='done'&&i===L.res?' ans':'');
      b+='<div class="'+cl+'">'+(i<0?'−∞':(i>=n?'+∞':A[i]))+'</div>';
      c+='<div class="ix">'+i+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    q('.vl').textContent=L.l;q('.vr').textContent=L.r;q('.vm').textContent=L.mid===undefined?'—':L.mid;
    q('.stp').textContent=(st+1)+' / '+steps.length;
    var h='';
    if(L.k==='init'){
      h='<div>初始範圍是'+RULE.rng+'：left = '+L.l+'，right = '+L.r+'</div><div>目標：找第一個 ≥ '+t+' 的下標（lowerBound）</div>';
    }else if(L.k==='cmp'){
      h='<div>mid = left + (right − left) / 2 = '+L.l+' + ('+L.r+' − '+L.l+') / 2 = <b>'+L.mid+'</b>，nums['+L.mid+'] = '+A[L.mid]+'</div>';
      h+=L.ge
        ?'<div>'+A[L.mid]+' ≥ '+t+'（藍）→ '+RULE.ge+'</div>'
        :'<div>'+A[L.mid]+' &lt; '+t+'（紅）→ '+RULE.lt+'</div>';
      h+='<div style="color:var(--sw-fg2)">更新後：left = '+L.nl+'，right = '+L.nr+'</div>';
    }else{
      h='<div>範圍空了，迴圈結束：left = '+L.l+'，right = '+L.r+'</div>';
      h+='<div>回傳 <b>'+RULE.ans+' = '+L.res+'</b>：'+(L.res>=n?'所有數都 &lt; '+t+'，回傳 n = '+n:'第一個 ≥ '+t+' 的是 nums['+L.res+'] = '+A[L.res])+'</div>';
    }
    q('.info').innerHTML=h;
    var kb=root.querySelectorAll('.kb button');
    for(i=0;i<kb.length;i++)kb[i].className=(+kb[i].getAttribute('data-t')===ti)?'on':'';
  }
  (function(){
    var h='<span>要找的是：</span>';
    for(var i=0;i<TS.length;i++)h+='<button type="button" data-t="'+i+'">'+TS[i][1]+'</button>';
    q('.kb').innerHTML=h;
  })();
  root.addEventListener('click',function(e){
    var tt=e.target.getAttribute&&e.target.getAttribute('data-t');
    if(tt!==null&&tt!==undefined){ti=+tt;st=0;build();draw();return}
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
    public int[] searchRange(int[] nums, int target) {
        int start = lowerBound(nums, target);
        if (start == nums.length || nums[start] != target) {
            return new int[]{-1, -1}; // nums 中沒有 target
        }
        // 如果 start 存在，那麼 end 必定存在
        int end = lowerBound(nums, target + 1) - 1;
        return new int[]{start, end};
    }

    // lowerBound 回傳最小的滿足 nums[i] >= target 的下標 i
    // 如果陣列為空，或者所有數都 < target，則回傳 nums.length
    // 要求 nums 是非遞減的，即 nums[i] <= nums[i + 1]
    private int lowerBound(int[] nums, int target) {
        int left = -1;
        int right = nums.length; // 開區間 (left, right)
        while (left + 1 < right) { // 區間不為空
            // 迴圈不變量：
            // nums[left] < target
            // nums[right] >= target
            int mid = left + (right - left) / 2;
            if (nums[mid] >= target) {
                right = mid; // 範圍縮小到 (left, mid)
            } else {
                left = mid; // 範圍縮小到 (mid, right)
            }
        }
        // 迴圈結束後 left+1 = right
        // 此時 nums[left] < target 而 nums[right] >= target
        // 所以 right 就是第一個 >= target 的元素下標
        return right;
    }
}
```

#### 複雜度分析

* 時間複雜度：O(log n)。
* 空間複雜度：O(1)。

### 答疑

以下整理自題解的問答，措辭為自行改寫。

**Q：`end = lowerBound(nums, target + 1) - 1` 怎麼理解？**
要找「最後一個 `≤ target`」，等於找「第一個 `> target`」再往左一格。數字都是整數時 `> target` 就是 `≥ target + 1`，所以直接複用 `lowerBound`。

**Q：如果不存在 `≥ target + 1` 的數怎麼辦？**
代表所有數都 `≤ target`。如果陣列裡有 `target`，那最後一個數（下標 `n − 1`）就是 `target`。`lowerBound(nums, target + 1)` 這時回傳 `n`，減一剛好是 `n − 1`，結果正確。

**Q：為什麼寫 `left + (right - left) / 2`？**
`left + right` 在陣列很長時可能 `int` 溢位，這種寫法不會。這題的資料範圍寫 `(left + right) / 2` 也不會出錯，但養成習慣比較安全。

**Q：閉區間寫法裡，`nums[mid] >= target` 時為什麼 `right = mid − 1`，不會錯過答案嗎？**
「二分範圍」和「答案所在範圍」是兩個概念。設目前二分範圍是 `[L, R]`，如果裡面所有數都 `< target`，答案是 `R + 1`，所以閉區間 `[L, R]` 的答案所在範圍是 `[L, R + 1]`。`mid` 如果是藍色，它右邊都是藍色，答案只會在 `mid` 或它左邊，而 `right = mid − 1` 之後，答案仍然在 `[left, right + 1]` 裡（`right + 1 = mid` 就是那個可能的答案），所以不會錯過。

**Q：有些寫法會在二分過程中額外記錄答案，怎麼看？**
喜歡這種寫法的人，建議用開區間。開區間裡 `if` 條件成立時更新哪個變數（`right`），最後就回傳哪個變數，效果和「記錄答案」一樣。

**Q：開區間裡 `−1` 和 `n` 這兩個下標怎麼理解？**
假設 `nums[−1] = −∞`、`nums[n] = +∞`，陣列仍然有序。這時 `nums[−1] < target`（紅），`nums[n] >= target`（藍），所以 `−1` 是紅色、`n` 是藍色。這個想法也能用在「二分答案」的題目。

**Q：Java 的 `Arrays.binarySearch` 可以用嗎？**
不行。陣列有多個 `target` 時，它回傳的不一定是第一個 `≥ target` 的下標，所以拿不到 `start`。（Python 的 `bisect_left` 和 `bisect_right` 就是 `lowerBound` 的兩種版本，可以直接用。）
