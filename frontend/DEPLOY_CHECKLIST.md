# Vercel 部署检查清单

## ✅ 部署前检查

### 1. 必需文件
- [x] `vercel.json` - Vercel 配置文件
- [x] `package.json` - 包含构建脚本
- [x] `next.config.ts` - Next.js 配置（包含 COOP/COEP 头）
- [x] `abi/NightlyReflectionABI.ts` - 合约 ABI（已生成）
- [x] `abi/NightlyReflectionAddresses.ts` - 合约地址（已生成）

### 2. 环境变量
在 Vercel 项目设置中需要配置：

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

**获取方式**:
1. 访问 https://cloud.walletconnect.com/
2. 创建新项目或使用现有项目
3. 复制 Project ID

### 3. Git 仓库设置
确保以下文件已提交到 Git：
- ✅ `frontend/abi/NightlyReflectionABI.ts`
- ✅ `frontend/abi/NightlyReflectionAddresses.ts`
- ✅ `frontend/vercel.json`
- ✅ `frontend/package.json`
- ✅ `frontend/next.config.ts`

### 4. Vercel 项目设置

**Root Directory**: `pro25/frontend`

**构建命令**: `npm run build` (自动检测)

**环境变量**:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (必需)

### 5. 合约地址验证

当前 Sepolia 合约地址: `0x6eA28fFE068e945016CD3040d12Aa19785531cee`

确保 `frontend/abi/NightlyReflectionAddresses.ts` 中包含正确的地址。

## 🚀 部署步骤

1. **推送代码到 Git**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **在 Vercel 中导入项目**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 选择你的 Git 仓库
   - **重要**: 设置 Root Directory 为 `pro25/frontend`

3. **配置环境变量**
   - 在项目设置中添加 `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成

## 🔍 验证部署

部署成功后，检查：

1. ✅ 应用可以正常访问
2. ✅ 钱包连接功能正常
3. ✅ 可以切换到 Sepolia 网络
4. ✅ 可以读取和添加反思记录
5. ✅ FHEVM 加密/解密功能正常

## ⚠️ 常见问题

### 构建失败：找不到 deployments 目录
**原因**: Vercel 构建时没有 `deployments` 目录  
**解决**: 确保 `abi/` 目录下的文件已提交到 Git

### 运行时错误：WalletConnect 连接失败
**原因**: 环境变量未设置或设置错误  
**解决**: 检查 Vercel 项目设置中的环境变量

### FHEVM 初始化失败
**原因**: COOP/COEP 头未正确设置  
**解决**: 检查 `vercel.json` 和 `next.config.ts` 中的头配置

