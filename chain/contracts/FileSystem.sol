//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract FileSystem {
    struct File {
        string name;
        string cid;
        string extension;
    }

    mapping(address => File[]) public files;
    address[] public addresses;

    constructor() {
        console.log("Deploying a FileSystem contract...");
    }

    function addFile(
        string calldata _name,
        string calldata _cid,
        string calldata _extension
    ) external {
        files[msg.sender].push(File(_name, _cid, _extension));
    }

    function getFiles(address _addr) public view returns (File[] memory) {
        return files[_addr];
    }
}
