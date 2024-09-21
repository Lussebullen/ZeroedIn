// Import ethers from Hardhat
const hre = require("hardhat");

async function main() {
  // Get the contract to deploy
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");

  // Deploy the contract
  const crowdFunding = await CrowdFunding.deploy();

  // Wait for the deployment to be mined
  await crowdFunding.waitForDeployment();

  console.log("crowdFunding deployed to:", await crowdFunding.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
