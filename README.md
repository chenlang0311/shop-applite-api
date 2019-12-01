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
导入项目根目录下的mysql.sql
## 修改配置
在ts/config/config.ts可以修改MySQL，Redis等配置，修改配置后需要重新启动服务

### 接口思路
用户->注册1->登录1
商品->列表1->详情1
签到->每日1->列表1
奖品->列表->单个->领奖->实物->地址->领取
                     ->虚拟->领取


### 功能列表
+ 首页
+ 商品详情页面，商品兑换
+ 完整的购物流程，商品的加入、编辑、删除、批量选择，收货地址的选择，下单支付
+ 会员中心（订单、收藏、足迹、收货地址、意见反馈）

### 思考
前端来写后端，一开始还是有非常大的困难的，第一步要去考虑数据库的设计，然后要sql语句的设计，然后对数据的清洗，最后才是对响应数据的返回。困难还是有的，一步步来，相信路总会走下去。
当数据上升到一定的高度时候，整个架构都必须去改变，移植到合适的架构，做服务的拆分，也许这就是微服务的来源吧--当前系统过于冗杂，庞大，如果需要重新修改一些东西，涉及到的代码层次太多，然后只好逐步迁移，做微服务，架构拆分，每个模块才能更好的维护，维护的成本也会更低。
准备参考其他开源项目,以降低开发难度