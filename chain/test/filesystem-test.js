const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FileSystem", function () {
  let owner, addr1, addrs;

  beforeEach(async () => {
    [owner, addr1, ...addrs] = await ethers.getSigners();
  });

  it("should add files for the msg sender", async function () {
    const FileSystem = await ethers.getContractFactory("FileSystem");
    const fs = await FileSystem.deploy();
    await fs.deployed();
    await fs.connect(owner).addFile("my File", "Qm12345", "png");

    expect(
      await fs.connect(owner).getFiles(owner.address)
    ).to.deep.have.same.members([["my File", "Qm12345", "png"]]);
  });
});
