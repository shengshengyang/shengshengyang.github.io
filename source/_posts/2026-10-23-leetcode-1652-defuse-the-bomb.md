---
title: LeetCode 1652. 拆炸彈（環形陣列＋定長滑動視窗圖解）
date: 2026-10-23 10:00:00
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

## 1652. 拆炸彈

### 題目描述

你有一個炸彈需要拆除，時間緊迫！你的情報員會給你一個長度為 `n` 的**循環**陣列 `code` 以及一個密鑰 `k`。

為了獲得正確的密碼，你需要替換掉每一個數字。所有數字會**同時**被替換。

* 如果 `k > 0`，將第 `i` 個數字用**接下來** `k` 個數字之和替換。
* 如果 `k < 0`，將第 `i` 個數字用**之前** `k` 個數字之和替換。
* 如果 `k == 0`，將第 `i` 個數字用 `0` 替換。

由於 `code` 是循環的，`code[n-1]` 下一個元素是 `code[0]`，且 `code[0]` 前一個元素是 `code[n-1]`。

給你**循環**陣列 `code` 和整數密鑰 `k`，請你回傳解密後的結果來拆除炸彈！

**範例 1**

```
輸入：code = [5,7,1,4], k = 3
輸出：[12,10,16,13]
解釋：每個數字都被接下來 3 個數字之和替換。
解密後的密碼為 [7+1+4, 1+4+5, 4+5+7, 5+7+1]。注意到陣列是循環連接的。
```

**範例 2**

```
輸入：code = [1,2,3,4], k = 0
輸出：[0,0,0,0]
解釋：當 k 為 0 時，所有數字都被 0 替換。
```

**範例 3**

```
輸入：code = [2,4,9,3], k = -2
輸出：[12,5,6,13]
解釋：解密後的密碼為 [3+9, 2+3, 4+2, 9+4]。
注意到陣列是循環連接的。如果 k 是負數，那麼和為之前的數字。
```

**限制**

* `n == code.length`
* `1 <= n <= 100`
* `1 <= code[i] <= 100`
* `-(n - 1) <= k <= n - 1`

