基于express，mysql，sequelize的后台服务器demo

.env文件设置项目配置

利用sequelize-auto生成表对应的js文件，命令行执行代码：
sequelize-auto -o "./models/test" -d test -h localhost -u root -p 3306 -x 123456 -e mysql
-o:生成文件目标位置
-d:目标数据库
-h:ip地址...

models一个文件夹代表一个数据，名字与config文件设置名字一致，
多个数据库如有相同表名需要在model.define内设置，尽量不要有重复的表名

sequelize文档地址：
中文:https://itbilu.com/nodejs/npm/VkYIaRPz-.html
英文:http://docs.sequelizejs.com/
     http://www.nodeclass.com/api/sequelize.html