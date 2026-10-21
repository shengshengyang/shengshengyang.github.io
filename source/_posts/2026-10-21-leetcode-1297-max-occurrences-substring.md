---
title: LeetCode 1297. 子串的最大出現次數（定長滑動視窗圖解）
date: 2026-10-21 10:00:00
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

## 1297. 子串的最大出現次數

### 題目描述

給你一個字串 `s`，請你回傳滿足以下條件且出現次數最大的**任意**子串的出現次數：

* 子串中不同字母的數目必須小於等於 `maxLetters`。
* 子串的長度必須大於等於 `minSize` 且小於等於 `maxSize`。

**範例 1**

```
輸入：s = "aababcaab", maxLetters = 2, minSize = 3, maxSize = 4
輸出：2
解釋：子串 "aab" 在原字串中出現了 2 次。
它滿足所有的要求：2 個不同的字母，長度為 3（在 minSize 和 maxSize 範圍內）。
```

**範例 2**

```
輸入：s = "aaaa", maxLetters = 1, minSize = 3, maxSize = 3
輸出：2
解釋：子串 "aaa" 在原字串中出現了 2 次，且它們有重疊部分。
```

**範例 3**

```
輸入：s = "aabcabcab", maxLetters = 2, minSize = 2, maxSize = 3
輸出：3
```

**範例 4**

```
輸入：s = "abcde", maxLetters = 2, minSize = 3, maxSize = 3
輸出：0
```

注意：出現次數允許子串**互相重疊**（範例 2）。

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/maximum-number-of-occurrences-of-a-substring/solutions/3747384/nao-jin-ji-zhuan-wan-ding-chang-hua-dong-0hol/)。圖解與步驟說明為自行補充。

### 前置知識：定長滑動視窗

定長視窗每次右移一格，少一個最左邊的元素、多一個新元素，視窗內的資訊可以用「加新的、減舊的」在 O(1) 內更新。前面幾篇已經用過，例如 [2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/)，同樣要統計視窗內的不同元素個數。

### 思路

這題有三個條件互相牽制（不同字母數、最短長度、最長長度），乍看很複雜，其實可以先把它**簡化成只看一種長度**。

#### 第一步：只需要看長度恰好等於 minSize 的子串

兩個觀察：

1. 子串越短，包含的不同字母越少，越容易滿足 `不同字母數 <= maxLetters`。
2. 子串越短，在 `s` 裡出現的次數越多（或一樣多）。

把這兩點合起來，用一句話說明為什麼 `maxSize` 是多餘的：

> 設一個合法的子串 `T`，長度大於 `minSize`。取 `T` 的前 `minSize` 個字元，得到 `P`。
> * `P` 的不同字母數 ≤ `T` 的不同字母數 ≤ `maxLetters`，所以 `P` 也合法。
> * `T` 每出現一次，`P` 就跟著在同一個起點出現一次，所以 `P` 的出現次數 ≥ `T` 的出現次數。

也就是說，任何比 `minSize` 長的合法子串，都有一個長度恰好是 `minSize` 的合法子串**不比它差**。因此答案只需要在長度等於 `minSize` 的子串裡找。

下面用範例 1 實際比較。切換長度 3 和長度 4，看每個子串是否有效、各出現幾次：

