// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

contract PseudoRandomNumbers {

    uint256 nonce;

    function getRandomNumbers(uint32 numWords) public returns (uint[] memory) {
        uint[] memory nums = new uint256[](numWords);
        for (uint32 i; i < numWords; i++) {
            nums[i] = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce)));
            nonce++;
        }
        return nums;
    }

}