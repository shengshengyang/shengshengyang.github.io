---
title: java-threads-collaboration
tags:
- [backend]
- [java]
- [thread]
categories:
- [java]
date: 2023-12-03 00:40:56
---
java中使用multi threads 時，會常發生兩個方法需要用到同一個資源的狀況，若沒有處理好就會造成`race condition` 
要避免可以透過劃分`Critical Eegion` 來達成，要進入之前先用 `Lock` 上鎖，上鎖期前所有thread 都無法訪問，直到結束後再做 `unlock`




### java condition

> 假設兩個thread 同時在同一個帳戶領錢，並且必須確保領錢時裡面錢夠，否則需通知重新嘗試，直到要領的錢足夠為止。
```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Main {

    private static Account account = new Account();

    private static class Account {
        // fields
        private int balance = 0;
        private static Lock lock = new ReentrantLock();
        private static Condition newDeposit = lock.newCondition();

        public int getBalance() {
            return this.balance;
        }

        public void deposit(int amount) {
            lock.lock();
            balance += amount;
            System.out.println("Deposit $" + amount + ", the remaining balance is " + getBalance());
            newDeposit.signalAll();
            lock.unlock();
        }

        public void withdraw(int amount) {
            lock.lock();
            try {
                while (balance < amount) {
                    System.out.println("Try to withdraw " + amount + ", but we are waiting for a deposit");
                    newDeposit.await();
                }
                balance -= amount;
                System.out.println("Withdraw " + amount + ", the remaining balance is " + getBalance());
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                 lock.unlock();
            }
        }
    }
    //不斷存錢
    public static class DepositTask implements Runnable {
        @Override
        public void run() {
            try {
                while (true) {
                    account.deposit((int) (Math.random() * 20) + 5);
                    Thread.sleep(1000);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static class WithdrawTask implements Runnable {

        @Override
        public void run()  {
            while (true) {
                account.withdraw((int) (Math.random() * 20) + 5);
            }
        }
    }




    public static void main(String[]args){
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        executorService.execute(new DepositTask());
        executorService.execute(new WithdrawTask());
        executorService.shutdown();
    }
}
```