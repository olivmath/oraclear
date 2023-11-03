// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Events {
    event NewState(uint256 indexed prev, uint256 indexed current);
}

contract Aux is Events {
    uint256 state;

    constructor() {}

    function updateState(uint256 newState) external {
        emit NewState(state, newState);
        state = newState;
    }

    function getState() external view returns (uint256) {
        return state;
    }
}
