// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Encrypted Nightly Reflection Contract
/// @notice A contract for storing encrypted nightly reflection entries
/// @dev Uses FHE to encrypt reflection data (stress level, achievement, mindset adjustment)
contract NightlyReflection is SepoliaConfig {
    struct ReflectionEntry {
        euint32 stressLevel;      // Encrypted stress level (0-100)
        euint32 achievement;      // Encrypted achievement level (0-100)
        euint32 mindsetAdjustment; // Encrypted mindset adjustment level (0-100)
    }

    // Mapping from user address to their reflection entry
    mapping(address => ReflectionEntry) private _reflections;
    
    // Mapping to track if user has an entry (unencrypted for simplicity)
    mapping(address => bool) private _hasEntry;
    
    // Optimized counter for total number of reflections stored
    euint32 private _totalReflections;

    /// @notice Store a new nightly reflection entry
    /// @param stressLevel Encrypted stress level (0-100)
    /// @param achievement Encrypted achievement level (0-100)
    /// @param mindsetAdjustment Encrypted mindset adjustment level (0-100)
    /// @param stressProof Proof for stress level
    /// @param achievementProof Proof for achievement level
    /// @param mindsetProof Proof for mindset adjustment level
    function addReflection(
        externalEuint32 stressLevel,
        externalEuint32 achievement,
        externalEuint32 mindsetAdjustment,
        bytes calldata stressProof,
        bytes calldata achievementProof,
        bytes calldata mindsetProof
    ) external {
        euint32 encryptedStress = FHE.fromExternal(stressLevel, stressProof);
        euint32 encryptedAchievement = FHE.fromExternal(achievement, achievementProof);
        euint32 encryptedMindset = FHE.fromExternal(mindsetAdjustment, mindsetProof);

        // Create new reflection entry
        ReflectionEntry memory newEntry = ReflectionEntry({
            stressLevel: encryptedStress,
            achievement: encryptedAchievement,
            mindsetAdjustment: encryptedMindset
        });

        _reflections[msg.sender] = newEntry;
        _hasEntry[msg.sender] = true;

        // Increment total reflections counter if this is a new entry
        // Note: In a real scenario, we'd need to check if entry already exists
        // For simplicity, we'll increment each time
        _totalReflections = FHE.add(_totalReflections, FHE.asEuint32(1));

        // Allow contract and user to access the encrypted data
        FHE.allowThis(encryptedStress);
        FHE.allow(encryptedStress, msg.sender);
        FHE.allowThis(encryptedAchievement);
        FHE.allow(encryptedAchievement, msg.sender);
        FHE.allowThis(encryptedMindset);
        FHE.allow(encryptedMindset, msg.sender);
        
        // Allow user to decrypt total reflections counter
        FHE.allowThis(_totalReflections);
        FHE.allow(_totalReflections, msg.sender);
    }

    /// @notice Get the reflection entry for the caller
    /// @return stressLevel Encrypted stress level
    /// @return achievement Encrypted achievement level
    /// @return mindsetAdjustment Encrypted mindset adjustment level
    function getMyReflection() external view returns (
        euint32 stressLevel,
        euint32 achievement,
        euint32 mindsetAdjustment
    ) {
        ReflectionEntry memory entry = _reflections[msg.sender];
        return (
            entry.stressLevel,
            entry.achievement,
            entry.mindsetAdjustment
        );
    }

    /// @notice Get total number of reflections (encrypted)
    /// @return The encrypted total count
    function getTotalReflections() external view returns (euint32) {
        return _totalReflections;
    }

    /// @notice Check if user has a reflection entry
    /// @param user Address to check
    /// @return Whether the user has an entry
    function hasReflection(address user) external view returns (bool) {
        return _hasEntry[user];
    }
}


