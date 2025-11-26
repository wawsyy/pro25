# Vercel 部署说明

## 前置要求

1. **WalletConnect Project ID**
   - 访问 https://cloud.walletconnect.com/ 创建项目
   - 获取 Project ID

2. **确保 ABI 文件已提交**
   - `frontend/abi/NightlyReflectionABI.ts`
   - `frontend/abi/NightlyReflectionAddresses.ts`
   - 这些文件需要在构建时存在

## 部署步骤

### 1. 在 Vercel 中导入项目

- 访问 https://vercel.com
- 点击 "New Project"
- 导入你的 Git 仓库
- **重要**: 设置 Root Directory 为 `pro25/frontend`

### 2. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### 3. 构建配置

Vercel 会自动检测 Next.js 项目，但请确保：

- **Framework Preset**: Next.js
- **Root Directory**: `pro25/frontend`
- **Build Command**: `npm run build` (自动)
- **Output Directory**: `.next` (自动)
- **Install Command**: `npm install` (自动)

### 4. 部署

点击 "Deploy" 按钮，Vercel 会自动：

1. 安装依赖
2. 运行 `npm run genabi` (在 build 脚本中)
3. 运行 `next build`
4. 部署应用

## 注意事项

### FHEVM 要求

应用需要以下 HTTP 头（已在 `vercel.json` 和 `next.config.ts` 中配置）：

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

这些头是 FHEVM 的 SharedArrayBuffer 支持所必需的。

### 合约地址

确保 `frontend/abi/NightlyReflectionAddresses.ts` 中包含正确的 Sepolia 测试网合约地址。

### 构建时的 ABI 生成

在 Vercel 构建时，如果 `deployments` 目录不存在，脚本会尝试使用已存在的 ABI 文件。确保这些文件已提交到 Git。

## 故障排除

### 构建失败：找不到 deployments 目录

**解决方案**: 确保 `frontend/abi/` 目录下的 ABI 文件已提交到 Git。

### 构建失败：genabi 脚本错误

**解决方案**: 检查 `frontend/scripts/genabi.mjs` 是否正确，确保在 CI 环境中能正常工作。

### 运行时错误：WalletConnect 连接失败

**解决方案**: 检查 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` 环境变量是否正确设置。

## 验证部署

部署成功后，访问你的 Vercel URL，你应该能够：

1. 看到应用界面
2. 连接钱包（MetaMask、WalletConnect 等）
3. 与 Sepolia 测试网上的合约交互

