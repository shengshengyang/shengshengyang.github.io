---
title: java-threads-consumer
date: 2023-12-04 00:32:04
tags:
- [backend]
- [java]
- [thread]
categories:
- [java]
index_img: ../image/banner/java_index.jpg
banner_img: ../image/banner/java_banner_brown.jpg
---
在一般情況下，使用`synchronized` 簡單且安全的選擇，在需要額外控制的情況下，考慮使用 `ReentrantLock`。
### ReentrantLock 特性
- #### 可重入性（Reentrancy）： 
    ReentrantLock 允許同一線程多次獲得鎖，而 synchronized 在同一線程中重複進入同步代碼塊時會自動擁有鎖，這種特性被稱為可重入性。這意味著在 ReentrantLock 中，一個線程可以多次獲得同一把鎖，而在 synchronized 中，同一線程多次進入同一個同步方法或代碼塊時，是不需要重新獲得鎖的。

- #### 嘗試非阻塞地獲得鎖： 
  ReentrantLock 提供了 tryLock() 方法，可以嘗試非阻塞地獲得鎖。這是一個有返回值的方法，可以根據返回值判斷是否成功獲得了鎖。

- #### 可定時地獲得鎖： 
    ReentrantLock 的 tryLock(long timeout, TimeUnit unit) 方法允許嘗試在給定的時間內獲得鎖。這使得在一定時間內無法獲得鎖時，可以進行其他處理。

- #### 公平鎖與非公平鎖： 
    ReentrantLock 可以構建公平鎖（按獲得鎖的順序分配）或非公平鎖（不按獲得鎖的順序分配）。而 synchronized 一般是非公平鎖。

### 範例
> 消費者 與 供貨者， 要有貨才可以給消費者，貨沒了要做補貨
```java
import java.util.LinkedList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Main {

    private static Buffer buffer = new Buffer();

    private static class Buffer {
        private static final int CAPACITY = 1;
        private LinkedList<Integer> queue = new LinkedList<>();
        private static Lock lock = new ReentrantLock();
        private static Condition notEmpty = lock.newCondition();
        private static Condition notFull = lock.newCondition();

        public void write(int value) {
            lock.lock();
            try {
                // 當緩衝區滿時，生產者等待
                while (queue.size() == CAPACITY) {
                    notFull.await();
                }
                // 寫入數據到緩衝區
                queue.offer(value);
                // 喚醒等待中的消費者
                notEmpty.signalAll();
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }

        public int read() {
            lock.lock();
            int value = 0;
            try {
                // 當緩衝區為空時，消費者等待
                while (queue.isEmpty()) {
                    notEmpty.await();
                }
                // 從緩衝區讀取數據
                value = queue.remove();
                // 喚醒等待中的生產者
                notFull.signalAll();
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
                return value;
            }
        }
    }

    private static class Consumer implements Runnable {
        @Override
        public void run() {
            try {
                while (true) {
                    // 消費者從緩衝區讀取數據
                    System.out.println("Consumer reads " + buffer.read());
                    Thread.sleep((int) (Math.random() * 1000));
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private static class Producer implements Runnable {
        @Override
        public void run() {
            try {
                int i = 0;
                while (true) {
                    // 生產者將數據寫入緩衝區
                    System.out.println("Producer writes " + i);
                    buffer.write(i++);
                    Thread.sleep((int) (Math.random() * 1000));
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        // 使用固定大小的線程池
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        // 同時運行生產者和消費者
        executorService.execute(new Producer());
        executorService.execute(new Consumer());
        // 關閉線程池
        executorService.shutdown();
    }
}

```