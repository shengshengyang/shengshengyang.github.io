---
title: Two pointers - one input, opposite ends
date: 2024-02-14 00:14:16
tags:
- [LeetCode]
- [data structure]
- [algorithm]
category:
- [LeetCode]
index_img: ../image/banner/leetcode_index.jpeg
banner_img: ../image/banner/LeetCode_banner.jpeg
---
回cheatsheet: [leetcode-cheatsheet](../../../../2024/02/13/leetcode-cheatsheet)
## 15. 3Sum
### 題目描述

給你一個包含`n`個整數的陣列`nums`，判斷`nums`中是否存在三個元素`a，b，c`，使得`a + b + c = 0`？請你找出所有滿足條件且不重複的三元組。

### 解法

通常透過排序加上雙指針來解決

```
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums); // 對數組進行排序，使之後的雙指針遍歷更有效率且易於去重
    List<List<Integer>> res = new ArrayList<>(); // 初始化一個列表來儲存符合條件的三元組結果
    // 遍歷數組中的每個元素，但只有當元素小於等於0時才繼續，因為三數之和等於0且已排序，超過0則不可能再找到合適的三元組
    for (int i = 0; i < nums.length && nums[i] <= 0; ++i)
        // 如果當前元素是第一個元素，或者當前元素與前一個元素不相同，則處理這個元素，以避免重複的三元組
        if (i == 0 || nums[i - 1] != nums[i]) {
            twoSumII(nums, i, res); // 調用twoSumII方法來尋找與當前元素配對的兩個數字，使得它們的和為0
        }
    return res; // 返回所有找到的三元組列表
}

void twoSumII(int[] nums, int i, List<List<Integer>> res) {
    int lo = i + 1, hi = nums.length - 1; // 初始化兩個指針，lo指向當前元素的下一個元素，hi指向數組的最後一個元素
    while (lo < hi) { // 當lo小於hi時，循環繼續
        int sum = nums[i] + nums[lo] + nums[hi]; // 計算當前三個數字的和
        if (sum < 0) { // 如果和小於0，則將lo向右移動以增大和
            ++lo;
        } else if (sum > 0) { // 如果和大於0，則將hi向左移動以減小和
            --hi;
        } else { // 如果和等於0，則找到了一組有效的三元組
            res.add(Arrays.asList(nums[i], nums[lo++], nums[hi--])); // 將這三個數字作為一個列表添加到結果中，同時移動lo和hi以尋找下一組可能的三元組
            // 移動lo之後，檢查並跳過所有重複的元素，以避免添加重複的三元組到結果列表中
            while (lo < hi && nums[lo] == nums[lo - 1])
                ++lo;
        }
    }
}
```

### 商業邏輯應用

這種算法可以用於數據分析、風險管理等領域，例如在金融市場分析中，尋找影響股票價格的因素組合，或在風險評估中尋找可能導致損失的多種因素。

### 時間複雜度與空間複雜度

* 時間複雜度：O(n^2)，其中n為陣列的長度。

* 空間複雜度：O(log n) 到 O(n)，取決於排序算法的空間複雜度。

## 11. Container With Most Water

### 題目描述

給定一個整數陣列`height`，其中`height[i]`代表點`(i, 0)`和點`(i, height[i])`之間會形成的垂直線。找出其中的兩條線，使得它們與`x`軸共同形成的容器可以容納最多的水。

### 解法

```
class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxArea = 0;
        while (left < right) {
            int width = right - left;
            int h = Math.min(height[left], height[right]);
            maxArea = Math.max(maxArea, width * h);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}
```

### 商業邏輯應用

這種算法可以應用於資源分配和空間優化問題，如在建築設計和貨物包裝領域，通過最大化利用有限空間來增加效率和效益。

### 時間複雜度與空間複雜度

* 時間複雜度：O(n)，其中n為陣列的長度。

* 空間複雜度：O(1)。

## 125. Valid Palindrome

[Valid Palindrome - LeetCode](https://leetcode.com/problems/valid-palindrome/description/)\
給定一個字串，驗證它是否是迴文串，考慮只到字母和數字字符，可以忽略字母的大小寫。

解法思路是設定兩個指針，一個在字串的開始`left`，一個在字串的結尾`right`。移動指針時跳過非字母和數字字符，然後比較`left`和`right`指向的字符是否相等，不等則返回`false`。

```
public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
```

## 167. Two Sum II - Input Array Is Sorted

[Two Sum II - Input Array Is Sorted - LeetCode](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/)

解法思路是設定兩個指針，一個在陣列的開始`left`，一個在陣列的結尾`right`。如果`numbers[left] + numbers[right]`小於`target`，則`left++`；如果大於`target`，則`right--`；相等時，就找到了答案。

```
public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return new int[] { left + 1, right + 1 };
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[] { -1, -1 }; // 沒有找到答案的情況
}
```