import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Tutorial: Deploy and Interact Locally (--network localhost)
 * ===========================================================
 *
 * 1. From a separate terminal window:
 *
 *   npx hardhat node
 *
 * 2. Deploy the NightlyReflection contract
 *
 *   npx hardhat --network localhost deploy
 *
 * 3. Interact with the NightlyReflection contract
 *
 *   npx hardhat --network localhost task:get-reflection
 *   npx hardhat --network localhost task:add-reflection --stress 75 --achievement 60 --mindset 80
 *
 *
 * Tutorial: Deploy and Interact on Sepolia (--network sepolia)
 * ===========================================================
 *
 * 1. Deploy the NightlyReflection contract
 *
 *   npx hardhat --network sepolia deploy
 *
 * 2. Interact with the NightlyReflection contract
 *
 *   npx hardhat --network sepolia task:get-reflection
 *   npx hardhat --network sepolia task:add-reflection --stress 75 --achievement 60 --mindset 80
 *
 */

/**
 * Example:
 *   - npx hardhat --network localhost task:address
 *   - npx hardhat --network sepolia task:address
 */
task("task:address", "Prints the NightlyReflection address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;

  const nightlyReflection = await deployments.get("NightlyReflection");

  console.log("NightlyReflection address is " + nightlyReflection.address);
});

/**
 * Example:
 *   - npx hardhat --network localhost task:get-reflection
 *   - npx hardhat --network sepolia task:get-reflection
 */
task("task:get-reflection", "Calls the getMyReflection() function of NightlyReflection Contract")
  .addOptionalParam("address", "Optionally specify the NightlyReflection contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const NightlyReflectionDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("NightlyReflection");
    console.log(`NightlyReflection: ${NightlyReflectionDeployment.address}`);

    const signers = await ethers.getSigners();

    const nightlyReflectionContract = await ethers.getContractAt("NightlyReflection", NightlyReflectionDeployment.address);

    const reflection = await nightlyReflectionContract.connect(signers[0]).getMyReflection();
    
    if (reflection.stressLevel === ethers.ZeroHash) {
      console.log("No reflection entry found for this address");
      return;
    }

    const clearStress = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      reflection.stressLevel,
      NightlyReflectionDeployment.address,
      signers[0],
    );
    
    const clearAchievement = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      reflection.achievement,
      NightlyReflectionDeployment.address,
      signers[0],
    );
    
    const clearMindset = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      reflection.mindsetAdjustment,
      NightlyReflectionDeployment.address,
      signers[0],
    );

    console.log(`Stress Level: ${clearStress}`);
    console.log(`Achievement Level: ${clearAchievement}`);
    console.log(`Mindset Adjustment: ${clearMindset}`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:add-reflection --stress 75 --achievement 60 --mindset 80
 *   - npx hardhat --network sepolia task:add-reflection --stress 75 --achievement 60 --mindset 80
 */
task("task:add-reflection", "Calls the addReflection() function of NightlyReflection Contract")
  .addOptionalParam("address", "Optionally specify the NightlyReflection contract address")
  .addParam("stress", "The stress level (0-100)")
  .addParam("achievement", "The achievement level (0-100)")
  .addParam("mindset", "The mindset adjustment level (0-100)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const stress = parseInt(taskArguments.stress);
    const achievement = parseInt(taskArguments.achievement);
    const mindset = parseInt(taskArguments.mindset);

    if (!Number.isInteger(stress) || stress < 0 || stress > 100) {
      throw new Error(`Argument --stress must be an integer between 0 and 100`);
    }
    if (!Number.isInteger(achievement) || achievement < 0 || achievement > 100) {
      throw new Error(`Argument --achievement must be an integer between 0 and 100`);
    }
    if (!Number.isInteger(mindset) || mindset < 0 || mindset > 100) {
      throw new Error(`Argument --mindset must be an integer between 0 and 100`);
    }

    await fhevm.initializeCLIApi();

    const NightlyReflectionDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("NightlyReflection");
    console.log(`NightlyReflection: ${NightlyReflectionDeployment.address}`);

    const signers = await ethers.getSigners();

    const nightlyReflectionContract = await ethers.getContractAt("NightlyReflection", NightlyReflectionDeployment.address);

    // Encrypt the values
    const encryptedStress = await fhevm
      .createEncryptedInput(NightlyReflectionDeployment.address, signers[0].address)
      .add32(stress)
      .encrypt();

    const encryptedAchievement = await fhevm
      .createEncryptedInput(NightlyReflectionDeployment.address, signers[0].address)
      .add32(achievement)
      .encrypt();

    const encryptedMindset = await fhevm
      .createEncryptedInput(NightlyReflectionDeployment.address, signers[0].address)
      .add32(mindset)
      .encrypt();

    const tx = await nightlyReflectionContract
      .connect(signers[0])
      .addReflection(
        encryptedStress.handles[0],
        encryptedAchievement.handles[0],
        encryptedMindset.handles[0],
        encryptedStress.inputProof,
        encryptedAchievement.inputProof,
        encryptedMindset.inputProof
      );
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    console.log(`NightlyReflection addReflection(stress=${stress}, achievement=${achievement}, mindset=${mindset}) succeeded!`);
  });

