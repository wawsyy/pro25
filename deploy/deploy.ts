import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedNightlyReflection = await deploy("NightlyReflection", {
    from: deployer,
    log: true,
  });

  console.log(`NightlyReflection contract: `, deployedNightlyReflection.address);
};
export default func;
func.id = "deploy_nightlyReflection"; // id required to prevent reexecution
func.tags = ["NightlyReflection"];

