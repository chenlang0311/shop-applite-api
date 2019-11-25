create database if not exists `classroom` DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;
use `classroom`;

-- drop table if exists users;
create table if not exists users (
	`id`				int(11) unsigned primary key auto_increment,
	`username`			char(64) NULL unique,
	`password`			char(32),
	`unionid`			char(32) NULL unique,
	`phone`				char(32) NULL unique,
    `mini_openid`       char(32),
	`app_openid`        char(32),
	`web_openid`		char(32),
	`nickname`			varchar(255),
	`avatarurl`			varchar(255), -- 头像地址
	`gender`			char(32), -- 性别 1 男  2?
	`country`			varchar(255), -- 国家
	`province`			varchar(255), -- 省份
	`city`				varchar(255), -- 城市
	`abstract`			text,
	`desc`				text,
	`catalog_ids`		longtext, -- 已学习的目录
	`state`				ENUM('normal', 'deleted') NOT NULL default 'normal', -- 删除状态
	`readtime`			timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- drop table if exists categories;
create table if not exists categories (
	`id`				int(11) unsigned primary key auto_increment,
	`name`				varchar(255),
	`level`				int(11),
	`state`				ENUM('normal', 'deleted') NOT NULL default 'normal', -- 删除状态	
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
insert ignore into categories (`id`, `name`, `level`) values
(1, '个人提升', 100),
(2, '职场技能', 200),
(3, '两性情感', 300),
(4, '亲子教育', 400),
(5, '健康廋身', 500),
(6, '女性时尚', 600),
(7, '投资理财', 700);

-- drop table if exists details;
create table if not exists details (
	`id`				int(11) unsigned primary key auto_increment,
	`class_id`			int(11) unsigned NOT NULL unique,
	`detail_pic`		text, -- 详情图片
	`content`			longtext,
	`desc`				text,
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- drop table if exists swipers;
create table if not exists swipers (
	`id`				int(11) unsigned primary key auto_increment,
	`category`			ENUM('home') NOT NULL default 'home', -- 轮播图类别
	`parent_id`			int(11) unsigned, -- 轮播图跳转id
	`channel`			ENUM('classes') NULL default 'classes', -- 轮播图跳转分类
	`url`				text, -- 轮播图跳转链接
	`pic`				text, -- 图片地址
	`title`				varchar(255), -- 标题
	`abstract`			text, -- 描述
	`level`				int(11) default 0, -- 等级，越大越靠前
	`state`				ENUM('normal', 'deleted') NOT NULL default 'normal', -- 删除状态
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- drop table if exists records;
create table if not exists records (
	`id`				int(11) unsigned primary key auto_increment,
	`user_id`			int(11) unsigned NOT NULL,
	`class_id`			int(11) unsigned NOT NULL,
	`amount`			decimal(11, 0), -- 支付金额
	`content`			text,
	`desc`				text,
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE KEY `user_id_class_id_key` (`user_id`, `class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- drop table if exists orders;
create table if not exists orders (
	`id`				int(11) unsigned primary key auto_increment,
	`user_id`			int(11) unsigned NOT NULL,
	`class_id`			int(11) unsigned NOT NULL,
	`out_trade_no`		varchar(64) NOT NULL unique, -- 商户订单号
	`transaction_id`	varchar(64), -- 微信订单号
	`nonce_str`			varchar(64), -- 随机字符串
	`prepay_id`			varchar(64), -- 支付产生的id
	`amount`			DECIMAL(11, 0), -- 订单金额
	`pay_type`			ENUM('wxpay', 'alipay') NOT NULL default 'wxpay', -- 支付方式
	`pay_status`		ENUM('create', 'success', 'fail', 'cancel') NOT NULL default 'create', -- 支付状态
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- drop table if exists pay_logs;
create table if not exists pay_logs (
	`id`				int(11) unsigned primary key auto_increment,
	`order_id`			int(11) unsigned,
	`user_id`			int(11) unsigned NOT NULL,
	`class_id`			int(11) unsigned,
	`amount`			decimal(11, 0), -- 支付金额
	`pay_type`			ENUM('wxpay', 'alipay') NOT NULL default 'wxpay', -- 支付类型
	`content`			text,
	`desc`				text,
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- drop table if exists  administrator;
create table if not exists  administrators (
	`id`				int(11) unsigned primary key auto_increment,
	`username`			varchar(255),
	`password`			char(32),
	`name`				varchar(255),
	`avatarurl`			varchar(255), -- 头像地址
	`introduction`		text, -- 介绍
	`desc`				text,
	`state`				ENUM('normal', 'deleted') NOT NULL default 'normal', -- 删除状态
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
insert ignore into administrators (`id`,  `username`, `password`,`name`, `avatarurl`, `introduction`) values
(1,  "admin", "44fd24a374aae21f7c0f844a5ee89279", "", "/public/images/2017/12/1/CUSTOMIMGS-1512057600001.jpg", ""),
(2,  "admin1", "8efc5c74a84a8a7259cd44f727b98684", "", "/public/images/2017/12/1/CUSTOMIMGS-1512057600002.jpg", ""),
(3,  "admin2", "3cbd0639d353d916a703df8f6afd88e1", "", "/public/images/2017/12/1/CUSTOMIMGS-1512057600003.jpg", "");


-- drop table if exists catalogs;
create table if not exists catalogs (
	`id`				int(11) unsigned primary key auto_increment,
	`fileid`			char(32), -- 腾讯视频标识码
	`class_id`			int(11) unsigned NOT NULL,
	`title`				varchar(255),
	`audition`			ENUM('yes', 'no') NOT NULL default 'no', -- 是否试听
	`video_link`		text, -- 音频地址
	`definition`		char(32),
	`duration`			int(11), -- 音频时长
	`size`				int(11), -- 音频大小
	`cover_pic`			text, -- 封面图片
	`virtual_reads`		int(11),
	`reads`				int(11) NOT NULL default 0, -- 点播次数
	`content`			longtext,
	`desc`				text,
	`level`				int(11),
	`state`				ENUM('pending', 'normal', 'deleted') NOT NULL default 'pending', -- pending 为等待腾讯回调
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	INDEX `fileid_key` (`fileid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELIMITER $
CREATE TRIGGER before_insert_catalogs BEFORE INSERT ON catalogs FOR EACH ROW
BEGIN
	IF new.virtual_reads IS NULL THEN
		SET new.virtual_reads = CAST(FLOOR(50 + RAND()*2000) AS UNSIGNED);
	END IF;
END $
DELIMITER ;

-- drop table if exists classes;
create table if not exists classes (
	`id`				int(11) unsigned primary key auto_increment,
	`category_id`		int(11) unsigned NOT NULL, -- 分类
	`channel`			ENUM('audio', 'video') NOT NULL default 'audio', -- 默认音频
	`original_price`	decimal(11, 0), -- 原价
	`price`				decimal(11, 0), -- 现在价格
	`title`				varchar(255),
	`abstract`			text,
	`author`			varchar(255),
	`author_abstract`	text,
	`cover_pic`			text,
	`virtual_unlocks`	int(11),
	`unlocks`			int(11) NOT NULL default 0, -- 购买人数
	`desc`				text,
	`state`				ENUM('normal', 'deleted') NOT NULL default 'normal', -- 删除状态
	`modified`			timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`created`			timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELIMITER $
CREATE TRIGGER before_insert_classes BEFORE INSERT ON classes FOR EACH ROW
BEGIN
	IF new.virtual_unlocks IS NULL THEN
		SET new.virtual_unlocks = CAST(FLOOR(5000 + RAND()*100000) AS UNSIGNED);
	END IF;
END $
DELIMITER ;