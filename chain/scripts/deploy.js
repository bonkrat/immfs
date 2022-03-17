const { ethers } = require("hardhat");
const { publish } = require("./publish");
const fs = require("fs");
const R = require("ramda");
const { utils } = require("ethers");
const chalk = require("chalk");

const network = process.env.HARDHAT_NETWORK || "localhost";
const artifactsDir = `artifacts`;

// ABI encodes contract arguments.
// This is useful when you want to manually verify the contracts, for example, on Etherscan.
const abiEncodeArgs = (deployed, contractArgs) => {
  // Don't write ABI encoded args if this does not pass.
  if (
    !contractArgs ||
    !deployed ||
    !R.hasPath(["interface", "deploy"], deployed)
  ) {
    return "";
  }
  const encoded = utils.defaultAbiCoder.encode(
    deployed.interface.deploy.inputs,
    contractArgs
  );
  return encoded;
};

const deploy = async (
  contractName,
  _args = [],
  overrides = {},
  libraries = {}
) => {
  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName, {
    libraries: libraries,
  });
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  const encoded = abiEncodeArgs(deployed, contractArgs);
  fs.writeFileSync(`${artifactsDir}/${contractName}.address`, deployed.address);

  console.log(
    "📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(deployed.address)
  );

  if (!encoded || encoded.length <= 2) return deployed;
  fs.writeFileSync(`${artifactsDir}/${contractName}.args`, encoded.slice(2));

  return deployed;
};

const main = async () => {
  console.log("Deploying FileSystem contract to localhost");

  const fs = await deploy("FileSystem");
  const [owner] = await ethers.getSigners();

  console.log("Adding file for address: ", owner.address);
  await fs
    .connect(owner)
    .addFile("hello", "QmXgZAUWd8yo4tvjBETqzUy3wLx5YRzuDwUQnBwRGrAmAo", "txt");
  await fs.connect(owner).addFile("foobar", "Qm12345", "png");
  await fs.connect(owner).addFile("barbaz", "Qm123456", "mp4");

  await publish(network);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
