// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console2} from "forge-std/Script.sol";
import {Oraclear} from "../src/Oraclear.sol";
import {Aux} from "../src/Aux.sol";

contract Local is Script {
    Oraclear oraclear;
    Aux aux;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80);
        aux = new Aux();
        oraclear = new Oraclear(address(aux));

        console2.log("Aux:      ", address(aux));
        console2.log("Oraclear: ", address(oraclear));
        vm.stopBroadcast();
    }
}
