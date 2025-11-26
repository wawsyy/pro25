import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { NightlyReflection } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("NightlyReflectionSepolia", function () {
  let signers: Signers;
  let nightlyReflectionContract: NightlyReflection;
  let nightlyReflectionContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const NightlyReflectionDeployment = await deployments.get("NightlyReflection");
      nightlyReflectionContractAddress = NightlyReflectionDeployment.address;
      nightlyReflectionContract = await ethers.getContractAt("NightlyReflection", NightlyReflectionDeployment.address);
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("should add and retrieve a reflection entry", async function () {
    steps = 15;

    this.timeout(4 * 40000);

    const stressLevel = 75;
    const achievement = 60;
    const mindsetAdjustment = 80;

    progress("Encrypting stress level...");
    const encryptedStress = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(stressLevel)
      .encrypt();

    progress("Encrypting achievement level...");
    const encryptedAchievement = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(achievement)
      .encrypt();

    progress("Encrypting mindset adjustment...");
    const encryptedMindset = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(mindsetAdjustment)
      .encrypt();

    progress(
      `Call addReflection() NightlyReflection=${nightlyReflectionContractAddress} signer=${signers.alice.address}...`,
    );
    let tx = await nightlyReflectionContract
      .connect(signers.alice)
      .addReflection(
        encryptedStress.handles[0],
        encryptedAchievement.handles[0],
        encryptedMindset.handles[0],
        encryptedStress.inputProof,
        encryptedAchievement.inputProof,
        encryptedMindset.inputProof
      );
    await tx.wait();

    progress(`Call hasReflection()...`);
    const hasReflection = await nightlyReflectionContract.hasReflection(signers.alice.address);
    progress(`hasReflection()=${hasReflection}`);
    expect(hasReflection).to.eq(true);

    progress(`Call getMyReflection()...`);
    const reflection = await nightlyReflectionContract.connect(signers.alice).getMyReflection();
    
    // Note: reflection now returns 3 values instead of 4 (removed isInitialized)

    progress(`Decrypting stress level...`);
    const clearStress = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      reflection.stressLevel,
      nightlyReflectionContractAddress,
      signers.alice,
    );
    progress(`Clear stress level=${clearStress}`);

    progress(`Decrypting achievement level...`);
    const clearAchievement = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      reflection.achievement,
      nightlyReflectionContractAddress,
      signers.alice,
    );
    progress(`Clear achievement level=${clearAchievement}`);

    progress(`Decrypting mindset adjustment...`);
    const clearMindset = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      reflection.mindsetAdjustment,
      nightlyReflectionContractAddress,
      signers.alice,
    );
    progress(`Clear mindset adjustment=${clearMindset}`);

    expect(clearStress).to.eq(stressLevel);
    expect(clearAchievement).to.eq(achievement);
    expect(clearMindset).to.eq(mindsetAdjustment);
  });
});

