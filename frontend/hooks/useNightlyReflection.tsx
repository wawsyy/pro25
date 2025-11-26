"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useAccount, useChainId, useWalletClient, usePublicClient } from "wagmi";
import { ethers } from "ethers";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "./useInMemoryStorage";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { NightlyReflectionAddresses } from "@/abi/NightlyReflectionAddresses";
import { NightlyReflectionABI } from "@/abi/NightlyReflectionABI";

type ReflectionData = {
  stressLevel?: string; // Handle as hex string for userDecrypt
  achievement?: string; // Handle as hex string for userDecrypt
  mindsetAdjustment?: string; // Handle as hex string for userDecrypt
  decryptedStress?: number;
  decryptedAchievement?: number;
  decryptedMindset?: number;
};

// Optimized nightly reflection hook
export const useNightlyReflection = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  const [reflection, setReflection] = useState<ReflectionData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  // Get contract address for current chain
  const contractAddress = useMemo(() => {
    const entry = NightlyReflectionAddresses[chainId.toString() as keyof typeof NightlyReflectionAddresses];
    return entry?.address && entry.address !== ethers.ZeroAddress ? entry.address : undefined;
  }, [chainId]);

  // Convert wallet client to ethers provider for contract calls
  const provider = useMemo(() => {
    if (!walletClient) return undefined;
    return new ethers.BrowserProvider(walletClient as any);
  }, [walletClient]);

  // Get ethers signer
  const signer = useMemo(async () => {
    if (!provider || !address) return undefined;
    return await provider.getSigner();
  }, [provider, address]);

  // FHEVM instance - needs EIP-1193 provider (walletClient implements this)
  const { instance: fhevmInstance, status: fhevmStatus, error: fhevmError } = useFhevm({
    provider: walletClient as any, // walletClient implements EIP-1193 interface
    chainId,
    enabled: !!walletClient && !!chainId,
    initialMockChains: { 31337: "http://localhost:8545" },
  });

  // Log FHEVM status for debugging
  useEffect(() => {
    if (fhevmStatus === "error" && fhevmError) {
      console.warn("FHEVM initialization error:", fhevmError);
      console.warn("FHEVM Relayer may be temporarily unavailable. Please try again later.");
    }
  }, [fhevmStatus, fhevmError]);

  const canRefresh = useMemo(() => {
    return contractAddress && publicClient && address && !isRefreshing;
  }, [contractAddress, publicClient, address, isRefreshing]);

  const canDecrypt = useMemo(() => {
    return (
      contractAddress &&
      fhevmInstance &&
      provider &&
      address &&
      !isRefreshing &&
      !isDecrypting &&
      reflection &&
      (reflection.stressLevel !== undefined || reflection.achievement !== undefined)
    );
  }, [contractAddress, fhevmInstance, provider, address, isRefreshing, isDecrypting, reflection]);

  const refreshReflection = useCallback(async () => {
    if (!contractAddress || !publicClient || !address || isRefreshing) return;

    setIsRefreshing(true);
    setMessage("Fetching reflection...");

    try {
      // Convert viem publicClient to ethers provider
      const provider = new ethers.BrowserProvider(publicClient as any);
      const contract = new ethers.Contract(
        contractAddress,
        NightlyReflectionABI.abi,
        provider
      );

      // First check if user has a reflection entry
      const hasEntry = await contract.hasReflection(address);
      if (!hasEntry) {
        setReflection(null);
        setMessage("No reflection found");
        return;
      }

      // Use callStatic to avoid decoding issues
      const iface = new ethers.Interface(NightlyReflectionABI.abi);
      const data = iface.encodeFunctionData("getMyReflection", []);
      
      // Call the contract directly
      const result = await provider.call({
        to: contractAddress,
        data: data,
      });

      if (!result || result === "0x") {
        setReflection(null);
        setMessage("No reflection data");
        return;
      }

      // Decode the result manually
      const decoded = iface.decodeFunctionResult("getMyReflection", result);
      
      // Handle euint32 return values - they are bytes32 strings
      const getBytesValue = (value: any): string | undefined => {
        if (!value) return undefined;
        
        // Extract bytes string from the decoded value
        let bytesValue: string;
        if (typeof value === 'string') {
          bytesValue = value;
        } else if (value && typeof value === 'object' && 'data' in value) {
          bytesValue = value.data;
        } else {
          return undefined;
        }
        
        // Check if it's zero/empty (96 bytes of zeros for bytes32)
        const zeroBytes32 = '0x' + '0'.repeat(64);
        if (!bytesValue || bytesValue === ethers.ZeroHash || bytesValue === '0x' || bytesValue === zeroBytes32) {
          return undefined;
        }
        
        return bytesValue;
      };

      const stressLevel = getBytesValue(decoded[0]);
      const achievement = getBytesValue(decoded[1]);
      const mindsetAdjustment = getBytesValue(decoded[2]);

      // Only set reflection if at least one value exists
      // Store handles as strings (not bigint) for userDecrypt compatibility
      if (stressLevel || achievement || mindsetAdjustment) {
        setReflection({
          stressLevel: stressLevel || undefined,
          achievement: achievement || undefined,
          mindsetAdjustment: mindsetAdjustment || undefined,
        });
        setMessage("Reflection fetched successfully");
      } else {
        setReflection(null);
        setMessage("No reflection found");
      }
    } catch (error) {
      console.error("Error fetching reflection:", error);
      setMessage("Failed to fetch reflection");
      setReflection(null);
    } finally {
      setIsRefreshing(false);
    }
  }, [contractAddress, publicClient, address, isRefreshing]);

  const decryptReflection = useCallback(async () => {
    if (!contractAddress || !fhevmInstance || !provider || !address || isDecrypting || !reflection) return;

    setIsDecrypting(true);
    setMessage("Decrypting reflection...");

    try {
      const currentSigner = await signer;
      if (!currentSigner) throw new Error("No signer available");

      const sig = await FhevmDecryptionSignature.loadOrSign(
        fhevmInstance,
        [contractAddress as `0x${string}`],
        currentSigner,
        fhevmDecryptionSignatureStorage
      );

      if (!sig) {
        throw new Error("Unable to build FHEVM decryption signature");
      }

      const handles = [];
      let stressLevelHandle: string | undefined;
      let achievementHandle: string | undefined;
      let mindsetHandle: string | undefined;

      // Handles are stored as hex strings
      if (reflection.stressLevel) {
        const handleStr = reflection.stressLevel;
        if (handleStr !== ethers.ZeroHash && handleStr !== '0x' + '0'.repeat(64)) {
          stressLevelHandle = handleStr;
          handles.push({ handle: handleStr, contractAddress });
        }
      }
      
      if (reflection.achievement) {
        const handleStr = reflection.achievement;
        if (handleStr !== ethers.ZeroHash && handleStr !== '0x' + '0'.repeat(64)) {
          achievementHandle = handleStr;
          handles.push({ handle: handleStr, contractAddress });
        }
      }
      
      if (reflection.mindsetAdjustment) {
        const handleStr = reflection.mindsetAdjustment;
        if (handleStr !== ethers.ZeroHash && handleStr !== '0x' + '0'.repeat(64)) {
          mindsetHandle = handleStr;
          handles.push({ handle: handleStr, contractAddress });
        }
      }

      if (handles.length === 0) {
        setMessage("No encrypted data to decrypt");
        return;
      }

      const decrypted = await fhevmInstance.userDecrypt(
        handles,
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp,
        sig.durationDays
      );

      setReflection({
        ...reflection,
        decryptedStress: stressLevelHandle && decrypted[stressLevelHandle] ? Number(decrypted[stressLevelHandle]) : undefined,
        decryptedAchievement: achievementHandle && decrypted[achievementHandle] ? Number(decrypted[achievementHandle]) : undefined,
        decryptedMindset: mindsetHandle && decrypted[mindsetHandle] ? Number(decrypted[mindsetHandle]) : undefined,
      });

      setMessage("Reflection decrypted successfully");
    } catch (error) {
      console.error("Error decrypting reflection:", error);
      setMessage("Failed to decrypt reflection");
    } finally {
      setIsDecrypting(false);
    }
  }, [contractAddress, fhevmInstance, provider, address, signer, reflection, isDecrypting, fhevmDecryptionSignatureStorage]);

  const addReflection = useCallback(async (stress: number, achievement: number, mindset: number) => {
    if (!contractAddress || !fhevmInstance || !provider || !address || isAdding) return;

    setIsAdding(true);
    setMessage("Adding reflection...");

    try {
      const currentSigner = await signer;
      if (!currentSigner) throw new Error("No signer available");

      const contract = new ethers.Contract(
        contractAddress,
        NightlyReflectionABI.abi,
        currentSigner
      );

      // Encrypt values with retry logic
      const encryptWithRetry = async (value: number, retries = 3): Promise<any> => {
        for (let i = 0; i < retries; i++) {
          try {
            return await fhevmInstance
              .createEncryptedInput(contractAddress, address!)
              .add32(value)
              .encrypt();
          } catch (error: any) {
            if (i === retries - 1) throw error;
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            console.log(`Encryption retry ${i + 1}/${retries}...`);
          }
        }
      };

      setMessage("Encrypting stress level...");
      const encryptedStress = await encryptWithRetry(stress);

      setMessage("Encrypting achievement level...");
      const encryptedAchievement = await encryptWithRetry(achievement);

      setMessage("Encrypting mindset adjustment...");
      const encryptedMindset = await encryptWithRetry(mindset);

      // Call contract
      const tx = await contract.addReflection(
        encryptedStress.handles[0],
        encryptedAchievement.handles[0],
        encryptedMindset.handles[0],
        encryptedStress.inputProof,
        encryptedAchievement.inputProof,
        encryptedMindset.inputProof
      );

      setMessage(`Transaction submitted: ${tx.hash}`);
      await tx.wait();
      setMessage("Reflection added successfully");

      // Refresh reflection
      await refreshReflection();
    } catch (error: any) {
      console.error("Error adding reflection:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to add reflection";
      if (error?.message) {
        if (error.message.includes("Relayer didn't response") || error.message.includes("Bad JSON")) {
          errorMessage = "FHEVM Relayer connection failed. Please check your network connection and try again.";
        } else if (error.message.includes("relayerSDK") || error.message.includes("FHEVM")) {
          errorMessage = "FHEVM initialization failed. Please refresh the page and try again.";
        } else if (error.message.includes("user rejected") || error.message.includes("denied")) {
          errorMessage = "Transaction was cancelled by user.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for transaction. Please add more ETH to your wallet.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      setMessage(errorMessage);
      throw error;
    } finally {
      setIsAdding(false);
    }
  }, [contractAddress, fhevmInstance, provider, address, signer, isAdding, refreshReflection]);

  // Auto refresh on mount - only once when contract and address are available
  const hasRefreshedRef = useRef<string | null>(null);
  useEffect(() => {
    const key = `${contractAddress}-${address}`;
    if (canRefresh && hasRefreshedRef.current !== key) {
      hasRefreshedRef.current = key;
      refreshReflection();
    }
  }, [contractAddress, address, canRefresh, refreshReflection]);

  return {
    reflection,
    isRefreshing,
    isDecrypting,
    isAdding,
    canRefresh,
    canDecrypt,
    refreshReflection,
    decryptReflection,
    addReflection,
    message,
    contractAddress,
    isDeployed: !!contractAddress,
    fhevmStatus,
    fhevmError,
  };
};



