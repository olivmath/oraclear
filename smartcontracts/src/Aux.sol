// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Aux {
    uint256 state;

    constructor() {}

    function updateState(uint256 newState) external {
        state = newState;
    }

    function getState() external view returns (uint256) {
        return state;
    }
}