{% raw %}
<div class="swv" id="swv-a" style="--sw-n:9">
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
.swv .kb{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--sw-fg2);margin-bottom:10px;flex-wrap:wrap}
.swv .kb button{background:var(--sw-card);color:var(--sw-fg);border:1px solid var(--sw-line);border-radius:8px;padding:2px 10px;cursor:pointer;font-size:14px}
.swv .kb button.on{border-color:var(--sw-accent);color:var(--sw-accent);font-weight:600}
.swv .ls{font-family:Consolas,monospace;font-size:14px;line-height:1.9}
.swv .ls .bad{color:var(--sw-bad)}
.swv .ls .ok{color:var(--sw-ok)}
.swv .ls b{font-weight:600}
</style>
<div class="kb"><span>選一個子串長度：</span><button type="button" data-l="3">長度 3（minSize）</button><button type="button" data-l="4">長度 4（maxSize）</button></div>
<div class="lab">s = "aababcaab"，maxLetters = 2，minSize = 3，maxSize = 4（亮起來的是「出現最多次的有效子串」出現的位置）</div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="info ls"></div>
<script>
(function(){
  var root=document.getElementById('swv-a');
  var s="aababcaab",maxL=2,n=s.length,L=3;
  var q=function(c){return root.querySelector(c)};
  function distinct(t){var o={},c=0;for(var i=0;i<t.length;i++)if(!o[t[i]]){o[t[i]]=1;c++}return c}
  function best(len){
    var cnt={},order=[],i,list=[];
    for(i=0;i+len<=n;i++){
      var t=s.substr(i,len),d=distinct(t),ok=d<=maxL;
      list.push({i:i,t:t,d:d,ok:ok});
      if(ok){if(!cnt[t]){cnt[t]=0;order.push(t)}cnt[t]++}
    }
    var bt=null,bc=0;
    for(i=0;i<order.length;i++)if(cnt[order[i]]>bc){bc=cnt[order[i]];bt=order[i]}
    return {list:list,cnt:cnt,order:order,bt:bt,bc:bc};
  }
  function draw(){
    var R=best(L),other=best(L===3?4:3),i,y='',z='',cov={};
    if(R.bt)for(i=0;i+L<=n;i++)if(s.substr(i,L)===R.bt)for(var k=0;k<L;k++)cov[i+k]=1;
    for(i=0;i<n;i++){
      y+='<div class="c'+(cov[i]?' win':' dim')+'">'+s[i]+'</div>';
      z+='<div class="ix">'+i+'</div>';
    }
    q('.r-cells').innerHTML=y;q('.r-ix').innerHTML=z;
    var t='<div>長度 '+L+' 的所有子串：</div>';
    for(i=0;i<R.list.length;i++){
      var e=R.list[i];
      t+='<div>['+e.i+'..'+(e.i+L-1)+'] <b>'+e.t+'</b>　不同字母 '+e.d+' 個　'+(e.ok?'<span class="ok">有效</span>':'<span class="bad">超過 maxLetters，不算</span>')+'</div>';
    }
    var parts=[];for(i=0;i<R.order.length;i++)parts.push(R.order[i]+' × '+R.cnt[R.order[i]]);
    t+='<div>有效子串出現次數：'+(parts.length?parts.join('、'):'（沒有）')+'</div>';
    t+='<div>長度 '+L+' 的最大出現次數 = <b>'+R.bc+'</b>；長度 '+(L===3?4:3)+' 的最大出現次數 = <b>'+other.bc+'</b></div>';
    t+='<div>'+(R.bc>=other.bc?'<span class="ok">這個長度不比另一個差</span>':'<span class="bad">這個長度比另一個差</span>')+'：長度 3 的 ≥ 長度 4 的，所以只要看 minSize</div>';
    q('.info').innerHTML=t;
    var b=root.querySelectorAll('.kb button');
    for(i=0;i<b.length;i++)b[i].className=(+b[i].getAttribute('data-l')===L)?'on':'';
  }
  root.addEventListener('click',function(e){
    var l=e.target.getAttribute&&e.target.getAttribute('data-l');
    if(l===null||l===undefined)return;
    L=+l;draw();
  });
  draw();
})();
</script>
</div>
{% endraw %}

可以看到長度 3 的最大次數（2）不小於長度 4 的最大次數（1），和上面的推論一致。

#### 第二步：用定長滑動視窗列舉所有長度為 minSize 的子串

視窗長度固定為 `minSize`，每滑一格需要維護兩件事：

1. **視窗內有幾種不同的字母**（`kinds`），用來判斷是否 `<= maxLetters`。
2. **這個子串之前出現過幾次**（`strCnt`），用雜湊表記錄，每次更新答案。

#### 第三步：怎麼維護「不同字母的數目」

不需要每次重新數。用長度 26 的陣列 `charCnt` 記錄視窗內每個字母出現幾次：

* 字母進入視窗：先看它之前的次數，如果是 0，代表是新字母，`kinds` 加一；再把次數加一。
* 字母離開視窗：先把次數減一，如果減完是 0，代表視窗裡沒有這個字母了，`kinds` 減一。

這和 [2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/) 用雜湊表統計不同元素是同一個想法，這裡字母只有小寫 26 個，用陣列比雜湊表更快。

#### 第四步：統計子串出現次數

