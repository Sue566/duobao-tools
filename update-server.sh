#!/bin/bash

# 更新脚本 - 将本地修改部署到服务器
# 使用方法: ./update-server.sh

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 无颜色

# 服务器信息
SERVER_IP="8.130.134.230"
SERVER_USER="root"
SERVER_PATH="/www/wwwroot/sujx/myprojects"

# 本地项目路径
LOCAL_PROJECT_PATH="/Users/a1111/myproject/sujx"
PROJECT_NAME="duobao-tools"

echo -e "${YELLOW}===== 开始部署 $PROJECT_NAME 到服务器 =====${NC}"

# 步骤1: 创建压缩包
echo -e "${GREEN}[1/4] 创建项目压缩包...${NC}"
cd "$LOCAL_PROJECT_PATH" || { echo -e "${RED}错误: 无法进入本地项目目录${NC}"; exit 1; }
tar -czf "${PROJECT_NAME}-updated.tar.gz" "$PROJECT_NAME" || { echo -e "${RED}错误: 创建压缩包失败${NC}"; exit 1; }
echo -e "${GREEN}✓ 压缩包创建成功: ${PROJECT_NAME}-updated.tar.gz${NC}"

# 步骤2: 上传到服务器
echo -e "${GREEN}[2/4] 上传压缩包到服务器...${NC}"
scp "${PROJECT_NAME}-updated.tar.gz" "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/" || { echo -e "${RED}错误: 上传到服务器失败${NC}"; exit 1; }
echo -e "${GREEN}✓ 上传成功${NC}"

# 步骤3: 在服务器上解压文件
echo -e "${GREEN}[3/4] 在服务器上解压文件...${NC}"
ssh "${SERVER_USER}@${SERVER_IP}" "cd ${SERVER_PATH} && tar -xzf ${PROJECT_NAME}-updated.tar.gz && chmod -R 755 ${PROJECT_NAME}" || { echo -e "${RED}错误: 解压文件失败${NC}"; exit 1; }
echo -e "${GREEN}✓ 文件解压成功${NC}"

# 步骤4: 清理临时文件
echo -e "${GREEN}[4/4] 清理临时文件...${NC}"
rm "${PROJECT_NAME}-updated.tar.gz" || { echo -e "${YELLOW}警告: 无法删除本地临时文件${NC}"; }
ssh "${SERVER_USER}@${SERVER_IP}" "rm ${SERVER_PATH}/${PROJECT_NAME}-updated.tar.gz" || { echo -e "${YELLOW}警告: 无法删除服务器临时文件${NC}"; }
echo -e "${GREEN}✓ 临时文件清理完成${NC}"

echo -e "${YELLOW}===== 部署完成! =====${NC}"
echo -e "${GREEN}您可以通过以下URL访问网站:${NC}"
echo -e "http://${SERVER_IP}:28887/"
echo -e "${GREEN}单位转换工具直接访问:${NC}"
echo -e "http://${SERVER_IP}:28887/#tool-unitConverter"