
# 基于express，mysql，sequelize的后台服务器demo

使用.env文件为项目配置

### 利用sequelize-auto生成表对应的js文件，命令行执行代码：

```bash
sequelize-auto -o "./models/test" -d test -h localhost -u root -p 3306 -x 123456 -e mysql
```

* -o:生成文件目标位置
* -d:目标数据库
* -h:ip地址...

models一个文件夹代表一个数据库，名字与config文件设置名字一致，

多个数据库如有相同表名需要在model.define内特殊设置，尽量不要有重复的表名

### sequelize文档地址：
中文:https://itbilu.com/nodejs/npm/VkYIaRPz-.html

英文:http://docs.sequelizejs.com/
     http://www.nodeclass.com/api/sequelize.html


### 测试表：

```sql
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `input_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uqusername` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8;

INSERT INTO `user` VALUES ('1', 'liny', '$2a$08$J9LKa9xwBlHCYS5XJe9xpun39e9LZZNMVqRVDrpiIjtksx5OQssGK', 'admin', '2018-01-01 00:00:00', '2018-01-01 00:10:00');
INSERT INTO `user` VALUES ('2', 'testuser1', '$2a$08$J9LKa9xwBlHCYS5XJe9xpun39e9LZZNMVqRVDrpiIjtksx5OQssGK', 'user', '2018-01-01 00:00:00', '2018-01-01 00:10:00');
INSERT INTO `user` VALUES ('3', 'testuser2', '$2a$08$J9LKa9xwBlHCYS5XJe9xpun39e9LZZNMVqRVDrpiIjtksx5OQssGK', 'user', '2018-01-01 00:00:00', '2018-01-01 00:10:00');
```