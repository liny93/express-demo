基于express，mysql，sequelize的后台服务器demo

使用.env文件为项目配置

利用sequelize-auto生成表对应的js文件，命令行执行代码：
sequelize-auto -o "./models/test" -d test -h localhost -u root -p 3306 -x 123456 -e mysql

-o:生成文件目标位置
-d:目标数据库
-h:ip地址...

models一个文件夹代表一个数据库，名字与config文件设置名字一致，
多个数据库如有相同表名需要在model.define内特殊设置，尽量不要有重复的表名

sequelize文档地址：
中文:https://itbilu.com/nodejs/npm/VkYIaRPz-.html
英文:http://docs.sequelizejs.com/
     http://www.nodeclass.com/api/sequelize.html


测试表：
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(4) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `sex` varchar(6) DEFAULT NULL,
  `score` double(4,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;