// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

library GameConstants {
    uint8 public constant NRGY = 0;
    uint8 public constant CRNCY = 1;
    uint8 public constant MONSTER_NRGY_RATE = 5;
    uint8 public constant MAX_DAILY_NRGY = MONSTER_NRGY_RATE * 10;
    uint8 public constant PACK_PRICE = 3;
    uint8 public constant PACK_SIZE = 3;
    uint8 public constant CRNCY_WIN_AMOUNT = 100;
}