題目保證 `minSize <= 26`，子串很短，直接把子串字串當雜湊表的 key 就夠了（`substring` 一次最多複製 26 個字元）。如果 `minSize` 可以很大，就需要用字典樹來加速，這題不用。

### 圖解（可互動）

用範例 1：`s = "aababcaab"`，`maxLetters = 2`，視窗長度 `minSize = 3`。重點看三件事：

* 視窗 `"abc"`、`"bca"` 有 3 種不同字母，超過 `maxLetters`，直接跳過，不計入子串次數。
* 最後一個視窗 `"aab"` 是第二次出現，所以 `ans` 從 1 變成 2。
* 字母離開視窗時，只有在次數歸零才讓 `kinds` 減一。

{% raw %}
<div class="swv" id="swv-b" style="--sw-n:9">
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">s = "aababcaab"，maxLetters = 2，窗口長度 = minSize = 3</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>窗口</span>
  <span><i style="border:1.5px solid var(--sw-bad)"></i>不同字母太多，不算</span>
  <span class="tagi">入 = 新進入</span>
  <span class="tago">出 = 更新後離開</span>
</div>
<div class="stats">
  <div class="m"><span>窗口內不同字母 kinds</span><b class="kd">0</b></div>
  <div class="m"><span>目前最大次數 ans</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-b');
  var s="aababcaab",maxL=2,k=3,n=s.length,st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  function copy(o){var r={},x;for(x in o)if(o[x]>0)r[x]=o[x];return r}
  function fmt(o){var p=[],x;for(x in o)p.push(x+':'+o[x]);return '{'+p.join(', ')+'}'}
  (function(){
    var cc={},kinds=0,sc={},ans=0,i;
    for(i=0;i<k-1;i++){if(!cc[s[i]])kinds++;cc[s[i]]=(cc[s[i]]||0)+1}
    steps.push({init:true,kinds:kinds,cc:copy(cc),sc:{},ans:0,lo:0,hi:k-2});
    for(i=k-1;i<n;i++){
      var wasZero=!cc[s[i]];
      if(wasZero)kinds++;
      cc[s[i]]=(cc[s[i]]||0)+1;
      var l=i-k+1,sub=s.substr(l,k),valid=kinds<=maxL,c=0,prev=ans;
      if(valid){sc[sub]=(sc[sub]||0)+1;c=sc[sub];ans=Math.max(ans,c)}
      var snap={init:false,i:i,l:l,sub:sub,valid:valid,c:c,prev:prev,kinds:kinds,cc:copy(cc),sc:copy(sc),ans:ans,lo:l,hi:i,add:s[i],out:s[l],wasZero:wasZero};
      steps.push(snap);
      cc[s[l]]--;
      snap.leaveZero=cc[s[l]]===0;
      if(cc[s[l]]===0)kinds--;
    }
  })();
  var total=steps.length;
  function draw(){
    var L=steps[st],a='',b='',c='',j;
    for(j=0;j<n;j++){
      var tg='';
      if(!L.init&&j===L.i)tg='<span class="tagi">入</span>';
      if(!L.init&&j===L.l)tg='<span class="tago">出</span>';
      a+='<div class="ix">'+tg+'</div>';
      var cl='c'+(j>=L.lo&&j<=L.hi?' win':' dim');
      if(!L.init&&j===L.i)cl+=' in';
      if(!L.init&&!L.valid&&j>=L.lo&&j<=L.hi)cl+=' dupc';
      b+='<div class="'+cl+'">'+s[j]+'</div>';
      c+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=a;q('.r-cells').innerHTML=b;q('.r-ix').innerHTML=c;
    q('.kd').textContent=L.kinds;
    q('.ans').textContent=L.ans;
    q('.stp').textContent=(st+1)+' / '+total;
    var t='';
    if(L.init){
      t='<div>初始化：窗口還沒滿（要 '+k+' 個），先把前 '+(k-1)+' 個字母放進 charCnt，kinds = <b>'+L.kinds+'</b></div>';
    }else{
      t='<div>入：s['+L.i+'] = "'+L.add+'"，'+(L.wasZero?'之前沒有這個字母，kinds 加一':'窗口裡已經有這個字母，kinds 不變')+'，kinds = <b>'+L.kinds+'</b></div>';
      t+=L.valid
        ?'<div>kinds ≤ maxLetters = '+maxL+'，子串 "'+L.sub+'" 有效，出現次數變成 <b>'+L.c+'</b>；ans = max('+L.prev+', '+L.c+') = <b>'+L.ans+'</b></div>'
        :'<div>kinds = '+L.kinds+' &gt; maxLetters = '+maxL+'，子串 "'+L.sub+'" 不算，跳過，ans 維持 <b>'+L.ans+'</b></div>';
      t+='<div>出：s['+L.l+'] = "'+L.out+'" 離開窗口，charCnt 減一'+(L.leaveZero?'，變成 0，kinds 減一':'，還沒到 0，kinds 不變')+'（給下一步用）</div>';
    }
    t+='<div style="color:var(--sw-fg2)">窗口內字母 charCnt = '+fmt(L.cc)+'</div>';
    t+='<div style="color:var(--sw-fg2)">子串出現次數 strCnt = '+fmt(L.sc)+'</div>';
    if(st===total-1)t+='<div style="color:var(--sw-fg2)">全部窗口看完，答案 = '+L.ans+'</div>';
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

把過程寫成表格：

| 視窗 | 子串 | `kinds` | 是否有效 | `strCnt` 之後 | `ans` |
|---|---|---|---|---|---|
| `[0,2]` | `aab` | 2 | 是 | `aab:1` | 1 |
| `[1,3]` | `aba` | 2 | 是 | `aab:1, aba:1` | 1 |
| `[2,4]` | `bab` | 2 | 是 | `aab:1, aba:1, bab:1` | 1 |
| `[3,5]` | `abc` | 3 | 否（超過 2） | 不變 | 1 |
| `[4,6]` | `bca` | 3 | 否（超過 2） | 不變 | 1 |
| `[5,7]` | `caa` | 2 | 是 | `…, caa:1` | 1 |
| `[6,8]` | `aab` | 2 | 是 | `aab:2, …` | **2** |

最後 `ans = 2`，與範例 1 一致。

範例 2 `s = "aaaa"`、`minSize = 3`：視窗是 `[0,2]` 和 `[1,3]`，都是 `"aaa"`，只有 1 種字母，`strCnt["aaa"] = 2`。題目允許重疊，所以答案是 2。

### 解法（灵茶山艾府）

```java
class Solution {
    public int maxFreq(String S, int maxLetters, int minSize, int maxSize) {
        char[] s = S.toCharArray();
        Map<String, Integer> strCnt = new HashMap<>();
        int[] charCnt = new int[26];
        int kinds = 0;
        int ans = 0;

        for (int i = 0; i < s.length; i++) {
            // 1. 進入視窗
            int in = s[i] - 'a';
            if (charCnt[in] == 0) {
                kinds++;
            }
            charCnt[in]++;

            int left = i - minSize + 1;
            if (left < 0) { // 視窗大小不足 minSize
                continue;
            }

            // 2. 更新統計量
            if (kinds <= maxLetters) {
                String subStr = S.substring(left, left + minSize);
                int cnt = strCnt.merge(subStr, 1, Integer::sum); // cnt = ++strCnt[subStr];
                ans = Math.max(ans, cnt);
            }

            // 3. 離開視窗，為下一個迴圈做準備
            int out = s[left] - 'a';
            charCnt[out]--;
            if (charCnt[out] == 0) {
                kinds--;
            }
        }

        return ans;
    }
}
```

幾個細節：

* `maxSize` 參數完全沒用到，這就是第一步推論的結果。
* 進入視窗時先判斷 `charCnt[in] == 0` 再加一；離開視窗時先減一再判斷 `== 0`，順序反了 `kinds` 就會算錯。
* `strCnt.merge(subStr, 1, Integer::sum)` 等價於 `++strCnt[subStr]`，並直接回傳更新後的次數。
* 只有 `kinds <= maxLetters` 的視窗才把子串放進 `strCnt`，不合格的子串完全不計。

### 複雜度分析

* 時間複雜度：O((n − minSize) · minSize)，其中 n 是 `s` 的長度。有 `n − minSize + 1` 個視窗，每個視窗取子串並計算雜湊要 O(minSize)。
* 空間複雜度：O((n − minSize) · minSize)。雜湊表最多存 `n − minSize + 1` 個子串，每個長 `minSize`。
