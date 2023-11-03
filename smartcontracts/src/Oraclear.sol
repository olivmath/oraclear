// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Aux} from "./Aux.sol";

contract Events {
    event NewRequest(address indexed who);
}

contract Oraclear is Events {
    uint256 MAXUINT = 10_000_000;
    Aux auxiliary;
    uint256 public fake;

    constructor(address aux) {
        auxiliary = Aux(aux);
    }

    function check() external returns (uint256) {
        emit NewRequest(msg.sender);

        sleep();

        return auxiliary.getState();
    }

    function sleep() internal {
        for (uint256 i = 0; i < MAXUINT; i++) {
            fake = i * i;
        }
    }
}