> 本文題解思路與程式碼整理自 LeetCode 題解作者「灵茶山艾府」，[題解連結](https://leetcode.cn/problems/defuse-the-bomb/solutions/2765762/on-ding-chang-hua-dong-chuang-kou-python-y2py/)。圖解與步驟說明為自行補充。

### 前置知識：定長滑動視窗

定長視窗每次右移一格，少一個最左邊的元素、多一個新元素，視窗內的和可以用「加新的、減舊的」在 O(1) 內更新。前面幾篇已經用過，例如 [2841](/2026/10/19/leetcode-2841-max-sum-almost-unique-subarray/)。上一篇 [2134](/2026/10/22/leetcode-2134-min-swaps-group-ones-ii/) 也處理過環形陣列，下標超過 `n − 1` 就取模 `n`。

### 思路

這題的條件看起來有三種（`k > 0`、`k < 0`、`k == 0`），其實可以統一成「一個長度為 `|k|` 的視窗往右滑」。

#### 第一步：每個位置要加總的是哪一段

* `k > 0`：`ans[i]` 是 `i` **後面**緊接著的 `k` 個數字之和，也就是下標 `i + 1 ~ i + k`。
* `k < 0`：`ans[i]` 是 `i` **前面**的 `|k|` 個數字之和，也就是下標 `i − |k| ~ i − 1`。
* `k == 0`：什麼都不加，結果是 0。

因為陣列是循環的，下標超出範圍時取模 `n` 繞回來。

按「下一格」逐格看每個 `ans[i]` 用的是哪一段，也可以切換範例：

{% raw %}
<div class="swv" id="swv-a">
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
.swv .res{background:var(--sw-card);color:var(--sw-fg);border-color:var(--sw-ok)}
.swv .res.todo{opacity:.35;border-color:var(--sw-line)}
</style>
<div class="kb"><span>選一個範例：</span><button type="button" data-c="0">範例 1：k = 3</button><button type="button" data-c="1">範例 3：k = −2</button><button type="button" data-c="2">範例 2：k = 0</button></div>
<div class="ctl">
  <button type="button" data-a="prev">上一格</button>
  <button type="button" data-a="next">下一格</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab lb1"></div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lab">解密結果 ans</div>
<div class="row r-res"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>這一格要加總的窗口（長度 |k|）</span>
  <span><i style="border:1.5px dashed var(--sw-fg2)"></i>目前要被替換的位置 i</span>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-a');
  var cases=[{a:[5,7,1,4],k:3},{a:[2,4,9,3],k:-2},{a:[1,2,3,4],k:0}];
  var ci=0,st=0;
  var q=function(c){return root.querySelector(c)};
  function win(c,i){
    var n=c.a.length,ka=Math.abs(c.k),w=[],j;
    for(j=0;j<ka;j++)w.push(c.k>0?(i+1+j)%n:((i-ka+j)%n+n)%n);
    return w;
  }
  function draw(){
    var c=cases[ci],a=c.a,n=a.length,k=c.k;
    root.style.setProperty('--sw-n',n);
    var W=win(c,st),inw={},j,s=0,x='',y='',z='',r='';
    for(j=0;j<W.length;j++){inw[W[j]]=1;s+=a[W[j]]}
    for(j=0;j<n;j++){
      x+='<div class="ix">'+(j===st?'<span class="tagi">i</span>':'')+'</div>';
      y+='<div class="c'+(inw[j]?' win':' dim')+(j===st?' cp in':'')+'">'+a[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
      var v=0,w2=win(c,j),m;for(m=0;m<w2.length;m++)v+=a[w2[m]];
      r+='<div class="c res'+(j<=st?'':' todo')+'">'+(j<=st?v:'?')+'</div>';
    }
    q('.r-tag').innerHTML=x;q('.r-cells').innerHTML=y;q('.r-ix').innerHTML=z;q('.r-res').innerHTML=r;
    q('.lb1').textContent='code = ['+a.join(',')+']，k = '+k+(k>0?'（取「接下來」k 個）':(k<0?'（取「之前」|k| 個）':'（全部換成 0）'));
    q('.stp').textContent='ans['+st+']（'+(st+1)+' / '+n+'）';
    var t='';
    if(k===0)t='<div>k = 0：窗口長度 |k| = 0，什麼都不加，ans['+st+'] = <b>0</b></div>';
    else{
      var pos=[];for(j=0;j<W.length;j++)pos.push(W[j]);
      t='<div>'+(k>0?'ans['+st+'] = code 的「接下來 '+k+' 個」':'ans['+st+'] = code 的「之前 '+(-k)+' 個」')+'，下標 = ['+pos.join(', ')+']</div>';
      var wrap=false;for(j=1;j<pos.length;j++)if(pos[j]<pos[j-1])wrap=true;
      if(wrap)t+='<div>窗口跨過尾巴，從 code[n−1] 繞回 code[0]（下標取模 n）</div>';
      var parts=[];for(j=0;j<W.length;j++)parts.push(a[W[j]]);
      t+='<div>ans['+st+'] = '+parts.join(' + ')+' = <b>'+s+'</b></div>';
    }
    q('.info').innerHTML=t;
    var b=root.querySelectorAll('.kb button');
    for(j=0;j<b.length;j++)b[j].className=(+b[j].getAttribute('data-c')===ci)?'on':'';
  }
  root.addEventListener('click',function(e){
    var cc=e.target.getAttribute&&e.target.getAttribute('data-c');
    if(cc!==null&&cc!==undefined){ci=+cc;st=0;draw();return}
    var b=e.target.getAttribute&&e.target.getAttribute('data-a');
    if(!b)return;
    var n=cases[ci].a.length;
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

先看範例 1（`k = 3`）：`ans[0]` = 後面 3 個 = `7 + 1 + 4`；`ans[1]` = `1 + 4 + 5`（窗口開始繞回開頭）。

再看範例 3（`k = −2`）：`ans[0]` = 前面 2 個。`0` 的前面要繞回尾巴，所以是 `code[3] + code[2]` = `3 + 9` = 12，和題目寫的 `[3+9, …]` 一致。

#### 第二步：不管 k 的正負，窗口都是向右移動

這題最關鍵的觀察：

> 無論 `k > 0` 還是 `k < 0`，算完 `ans[i]` 再算 `ans[i + 1]` 時，窗口都是**向右移動一格**，只有「第一個窗口」的位置不同，窗口大小都是 `|k|`。

所以只要找到第一個窗口的下標範圍，就可以直接開始滑：

* `k > 0`：`ans[0]` 用的是下標 `1 ~ k`，用左閉右開寫成 `[1, k + 1)`。
* `k < 0`：`ans[0]` 用的是下標 `n − |k| ~ n − 1`（`0` 的前面繞回尾巴），寫成 `[n − |k|, n)`。
* 窗口大小都是 `|k|`。

例如 `code = [3,1,4,1,5,9]`，`k = 3`：

| 要算的 | 窗口 | 怎麼算 |
|---|---|---|
| `ans[0]` | `[1,4,1]` | `1 + 4 + 1 = 6` |
| `ans[1]` | `[4,1,5]` | 在上一個基礎上加 `code[4] = 5`、減 `code[1] = 1`：`6 + 5 − 1 = 10` |
| `ans[2]` | `[1,5,9]` | 加 `code[5] = 9`、減 `code[2] = 4`：`10 + 9 − 4 = 15` |
| `ans[3]` | `[5,9,3]` | 加 `code[6 mod 6] = code[0] = 3`、減 `code[3] = 1`：`15 + 3 − 1 = 17` |
| `ans[4]` | `[9,3,1]` | 加 `code[7 mod 6] = code[1] = 1`、減 `code[4] = 5`：`17 + 1 − 5 = 13` |
| `ans[5]` | `[3,1,4]` | 加 `code[8 mod 6] = code[2] = 4`、減 `code[5] = 9`：`13 + 4 − 9 = 8` |

#### 第三步：用右開端點 r 管理窗口

用 `r` 表示窗口的**右開端點**（窗口是 `[r − |k|, r)`）：

* 第一個窗口：`k > 0` 時 `r = k + 1`；`k < 0` 時 `r = n`。
* 窗口向右滑動：移入的元素下標是 `r mod n`，移出的元素下標是 `(r − |k|) mod n`，然後 `r++`。
* 每一輪先把目前的窗口和 `s` 寫進 `ans[i]`，再更新窗口，為下一輪準備。

`k == 0` 時窗口大小是 0，第一個窗口和是 0，每次移入、移出的是同一個元素（`code[r % n] − code[(r − 0) % n] = 0`），`s` 一直是 0，所以**不需要特判**。

### 圖解（可互動）

下面逐步看 `r`、窗口和 `s` 怎麼變化，上方是 `code`，下方是逐格填入的 `ans`。可以切換 `k = 3`（題解範例）和 `k = −2`（範例 3）。注意：

* 先算第一個窗口，`k > 0` 時是 `[1, k + 1)`，`k < 0` 時是 `[n − |k|, n)`。
* 每一步先把目前的窗口和寫進 `ans[i]`，**再**移入、移出元素。
* `r` 超過 `n` 之後，用 `r % n` 繞回去。

{% raw %}
<div class="swv" id="swv-b">
<div class="kb"><span>選一個範例：</span><button type="button" data-c="0">k = 3（題解範例）</button><button type="button" data-c="1">k = −2（範例 3）</button></div>
<div class="ctl">
  <button type="button" data-a="prev">上一步</button>
  <button type="button" data-a="next">下一步</button>
  <button type="button" data-a="reset">重置</button>
  <span class="stp" style="font-size:13px;color:var(--sw-fg2);margin-left:auto"></span>
</div>
<div class="lab lb1"></div>
<div class="row r-tag"></div>
<div class="row r-cells"></div>
<div class="row r-ix"></div>
<div class="lab">解密結果 ans</div>
<div class="row r-res"></div>
<div class="lg">
  <span><i style="border:1.5px solid var(--sw-accent)"></i>目前窗口</span>
  <span class="tagi">入 = 下一步移入</span>
  <span class="tago">出 = 下一步移出</span>
</div>
<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">
  <div class="m"><span>窗口和 s</span><b class="sum">0</b></div>
  <div class="m"><span>右開端點 r</span><b class="rr">0</b></div>
</div>
<div class="info"></div>
<script>
(function(){
  var root=document.getElementById('swv-b');
  var cases=[{a:[3,1,4,1,5,9],k:3},{a:[2,4,9,3],k:-2}];
  var ci=0,st=0,steps=[];
  var q=function(c){return root.querySelector(c)};
  function build(){
    var c=cases[ci],a=c.a,n=a.length,k=c.k,r=k>0?k+1:n,ka=Math.abs(k),s=0,i,ans=[];
    steps=[];
    for(i=r-ka;i<r;i++)s+=a[i];
    steps.push({init:true,s:s,r:r,ka:ka,ans:[],lo:r-ka,hi:r-1,k:k});
    for(i=0;i<n;i++){
      ans.push(s);
      var inIdx=r%n,outIdx=(r-ka)%n;
      steps.push({init:false,i:i,s:s,r:r,ka:ka,ans:ans.slice(),lo:r-ka,hi:r-1,inIdx:inIdx,outIdx:outIdx,k:k});
      s+=a[inIdx]-a[outIdx];
      r++;
    }
    steps.n=n;
  }
  function draw(){
    var c=cases[ci],a=c.a,n=a.length,L=steps[st],j,x='',y='',z='',res='';
    root.style.setProperty('--sw-n',n);
    var inw={};
    for(j=L.lo;j<=L.hi;j++)inw[j%n]=1;
    for(j=0;j<n;j++){
      var tg='';
      if(!L.init&&j===L.inIdx)tg+='<span class="tagi">入</span>';
      if(!L.init&&j===L.outIdx)tg+='<span class="tago">出</span>';
      x+='<div class="ix">'+tg+'</div>';
      y+='<div class="c'+(inw[j]?' win':' dim')+'">'+a[j]+'</div>';
      z+='<div class="ix">'+j+'</div>';
      res+='<div class="c res'+(j<L.ans.length?'':' todo')+'">'+(j<L.ans.length?L.ans[j]:'?')+'</div>';
    }
    q('.r-tag').innerHTML=x;q('.r-cells').innerHTML=y;q('.r-ix').innerHTML=z;q('.r-res').innerHTML=res;
    q('.lb1').textContent='code = ['+a.join(',')+']，k = '+c.k+'，窗口長度 |k| = '+L.ka+'，第一個窗口 = ['+(L.init?L.lo:steps[1].lo)+', '+((L.init?L.hi:steps[1].hi)+1)+')';
    q('.sum').textContent=L.s;
    q('.rr').textContent=L.r;
    q('.stp').textContent=(st+1)+' / '+steps.length;
    var t='';
    if(L.init){
      t='<div>先算第一個窗口：'+(L.k>0?'k > 0，右開端點 r = k + 1 = '+L.r+'，窗口 [r − |k|, r) = ['+L.lo+', '+(L.hi+1)+')':'k &lt; 0，右開端點 r = n = '+L.r+'，窗口 [r − |k|, r) = ['+L.lo+', '+(L.hi+1)+')')+'</div>';
      t+='<div>窗口和 s = <b>'+L.s+'</b></div>';
    }else{
      t='<div>ans['+L.i+'] = s = <b>'+L.s+'</b></div>';
      t+='<div>窗口右移：入 code[r % n] = code['+L.r+' % '+n+'] = code['+L.inIdx+'] = '+a[L.inIdx]+'，出 code[(r − |k|) % n] = code['+(L.r-L.ka)+' % '+n+'] = code['+L.outIdx+'] = '+a[L.outIdx]+'，s 變成 <b>'+(L.s+a[L.inIdx]-a[L.outIdx])+'</b>，r 變成 '+(L.r+1)+'（給 ans['+(L.i+1)+'] 用）</div>';
    }
    if(st===steps.length-1)t+='<div style="color:var(--sw-fg2)">全部算完：ans = ['+L.ans.join(', ')+']</div>';
    q('.info').innerHTML=t;
    var b=root.querySelectorAll('.kb button');
    for(j=0;j<b.length;j++)b[j].className=(+b[j].getAttribute('data-c')===ci)?'on':'';
  }
  root.addEventListener('click',function(e){
    var cc=e.target.getAttribute&&e.target.getAttribute('data-c');
    if(cc!==null&&cc!==undefined){ci=+cc;st=0;build();draw();return}
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

### 解法（灵茶山艾府）

```java
class Solution {
    public int[] decrypt(int[] code, int k) {
        int n = code.length;
        // 計算第一個視窗的右開端點
        int r = k > 0 ? k + 1 : n;
        k = Math.abs(k);

        // 計算第一個視窗的元素和
        int s = 0;
        for (int i = r - k; i < r; i++) {
            s += code[i];
        }

        int[] ans = new int[n];
        for (int i = 0; i < n; i++) {
            ans[i] = s;
            s += code[r % n] - code[(r - k) % n];
            r++;
        }
        return ans;
    }
}
```

幾個細節：

* **`r` 要在 `k = Math.abs(k)` 之前算**：`r` 需要 `k` 原本的正負，順序反了就錯。
* 計算第一個窗口時，下標 `r − k ~ r − 1` 不用取模：`k > 0` 時範圍是 `1 ~ k`，`k < 0` 時是 `n − |k| ~ n − 1`，都在 `[0, n − 1]` 內。
* 滑動時移入的 `code[r % n]` 要取模；移出的 `code[(r − k) % n]` 也取模，因為這裡 `k` 已經是絕對值，`r − k` 在後面幾輪可能超過 `n`。
* `k == 0` 不用特判，`s` 一直是 0。

### 複雜度分析

* 時間複雜度：O(n)，其中 n 是 `code` 的長度。算第一個窗口最多 O(n)，之後迴圈 `n` 次，每次 O(1)。
* 空間複雜度：O(1)。回傳值不計入。
