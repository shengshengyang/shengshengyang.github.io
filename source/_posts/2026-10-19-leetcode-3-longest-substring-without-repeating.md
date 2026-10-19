---
title: LeetCode 3. 無重複字元的最長子串（滑動視窗圖解）
date: 2026-10-19 13:00:00
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

## 3. 無重複字元的最長子串

### 題目描述

給定一個字串 `s`，請你找出其中不含有重複字元的**最長子串**的長度。

**範例 1**

```
輸入：s = "abcabcbb"
輸出：3
解釋：因為無重複字元的最長子串是 "abc"，所以其長度為 3。注意 "bca" 和 "cab" 也是正確答案。
```

**範例 2**

```
輸入：s = "bbbbb"
輸出：1
解釋：因為無重複字元的最長子串是 "b"，所以其長度為 1。
```

**範例 3**

```
輸入：s = "pwwkew"
輸出：3
解釋：因為無重複字元的最長子串是 "wke"，所以其長度為 3。
請注意，答案必須是子串的長度，"pwke" 是一個子序列，不是子串。
```

**限制**

* `0 <= s.length <= 10^5`
* `s` 由英文字母、數字、符號和空格組成

> 本文題解程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/longest-substring-without-repeating-characters/solutions/1959540/xia-biao-zong-suan-cuo-qing-kan-zhe-by-e-iaks/)。思路說明與圖解為自行補充。

### 前置知識：不定長滑動視窗

前幾篇（[2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/)、[2461](/2026/10/19/leetcode-2461-max-sum-distinct-subarrays-k/)、[1423](/2026/10/19/leetcode-1423-maximum-points-from-cards/)）的視窗長度都固定為 `k`。這題的視窗長度不固定：`right` 往右走一格就把新字元加入視窗，如果視窗內出現重複，就不斷把 `left` 往右移（縮小視窗），直到沒有重複為止。

每個字元最多被 `right` 加入一次、被 `left` 移出一次，所以整體是 O(n)。

兩種寫法的差別只在於「怎麼記錄視窗裡有哪些字元」：

* 寫法一：用計數表 `cnt`，記錄每個字元在視窗內出現幾次。**先加入再檢查**，`cnt[c] > 1` 就縮小。
* 寫法二：用集合 `has`，只記錄視窗內有沒有這個字元。**先檢查再加入**，`has[c]` 為真就先縮小，沒有重複才加入。

### 方法一：哈希表（整型陣列計數）

#### 思路

1. `right` 向右枚舉，把 `c = s[right]` 的計數加一。
2. 若 `cnt[c] > 1`，代表視窗內有重複，用 `while` 不斷移出左端字元（`cnt[s[left]]--`、`left++`），直到 `cnt[c] == 1`。
3. 此時視窗內沒有重複，用 `right - left + 1` 更新答案的最大值。

#### 圖解（可互動）

用範例 1：`s = "abcabcbb"`。注意第 3 個字元 `a` 再次出現時，`cnt["a"]` 變成 2，視窗會縮小到把舊的 `a` 移出為止。

{% raw %}
<div class="swv" id="swv-a" style="--sw-n:8">
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
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">s = "abcabcbb"（先加入，有重複再縮小）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>窗口 [left, right]</span>
  <span><i style="border:1.5px solid var(--sw-bad)"></i>造成重複的字元</span>
  <span class="tagi">入 = 剛加入</span>
  <span class="tago">出 = 剛移出</span>
