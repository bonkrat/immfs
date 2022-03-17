import Fastify from "fastify";
import { ethers } from "ethers";
import localhostABI from "./src/contracts/localhost/FileSystem.abi.js";
import localhostAddress from "./src/contracts/localhost/FileSystem.address.js";
import * as IPFS from "ipfs-core";

const fastify = Fastify({
  logger: true,
});

// http://0.0.0.0:8545/
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const fs = new ethers.Contract(localhostAddress, localhostABI, provider);
const node = await IPFS.create();

fastify.get("/:address", async (req) => {
  const files = await fs.getFiles(req.params.address);

  if (files.length === 0) {
    throw new Error("Address does not have files.");
  } else {
    return { files };
  }
});

fastify.get("/:address/:file", async (req) => {
  const files = await fs.getFiles(req.params.address);

  if (files.length === 0) {
    throw new Error("Address does not have files.");
  }

  const file = files.filter((f) => {
    return req.params.file === f.name + "." + f.extension;
  })[0];

  if (file) {
    let data = "";
    const stream = node.cat(file.cid);

    for await (const chunk of stream) {
      data += chunk.toString();
    }

    return data;
  } else {
    throw new Error("File not found.");
  }
});

fastify.listen(3000, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
