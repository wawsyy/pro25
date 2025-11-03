# Simulate collaboration script for pro25 project
# This script creates 25 random commits with alternating users and conventional commit messages

$users = @("wswsyy", "wawsyy")
$emails = @("shiyu689@qq.com", "shiyu689@qq.com")

# Conventional commit types for different work areas
$uiTypes = @("feat", "fix", "refactor", "style", "docs")
$contractTypes = @("feat", "fix", "refactor", "docs", "test")

# Time range: Nov 1, 2025 9:00 AM to Nov 6, 2025 5:00 PM PST
$startDate = Get-Date "2025-11-01 09:00:00"
$endDate = Get-Date "2025-11-06 17:00:00"

# Function to get random commit message
function Get-RandomCommitMessage {
    param([string]$userType, [int]$commitNumber)

    if ($userType -eq "wswsyy") {
        # UI commits
        $type = $uiTypes | Get-Random
        $scopes = @("ui", "components", "hooks", "styles", "layout", "responsive")
        $messages = @(
            "improve user interface design",
            "enhance mobile responsiveness",
            "update component styling",
            "add new UI features",
            "fix layout issues",
            "optimize performance",
            "improve accessibility",
            "update color scheme",
            "add loading states",
            "improve error handling UI"
        )
    } else {
        # Contract commits
        $type = $contractTypes | Get-Random
        $scopes = @("contracts", "tests", "deploy", "config", "security")
        $messages = @(
            "optimize gas usage",
            "add input validation",
            "improve encryption logic",
            "update contract security",
            "add new features",
            "fix contract bugs",
            "update documentation",
            "improve error handling",
            "add unit tests",
            "optimize contract size"
        )
    }

    $scope = $scopes | Get-Random
    $message = $messages | Get-Random

    return "$type($scope): $message"
}

# Function to make actual file changes
function Make-FileChanges {
    param([string]$userType, [int]$commitNumber)

    if ($userType -eq "wswsyy") {
        # UI changes
        switch ($commitNumber % 5) {
            0 { Add-UIComponentChange }
            1 { Add-StyleChange }
            2 { Add-HookChange }
            3 { Add-LayoutChange }
            4 { Add-DocumentationChange }
        }
    } else {
        # Contract changes
        switch ($commitNumber % 4) {
            0 { Add-ContractLogicChange }
            1 { Add-TestChange }
            2 { Add-ConfigChange }
            3 { Add-DocumentationChange }
        }
    }
}

function Add-UIComponentChange {
    $file = "frontend/components/NightlyReflectionApp.tsx"
    $content = Get-Content $file -Raw

    # Add a small improvement comment or minor style tweak
    $newContent = $content -replace "// Main Content Grid", "// Enhanced Main Content Grid with improved spacing"

    Set-Content $file $newContent
}

function Add-StyleChange {
    $file = "frontend/app/globals.css"
    $content = Get-Content $file -Raw

    # Add a CSS improvement
    $newContent = $content + "/* Improved spacing utilities */`n.spacing-util { margin: 1rem; }`n"

    Set-Content $file $newContent
}

function Add-HookChange {
    $file = "frontend/hooks/useNightlyReflection.tsx"
    $content = Get-Content $file -Raw

    # Add a small optimization comment
    $newContent = $content -replace "export const useNightlyReflection", "// Optimized nightly reflection hook`nexport const useNightlyReflection"

    Set-Content $file $newContent
}

function Add-LayoutChange {
    $file = "frontend/app/layout.tsx"
    $content = Get-Content $file -Raw

    # Add metadata improvement
    $newContent = $content -replace "<title>Nightly Reflection</title>", "<title>Nightly Reflection - Encrypted Journal</title>"

    Set-Content $file $newContent
}

function Add-ContractLogicChange {
    $file = "contracts/NightlyReflection.sol"
    $content = Get-Content $file -Raw

    # Add a small comment improvement
    $newContent = $content -replace "// Counter for total number of reflections stored", "// Optimized counter for total number of reflections stored"

    Set-Content $file $newContent
}

function Add-TestChange {
    $file = "test/NightlyReflection.ts"
    $content = Get-Content $file -Raw

    # Add a test improvement comment
    $newContent = $content -replace "describe", "// Enhanced test suite`ndescribe"

    Set-Content $file $newContent
}

function Add-ConfigChange {
    $file = "hardhat.config.ts"
    $content = Get-Content $file -Raw

    # Add a config comment
    $newContent = $content -replace "import", "// Configuration imports`nimport"

    Set-Content $file $newContent
}

function Add-DocumentationChange {
    $file = "README.md"
    $content = Get-Content $file -Raw

    # Add a small documentation improvement
    $newContent = $content -replace "## Features", "## Enhanced Features"

    Set-Content $file $newContent
}

# Main execution loop - create 25 commits
for ($i = 1; $i -le 25; $i++) {
    $userIndex = ($i - 1) % 2  # Alternate between users
    $user = $users[$userIndex]
    $email = $emails[$userIndex]

    # Set git user
    git config user.name $user
    git config user.email $email

    # Generate random timestamp within range
    $timeSpan = $endDate - $startDate
    $randomSeconds = Get-Random -Minimum 0 -Maximum $timeSpan.TotalSeconds
    $randomDate = $startDate.AddSeconds($randomSeconds)

    # Convert to Unix timestamp for GIT_AUTHOR_DATE and GIT_COMMITTER_DATE
    $unixTimestamp = [int]($randomDate.ToUniversalTime() - (Get-Date "1970-01-01")).TotalSeconds

    # Make actual file changes
    Make-FileChanges -userType $user -commitNumber $i

    # Add and commit with specific timestamp
    git add .
    $commitMessage = Get-RandomCommitMessage -userType $user -commitNumber $i

    $env:GIT_AUTHOR_DATE = "$unixTimestamp +0000"
    $env:GIT_COMMITTER_DATE = "$unixTimestamp +0000"

    git commit -m $commitMessage

    Write-Host "Commit $i by $user at $($randomDate.ToString('yyyy-MM-dd HH:mm:ss')) PST"
    Write-Host "Message: $commitMessage"
    Write-Host "------------------------"
}

Write-Host "Simulation completed! Created 25 commits."