</div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>窗口長度</span><b class="len">0</b></div>
  <div class="m"><span>最長長度 ans</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var MODE=1;
  var root=document.getElementById('swv-a');
  var s="abcabcbb",n=s.length,st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  function copy(o){var r={};for(var x in o)r[x]=o[x];return r}
  function build(){
    var cnt={},l=0,rr=0,ans=0,r,c,rm,prev;
    function snap(o){o.l=l;o.r=rr;o.cnt=copy(cnt);o.ans=ans;steps.push(o)}
    steps.push({k:'init',l:0,r:0,cnt:{},ans:0});
    for(r=0;r<n;r++){
      c=s[r];
      if(MODE===1){
        cnt[c]=(cnt[c]||0)+1;rr=r+1;
        if(cnt[c]===1){prev=ans;ans=Math.max(ans,rr-l);snap({k:'add',i:r,c:c,dup:false,upd:true,prev:prev});continue}
        snap({k:'add',i:r,c:c,dup:true,v:cnt[c]});
        while(cnt[c]>1){
          rm=s[l];cnt[rm]--;if(!cnt[rm])delete cnt[rm];l++;
          var done=cnt[c]<=1;prev=ans;
          if(done)ans=Math.max(ans,rr-l);
          snap({k:'rm',i:l-1,c:c,x:rm,dup:!done,upd:done,prev:prev,pend:r,v:cnt[c]});
        }
      }else{
        rr=r;
        while(cnt[c]){
          rm=s[l];delete cnt[rm];l++;
          snap({k:'rm',i:l-1,c:c,x:rm,dup:!!cnt[c],pend:r});
        }
        cnt[c]=1;rr=r+1;prev=ans;ans=Math.max(ans,rr-l);
        snap({k:'add',i:r,c:c,upd:true,prev:prev});
      }
    }
  }
  build();
  function fmt(o){
    var p=[],x;
    for(x in o)p.push(MODE===1?x+':'+o[x]:x);
    return MODE===1?'{'+p.join(', ')+'}':'{'+p.join(', ')+'}';
  }
  function draw(){
    var L=steps[st],x='',y='',z='',j;
    for(j=0;j<n;j++){
      var tg='';
      if(L.k==='add'&&j===L.i)tg='<span class="tagi">入</span>';
      if(L.k==='rm'&&j===L.i)tg='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      var cl='c'+(j>=L.l&&j<L.r?' win':' dim');
      if(L.k==='add'&&j===L.i)cl+=' in';
      if((L.k==='add'&&L.dup&&j===L.i)||(L.k==='rm'&&L.dup&&j===L.pend))cl+=' dupc';
      y+='<div class="'+cl+'">'+s[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=x;
    q('.r-cells').innerHTML=y;
    q('.r-ix').innerHTML=z;
    q('.len').textContent=L.r-L.l;
    q('.ans').textContent=L.ans;
    q('.stp').textContent='left = '+L.l+'，right = '+(L.r-1)+'（'+(st+1)+' / '+steps.length+'）';
    var t='';
    if(L.k==='init'){
      t='<div>初始化：窗口是空的，ans = 0</div>';
    }else if(MODE===1){
      if(L.k==='add'){
        t='<div>入：s['+L.i+'] = "'+L.c+'"，cnt["'+L.c+'"]++ → '+(L.dup?L.v:1)+'</div>';
        t+=L.dup?'<div>cnt["'+L.c+'"] &gt; 1，窗口內有重複，要縮小窗口</div>':'<div>沒有重複，窗口長度 '+(L.r-L.l)+'；ans = max('+L.prev+', '+(L.r-L.l)+') = <b>'+L.ans+'</b></div>';
      }else{
        t='<div>出：s['+L.i+'] = "'+L.x+'"，cnt["'+L.x+'"]--，left++</div>';
        t+=L.upd?'<div>cnt["'+L.c+'"] 回到 1，重複解除，窗口長度 '+(L.r-L.l)+'；ans = max('+L.prev+', '+(L.r-L.l)+') = <b>'+L.ans+'</b></div>':'<div>cnt["'+L.c+'"] 還是 '+L.v+'，繼續縮小</div>';
      }
    }else{
      if(L.k==='rm'){
        t='<div>要加入 s['+L.pend+'] = "'+L.c+'"，但窗口內已有 "'+L.c+'"（has["'+L.c+'"] = true）</div>';
        t+='<div>出：s['+L.i+'] = "'+L.x+'"，has["'+L.x+'"] = false，left++</div>';
      }else{
        t='<div>窗口內沒有 "'+L.c+'"，入：s['+L.i+'] = "'+L.c+'"，has["'+L.c+'"] = true</div>';
        t+='<div>窗口長度 '+(L.r-L.l)+'；ans = max('+L.prev+', '+(L.r-L.l)+') = <b>'+L.ans+'</b></div>';
      }
    }
    t+='<div>'+(MODE===1?'cnt = ':'has = ')+fmt(L.cnt)+'</div>';
    if(st===steps.length-1)t+='<div style="color:var(--sw-fg2)">right 已走到最右邊，答案 = '+L.ans+'</div>';
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
  draw();
})();
</script>
</div>
{% endraw %}

#### 解法（灵茶山艾府）

```java
class Solution {
    public int lengthOfLongestSubstring(String S) {
        char[] s = S.toCharArray(); // 轉換成 char[] 加快效率（忽略帶來的空間消耗）
        int n = s.length;
        int ans = 0;
        int left = 0;
        int[] cnt = new int[128]; // 也可以用 HashMap<Character, Integer>，這裡為了效率用的陣列

        for (int right = 0; right < n; right++) {
            char c = s[right];
            cnt[c]++;
            while (cnt[c] > 1) { // 視窗內有重複字母
                cnt[s[left]]--; // 移除視窗左端點字母
                left++; // 縮小視窗
            }
            ans = Math.max(ans, right - left + 1); // 更新視窗長度最大值
        }
        return ans;
    }
}
```

#### 複雜度分析

* 時間複雜度：O(n)，其中 n 為 `s` 的長度。注意 `left` 至多增加 n 次，所以整個二重迴圈至多循環 O(n) 次。
* 空間複雜度：O(|Σ|)，其中 |Σ| 為字元集合的大小，本題中字元均為 ASCII 字元，所以 |Σ| ≤ 128。

### 方法二：哈希集合（布林陣列）

#### 思路

視窗內不可能有重複字元，所以其實不需要知道「出現幾次」，只要知道「有沒有」就夠了：

1. `right` 向右枚舉，`c = s[right]`。
2. 加入 `c` 之前先檢查：若視窗內已經有 `c`（`has[c]` 為真），再加入就會重複，所以先用 `while` 不斷移出左端字元（`has[s[left]] = false`、`left++`），直到視窗內沒有 `c`。
3. 加入 `c`（`has[c] = true`），用 `right - left + 1` 更新答案的最大值。

#### 圖解（可互動）

同樣用範例 1。和方法一比較：這裡在遇到重複時，是**先縮小、再加入**，所以窗口不會短暫出現重複字元。

{% raw %}
<div class="swv" id="swv-b" style="--sw-n:8">
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab">s = "abcabcbb"（先縮小到沒重複，再加入）</div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>窗口 [left, right]</span>
  <span><i style="border:1.5px solid var(--sw-bad)"></i>造成重複的字元</span>
  <span class="tagi">入 = 剛加入</span>
  <span class="tago">出 = 剛移出</span>
</div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>窗口長度</span><b class="len">0</b></div>
  <div class="m"><span>最長長度 ans</span><b class="ans">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var MODE=2;
  var root=document.getElementById('swv-b');
  var s="abcabcbb",n=s.length,st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  function copy(o){var r={};for(var x in o)r[x]=o[x];return r}
  function build(){
    var cnt={},l=0,rr=0,ans=0,r,c,rm,prev;
    function snap(o){o.l=l;o.r=rr;o.cnt=copy(cnt);o.ans=ans;steps.push(o)}
    steps.push({k:'init',l:0,r:0,cnt:{},ans:0});
    for(r=0;r<n;r++){
      c=s[r];
      if(MODE===1){
        cnt[c]=(cnt[c]||0)+1;rr=r+1;
        if(cnt[c]===1){prev=ans;ans=Math.max(ans,rr-l);snap({k:'add',i:r,c:c,dup:false,upd:true,prev:prev});continue}
        snap({k:'add',i:r,c:c,dup:true,v:cnt[c]});
        while(cnt[c]>1){
          rm=s[l];cnt[rm]--;if(!cnt[rm])delete cnt[rm];l++;
          var done=cnt[c]<=1;prev=ans;
          if(done)ans=Math.max(ans,rr-l);
          snap({k:'rm',i:l-1,c:c,x:rm,dup:!done,upd:done,prev:prev,pend:r,v:cnt[c]});
        }
      }else{
        rr=r;
        while(cnt[c]){
          rm=s[l];delete cnt[rm];l++;
          snap({k:'rm',i:l-1,c:c,x:rm,dup:!!cnt[c],pend:r});
        }
        cnt[c]=1;rr=r+1;prev=ans;ans=Math.max(ans,rr-l);
        snap({k:'add',i:r,c:c,upd:true,prev:prev});
      }
    }
  }
  build();
  function fmt(o){
    var p=[],x;
    for(x in o)p.push(MODE===1?x+':'+o[x]:x);
    return MODE===1?'{'+p.join(', ')+'}':'{'+p.join(', ')+'}';
  }
  function draw(){
    var L=steps[st],x='',y='',z='',j;
    for(j=0;j<n;j++){
      var tg='';
      if(L.k==='add'&&j===L.i)tg='<span class="tagi">入</span>';
      if(L.k==='rm'&&j===L.i)tg='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      var cl='c'+(j>=L.l&&j<L.r?' win':' dim');
      if(L.k==='add'&&j===L.i)cl+=' in';
      if((L.k==='add'&&L.dup&&j===L.i)||(L.k==='rm'&&L.dup&&j===L.pend))cl+=' dupc';
      y+='<div class="'+cl+'">'+s[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
    }
    q('.r-tag').innerHTML=x;
    q('.r-cells').innerHTML=y;
    q('.r-ix').innerHTML=z;
    q('.len').textContent=L.r-L.l;
    q('.ans').textContent=L.ans;
    q('.stp').textContent='left = '+L.l+'，right = '+(L.r-1)+'（'+(st+1)+' / '+steps.length+'）';
    var t='';
    if(L.k==='init'){
      t='<div>初始化：窗口是空的，ans = 0</div>';
    }else if(MODE===1){
      if(L.k==='add'){
        t='<div>入：s['+L.i+'] = "'+L.c+'"，cnt["'+L.c+'"]++ → '+(L.dup?L.v:1)+'</div>';
        t+=L.dup?'<div>cnt["'+L.c+'"] &gt; 1，窗口內有重複，要縮小窗口</div>':'<div>沒有重複，窗口長度 '+(L.r-L.l)+'；ans = max('+L.prev+', '+(L.r-L.l)+') = <b>'+L.ans+'</b></div>';
      }else{
        t='<div>出：s['+L.i+'] = "'+L.x+'"，cnt["'+L.x+'"]--，left++</div>';
        t+=L.upd?'<div>cnt["'+L.c+'"] 回到 1，重複解除，窗口長度 '+(L.r-L.l)+'；ans = max('+L.prev+', '+(L.r-L.l)+') = <b>'+L.ans+'</b></div>':'<div>cnt["'+L.c+'"] 還是 '+L.v+'，繼續縮小</div>';
      }
    }else{
      if(L.k==='rm'){
        t='<div>要加入 s['+L.pend+'] = "'+L.c+'"，但窗口內已有 "'+L.c+'"（has["'+L.c+'"] = true）</div>';
        t+='<div>出：s['+L.i+'] = "'+L.x+'"，has["'+L.x+'"] = false，left++</div>';
      }else{
        t='<div>窗口內沒有 "'+L.c+'"，入：s['+L.i+'] = "'+L.c+'"，has["'+L.c+'"] = true</div>';
        t+='<div>窗口長度 '+(L.r-L.l)+'；ans = max('+L.prev+', '+(L.r-L.l)+') = <b>'+L.ans+'</b></div>';
      }
    }
    t+='<div>'+(MODE===1?'cnt = ':'has = ')+fmt(L.cnt)+'</div>';
    if(st===steps.length-1)t+='<div style="color:var(--sw-fg2)">right 已走到最右邊，答案 = '+L.ans+'</div>';
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
  draw();
})();
</script>
</div>
{% endraw %}

#### 解法（灵茶山艾府）

```java
class Solution {
    public int lengthOfLongestSubstring(String S) {
        char[] s = S.toCharArray(); // 轉換成 char[] 加快效率（忽略帶來的空間消耗）
        int n = s.length;
        int ans = 0;
        int left = 0;
        boolean[] has = new boolean[128]; // 也可以用 HashSet<Character>，這裡為了效率用的陣列

        for (int right = 0; right < n; right++) {
            char c = s[right];
            // 如果視窗內已經包含 c，那麼再加入一個 c 會導致視窗內有重複元素
            // 所以要在加入 c 之前，先移出視窗內的 c
            while (has[c]) { // 視窗內有 c
                has[s[left]] = false;
                left++; // 縮小視窗
            }
            has[c] = true; // 加入 c
            ans = Math.max(ans, right - left + 1); // 更新視窗長度最大值
        }
        return ans;
    }
}
```

#### 複雜度分析

* 時間複雜度：O(n)，其中 n 為 `s` 的長度。`left` 至多增加 n 次，所以整個二重迴圈至多循環 O(n) 次。
* 空間複雜度：O(|Σ|)，本題中字元均為 ASCII 字元，所以 |Σ| ≤ 128。
