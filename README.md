_This is a prototype as a proof-of-concept. Use at your own risk._

# immfs
A prototype of an "immutable file system" on the Ethereum blockchain. 

Users of the application can publish files publicly in a filesystem on the blockchain. Reasons for this may include:
- Public files that should be hosted indefinitely.
- Backups in case of a centralized service downtime.
- Sharing legally-dubious files.
- Web hosting.

# Design
The total package of immfs includes a few different pieces:
- Smart contract for indexing files.
- A gateway for accessing published files.
- A web application for interacting with the smart contracts.


## Smart Contract
The smart contract itself would be extremely simple - just a storage of some simple file data (e.g. name, extension) along with the file's IPFS hash. For example:

```
    struct File {
        string name;
        string cid;
        string extension;
    }

    mapping(address => File[]) public files;
```

Expanding on this would include other filesystem features like directories, symlinks, etc.

Files would need to be hosted on an IPFS node _somewhere_, either by the user, a pinning service, etc.

The contract also provides public methods for reading files by address.

## Gateway
The gateway service is also simple. The main function is a route that takes the filepath to access directories and folders by wallet address. For example, if my wallet address is `0x123` and I published `foo.txt` in my `Documents` directory, requesting `/0x123/Documents/foo.txt` would return the file.

## Web Application
The web application serves to purposes: publishing files to the chain and interacting with the public file system. It provides a Dropbox/Google Drive/iCloud experience for public files in the system.

### Publishing files
When users add files through the application they are given the option to commit them to the chain. If approved the application generates the IPFS hashes of the files and generates the contract parameters for the blockchain transaction.  Once the user approves the transaction, pays fees and the transaciton is complete the files will be listed publicly.

### Navigating the filesystem
The application provides UI to navigate the files in the filesystem a là Dropbox/Google Drive/iCloud.

# Limitations
Halted progress for now as it is prohibitively expensive to publish anything onto the blockchain. May start again when EVM-compatible rollup chains are available, such as Loopring, zkSync, etc.

# Stack
* Blockchain
  * Hardhat
  * Solidity
* Gateway 
  * Node.js
  * Fastify
  * IPFS
* Web Application
  * React
  * useDapp
  * ethers
