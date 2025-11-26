import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { NightlyReflection, NightlyReflection__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("NightlyReflection")) as NightlyReflection__factory;
  const nightlyReflectionContract = (await factory.deploy()) as NightlyReflection;
  const nightlyReflectionContractAddress = await nightlyReflectionContract.getAddress();

  return { nightlyReflectionContract, nightlyReflectionContractAddress };
}

describe("NightlyReflection", function () {
  let signers: Signers;
  let nightlyReflectionContract: NightlyReflection;
  let nightlyReflectionContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ nightlyReflectionContract, nightlyReflectionContractAddress } = await deployFixture());
  });

  it("should have no reflection entry after deployment", async function () {
    const hasReflection = await nightlyReflectionContract.hasReflection(signers.alice.address);
    expect(hasReflection).to.eq(false);
  });

  it("should add a reflection entry", async function () {
    const stressLevel = 75;
    const achievement = 60;
    const mindsetAdjustment = 80;

    // Encrypt stress level
    const encryptedStress = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(stressLevel)
      .encrypt();

    // Encrypt achievement
    const encryptedAchievement = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(achievement)
      .encrypt();

    // Encrypt mindset adjustment
    const encryptedMindset = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(mindsetAdjustment)
      .encrypt();

    // Add reflection
    const tx = await nightlyReflectionContract
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

    // Check if reflection exists
    const hasReflection = await nightlyReflectionContract.hasReflection(signers.alice.address);
    expect(hasReflection).to.eq(true);
  });

  it("should retrieve and decrypt reflection values", async function () {
    const stressLevel = 50;
    const achievement = 70;
    const mindsetAdjustment = 65;

    // Encrypt values
    const encryptedStress = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(stressLevel)
      .encrypt();

    const encryptedAchievement = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(achievement)
      .encrypt();

    const encryptedMindset = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(mindsetAdjustment)
      .encrypt();

    // Add reflection
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

    // Get reflection
    const reflection = await nightlyReflectionContract.connect(signers.alice).getMyReflection();

    // Decrypt values
    const clearStress = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      reflection.stressLevel,
      nightlyReflectionContractAddress,
      signers.alice,
    );

    const clearAchievement = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      reflection.achievement,
      nightlyReflectionContractAddress,
      signers.alice,
    );

    const clearMindset = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      reflection.mindsetAdjustment,
      nightlyReflectionContractAddress,
      signers.alice,
    );

    expect(clearStress).to.eq(stressLevel);
    expect(clearAchievement).to.eq(achievement);
    expect(clearMindset).to.eq(mindsetAdjustment);
  });

  it("should increment total reflections counter", async function () {
    const stressLevel = 40;
    const achievement = 50;
    const mindsetAdjustment = 60;

    // Get initial total (may be uninitialized)
    const initialTotal = await nightlyReflectionContract.getTotalReflections();
    let clearInitialTotal = BigInt(0);
    
    // Only decrypt if initialized (not ZeroHash)
    if (initialTotal !== ethers.ZeroHash) {
      clearInitialTotal = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        initialTotal,
        nightlyReflectionContractAddress,
        signers.alice,
      );
    }

    // Encrypt values
    const encryptedStress = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(stressLevel)
      .encrypt();

    const encryptedAchievement = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(achievement)
      .encrypt();

    const encryptedMindset = await fhevm
      .createEncryptedInput(nightlyReflectionContractAddress, signers.alice.address)
      .add32(mindsetAdjustment)
      .encrypt();

    // Add reflection
    const tx = await nightlyReflectionContract
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

    // Get new total
    const newTotal = await nightlyReflectionContract.getTotalReflections();
    const clearNewTotal = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      newTotal,
      nightlyReflectionContractAddress,
      signers.alice,
    );

    expect(clearNewTotal).to.eq(clearInitialTotal + BigInt(1));
  });
});

