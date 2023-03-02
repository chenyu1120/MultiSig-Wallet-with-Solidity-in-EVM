const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners(); //get the account to deploy the contract

  console.log("Deploying contracts with the account:", deployer.address); 
  
  // We get the multisigwallet contract to deploy
  const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy([deployer.address, "0x400574Ec21d2b85Db782CE66Db0D64DAAF291434"], 2);

  await multiSigWallet.deployed();

  console.log("MultiSigWallet deployed to:", multiSigWallet.address);

  await hre.run("verify:verify", {
    contract: "contracts/MultiSigWallet.sol:MultiSigWallet",
    address: multiSigWallet.address,
    constructorArguments: [
      [deployer.address, "0x400574Ec21d2b85Db782CE66Db0D64DAAF291434"], 2
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); // Calling the function to deploy the contract 
