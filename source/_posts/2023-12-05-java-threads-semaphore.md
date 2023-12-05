---
title: java-threads-semaphore
date: 2023-12-05 08:38:00
tags:
- [backend]
- [java]
- [thread]
categories:
- [java]
---
## Semaphore
### 特性

`Semaphore` 是 Java 中的一個同步工具，用於控制同時訪問某個特定資源的執行緒數量。
使用時可以先new 出並設定初始可被使用的憑證數
``` java
Semaphore semaphore = new Semaphore(3);
```

可以透過以下使用憑證
``` java
semaphore.acquire();
```
使用完後可以透過以下釋放資源
``` java
semaphore.release();
```
如果拿不到資源的話就會一直處於等待狀態，所以在使用完畢後務必釋放資源

### 範例
> 生產者與消費者拿取同一buffer
```java
package thread.consumer;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

public class Main {
    // 共享緩衝區
    static int[] buffer = new int[3];
    // 生產者和消費者的索引
    static int producerIndex = 0;
    static int consumerIndex = 0;
    // 三個信號量，分別用於控制緩衝區的存取
    static Semaphore s_lock, n_lock, e_lock;

    // 將數字附加到緩衝區的方法
    private static void append(int i) {
        buffer[producerIndex] = i;
        if (producerIndex != buffer.length - 1) {
            producerIndex++;
        } else {
            producerIndex = 0;
        }
    }

    // 從緩衝區中取出數字的方法
    private static int take() {
        int temp = buffer[consumerIndex];
        if (consumerIndex != buffer.length - 1) {
            consumerIndex++;
        } else {
            consumerIndex = 0;
        }
        return temp;
    }

    // 生產者任務
    private static class ProducerTask implements Runnable {
        int thread_id;

        public ProducerTask(int thread_id) {
            this.thread_id = thread_id;
            System.out.println("Producer #" + thread_id + " launched. ");
        }

        @Override
        public void run() {
            try {
                for (int i = 0; i < 20; i++) {
                    // 生產者先獲取空位信號量
                    e_lock.acquire();
                    // 再獲取互斥信號量
                    s_lock.acquire();
                    int randomInt = (int) (Math.random() * 10);
                    System.out.println("Producer #" + thread_id + " produced " + randomInt);
                    append(randomInt);
                    // 釋放互斥信號量
                    s_lock.release();
                    // 釋放數量信號量，表示有新數據可被消費
                    n_lock.release();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    // 消費者任務
    private static class ConsumerTask implements Runnable {
        int thread_id;

        public ConsumerTask(int thread_id) {
            this.thread_id = thread_id;
            System.out.println("Consumer #" + thread_id + " launched. ");
        }

        @Override
        public void run() {
            try {
                int value_took;
                for (int i = 0; i < 20; i++) {
                    // 消費者先獲取數量信號量
                    n_lock.acquire();
                    // 再獲取互斥信號量
                    s_lock.acquire();
                    value_took = take();
                    System.out.println("Consumer #" + thread_id + " consumed " + value_took);
                    // 釋放互斥信號量
                    s_lock.release();
                    // 釋放空位信號量，表示有空位可供生產
                    e_lock.release();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("Using " + 4 + "threads. ");
        // 初始化信號量
        s_lock = new Semaphore(1);  // 互斥信號量
        n_lock = new Semaphore(0);  // 數量信號量
        e_lock = new Semaphore(buffer.length);  // 空位信號量

        // 創建固定大小的執行緒池
        ExecutorService executorService = Executors.newFixedThreadPool(4);
        for (int i = 0; i < 4; i++) {
            // 根據索引奇偶性判斷是生產者還是消費者，並執行相應的任務
            if (i % 2 == 0) {
                executorService.execute(new ProducerTask(i));
            } else {
                executorService.execute(new ConsumerTask(i));
            }
        }
        executorService.shutdown();
    }
}

```