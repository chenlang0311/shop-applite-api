# shop-applite-api
[![Build Status](https://www.travis-ci.org/chenlang0311/shop-applite-api.svg?branch=master)](https://www.travis-ci.org/chenlang0311/shop-applite-api)

## 开发

```bash
# 克隆项目
git clone https://github.com/chenlang0311/shop-applite-api.git

# 进入项目目录
cd shop-applite-api

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
# 需要先安装Redis服务，并且启动
# 如果是用vscode 可以直接 ctrl+shift+b 等待gulp任务完成 然后F5开启调试
# 其他编辑器可以先执行 gulp  然后node build/app.js

#如果服务启动成功
service start sucess and listening on port 8010...

```
## 配置
在ts/config/config.ts中配置MySQL，Redis,项目端口号，JWT等等
在ts/config/winston.ts中配置日志信息
## 修改配置
在ts/config/config.ts可以修改MySQL，Redis等配置，修改配置后需要重新启动服务

### 接口思路
用户->注册1->登录1
商品->列表1->详情1
签到->每日->列表
奖品->列表->单个