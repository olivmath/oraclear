// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Oraclear, Events} from "../src/Oraclear.sol";
import {Aux} from "../src/Aux.sol";
import {BaseSetup} from "./BaseSetup.t.sol";

contract OraclearTest is BaseSetup, Events {
    function setUp() public override {
        BaseSetup.setUp();
    }

    function test_oraclear() public {
        assertEq(0, aux.getState());
        aux.updateState(654);
        assertEq(654, aux.getState());

        vm.expectEmit(false, false, false, true);
        emit NewRequest(msg.sender);
        assertEq(654, oraclear.check());
    }
}
