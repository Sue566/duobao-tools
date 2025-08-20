/**
 * 开发命令速查工具 - 命令数据
 */

window.duobaoTools = window.duobaoTools || {};

// 命令数据
window.duobaoTools.commandsData = {
  // 命令分类
  categories: [
    {
      id: 'mysql',
      name: 'MySQL',
      icon: 'fas fa-database',
      commands: [
        // 连接管理
        { cmd: 'mysql -u [username] -p', description: '使用指定用户名登录MySQL' },
        { cmd: 'mysql -u [username] -p [database]', description: '登录并选择指定数据库' },
        { cmd: 'mysql -h [host] -P [port] -u [username] -p', description: '连接到远程MySQL服务器' },
        { cmd: 'mysqladmin -u [username] -p version', description: '查看MySQL版本信息' },
        { cmd: 'mysqladmin -u [username] -p status', description: '查看MySQL状态' },
        
        // 数据库操作
        { cmd: 'SHOW DATABASES;', description: '显示所有数据库' },
        { cmd: 'CREATE DATABASE [database];', description: '创建数据库' },
        { cmd: 'CREATE DATABASE [database] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', description: '创建UTF-8编码的数据库' },
        { cmd: 'DROP DATABASE [database];', description: '删除数据库' },
        { cmd: 'USE [database];', description: '选择数据库' },
        { cmd: 'SHOW CREATE DATABASE [database];', description: '显示创建数据库的SQL语句' },
        { cmd: 'ALTER DATABASE [database] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', description: '修改数据库字符集' },
        
        // 表操作
        { cmd: 'SHOW TABLES;', description: '显示所有表' },
        { cmd: 'DESCRIBE [table];', description: '显示表结构' },
        { cmd: 'SHOW COLUMNS FROM [table];', description: '显示表的列信息' },
        { cmd: 'SHOW CREATE TABLE [table];', description: '显示创建表的SQL语句' },
        { cmd: 'CREATE TABLE [table] (column1 datatype, column2 datatype);', description: '创建表' },
        { cmd: 'DROP TABLE [table];', description: '删除表' },
        { cmd: 'TRUNCATE TABLE [table];', description: '清空表数据' },
        { cmd: 'ALTER TABLE [table] ADD [column] [datatype];', description: '添加列' },
        { cmd: 'ALTER TABLE [table] MODIFY [column] [datatype];', description: '修改列类型' },
        { cmd: 'ALTER TABLE [table] DROP COLUMN [column];', description: '删除列' },
        { cmd: 'ALTER TABLE [table] RENAME TO [new_table];', description: '重命名表' },
        
        // 索引和约束
        { cmd: 'CREATE INDEX [index] ON [table] ([column]);', description: '创建索引' },
        { cmd: 'CREATE UNIQUE INDEX [index] ON [table] ([column]);', description: '创建唯一索引' },
        { cmd: 'SHOW INDEX FROM [table];', description: '显示表的索引' },
        { cmd: 'DROP INDEX [index] ON [table];', description: '删除索引' },
        { cmd: 'ALTER TABLE [table] ADD PRIMARY KEY ([column]);', description: '添加主键' },
        { cmd: 'ALTER TABLE [table] ADD CONSTRAINT [constraint] FOREIGN KEY ([column]) REFERENCES [ref_table]([ref_column]);', description: '添加外键' },
        
        // 数据操作
        { cmd: 'SELECT * FROM [table];', description: '查询表中所有数据' },
        { cmd: 'SELECT [column1], [column2] FROM [table];', description: '查询指定列' },
        { cmd: 'SELECT * FROM [table] WHERE [condition];', description: '条件查询' },
        { cmd: 'SELECT * FROM [table] ORDER BY [column] [ASC|DESC];', description: '排序查询' },
        { cmd: 'SELECT * FROM [table] LIMIT [offset], [count];', description: '分页查询' },
        { cmd: 'SELECT * FROM [table1] JOIN [table2] ON [table1.column] = [table2.column];', description: '表连接查询' },
        { cmd: 'SELECT * FROM [table] GROUP BY [column] HAVING [condition];', description: '分组查询' },
        { cmd: 'INSERT INTO [table] (column1, column2) VALUES (value1, value2);', description: '插入数据' },
        { cmd: 'INSERT INTO [table] VALUES (value1, value2, ...);', description: '插入所有列的数据' },
        { cmd: 'UPDATE [table] SET [column] = [value] WHERE [condition];', description: '更新数据' },
        { cmd: 'DELETE FROM [table] WHERE [condition];', description: '删除数据' },
        
        // 事务
        { cmd: 'START TRANSACTION;', description: '开始事务' },
        { cmd: 'COMMIT;', description: '提交事务' },
        { cmd: 'ROLLBACK;', description: '回滚事务' },
        { cmd: 'SET autocommit = 0;', description: '禁用自动提交' },
        { cmd: 'SET autocommit = 1;', description: '启用自动提交' },
        
        // 用户和权限
        { cmd: 'CREATE USER \'[username]\'@\'[host]\' IDENTIFIED BY \'[password]\';', description: '创建用户' },
        { cmd: 'DROP USER \'[username]\'@\'[host]\';', description: '删除用户' },
        { cmd: 'GRANT ALL PRIVILEGES ON [database].[table] TO \'[username]\'@\'[host]\';', description: '授予权限' },
        { cmd: 'REVOKE ALL PRIVILEGES ON [database].[table] FROM \'[username]\'@\'[host]\';', description: '撤销权限' },
        { cmd: 'SHOW GRANTS FOR \'[username]\'@\'[host]\';', description: '显示用户权限' },
        { cmd: 'FLUSH PRIVILEGES;', description: '刷新权限' },
        
        // 备份和恢复
        { cmd: 'mysqldump -u [username] -p [database] > [filename].sql', description: '导出数据库' },
        { cmd: 'mysqldump -u [username] -p [database] [table] > [filename].sql', description: '导出指定表' },
        { cmd: 'mysql -u [username] -p [database] < [filename].sql', description: '导入数据库' },
        { cmd: 'mysqlimport -u [username] -p [database] [filename].sql', description: '导入数据' },
        
        // 性能和优化
        { cmd: 'EXPLAIN SELECT * FROM [table] WHERE [condition];', description: '分析查询执行计划' },
        { cmd: 'SHOW PROCESSLIST;', description: '显示当前连接' },
        { cmd: 'KILL [connection_id];', description: '终止指定连接' },
        { cmd: 'OPTIMIZE TABLE [table];', description: '优化表' },
        { cmd: 'ANALYZE TABLE [table];', description: '分析表' },
        { cmd: 'REPAIR TABLE [table];', description: '修复表' },
        { cmd: 'CHECK TABLE [table];', description: '检查表' }
      ]
    },
    {
      id: 'redis',
      name: 'Redis',
      icon: 'fas fa-server',
      commands: [
        // 连接和服务器
        { cmd: 'redis-cli', description: '启动Redis命令行客户端' },
        { cmd: 'redis-cli -h [host] -p [port] -a [password]', description: '连接到指定Redis服务器' },
        { cmd: 'redis-server', description: '启动Redis服务器' },
        { cmd: 'redis-server [config_file]', description: '使用配置文件启动Redis服务器' },
        { cmd: 'INFO', description: '获取Redis服务器信息' },
        { cmd: 'CONFIG GET [parameter]', description: '获取配置参数' },
        { cmd: 'CONFIG SET [parameter] [value]', description: '设置配置参数' },
        { cmd: 'PING', description: '测试连接是否正常' },
        { cmd: 'ECHO [message]', description: '打印消息' },
        { cmd: 'SELECT [index]', description: '切换数据库' },
        { cmd: 'QUIT', description: '关闭连接' },
        { cmd: 'AUTH [password]', description: '验证密码' },
        
        // 键值操作
        { cmd: 'SET [key] [value]', description: '设置键值对' },
        { cmd: 'GET [key]', description: '获取键值' },
        { cmd: 'DEL [key]', description: '删除键' },
        { cmd: 'EXISTS [key]', description: '检查键是否存在' },
        { cmd: 'KEYS [pattern]', description: '查找匹配模式的键' },
        { cmd: 'SCAN [cursor] MATCH [pattern] COUNT [count]', description: '增量迭代键' },
        { cmd: 'RANDOMKEY', description: '随机返回一个键' },
        { cmd: 'RENAME [key] [newkey]', description: '重命名键' },
        { cmd: 'TYPE [key]', description: '返回键的数据类型' },
        { cmd: 'DUMP [key]', description: '序列化键' },
        { cmd: 'RESTORE [key] [ttl] [serialized-value]', description: '反序列化键' },
        
        // 过期时间
        { cmd: 'EXPIRE [key] [seconds]', description: '设置键过期时间(秒)' },
        { cmd: 'PEXPIRE [key] [milliseconds]', description: '设置键过期时间(毫秒)' },
        { cmd: 'EXPIREAT [key] [timestamp]', description: '设置键在指定时间戳过期' },
        { cmd: 'TTL [key]', description: '查看键剩余过期时间(秒)' },
        { cmd: 'PTTL [key]', description: '查看键剩余过期时间(毫秒)' },
        { cmd: 'PERSIST [key]', description: '移除键的过期时间' },
        
        // 字符串操作
        { cmd: 'APPEND [key] [value]', description: '追加值到字符串末尾' },
        { cmd: 'STRLEN [key]', description: '获取字符串长度' },
        { cmd: 'INCR [key]', description: '将键的整数值加1' },
        { cmd: 'DECR [key]', description: '将键的整数值减1' },
        { cmd: 'INCRBY [key] [increment]', description: '将键的整数值增加指定值' },
        { cmd: 'DECRBY [key] [decrement]', description: '将键的整数值减少指定值' },
        { cmd: 'GETRANGE [key] [start] [end]', description: '获取字符串指定范围的值' },
        { cmd: 'SETRANGE [key] [offset] [value]', description: '从指定偏移量开始覆盖字符串' },
        { cmd: 'GETSET [key] [value]', description: '设置新值并返回旧值' },
        { cmd: 'MSET [key1] [value1] [key2] [value2] ...', description: '设置多个键值对' },
        { cmd: 'MGET [key1] [key2] ...', description: '获取多个键的值' },
        
        // 哈希表操作
        { cmd: 'HSET [key] [field] [value]', description: '设置哈希表字段的值' },
        { cmd: 'HGET [key] [field]', description: '获取哈希表字段的值' },
        { cmd: 'HDEL [key] [field]', description: '删除哈希表字段' },
        { cmd: 'HEXISTS [key] [field]', description: '检查哈希表字段是否存在' },
        { cmd: 'HGETALL [key]', description: '获取哈希表所有字段和值' },
        { cmd: 'HKEYS [key]', description: '获取哈希表所有字段' },
        { cmd: 'HVALS [key]', description: '获取哈希表所有值' },
        { cmd: 'HLEN [key]', description: '获取哈希表字段数量' },
        { cmd: 'HMSET [key] [field1] [value1] [field2] [value2] ...', description: '设置多个哈希表字段' },
        { cmd: 'HMGET [key] [field1] [field2] ...', description: '获取多个哈希表字段的值' },
        { cmd: 'HINCRBY [key] [field] [increment]', description: '增加哈希表字段的整数值' },
        
        // 列表操作
        { cmd: 'LPUSH [key] [value]', description: '将值推入列表左端' },
        { cmd: 'RPUSH [key] [value]', description: '将值推入列表右端' },
        { cmd: 'LPOP [key]', description: '从列表左端弹出值' },
        { cmd: 'RPOP [key]', description: '从列表右端弹出值' },
        { cmd: 'LRANGE [key] [start] [stop]', description: '获取列表指定范围的元素' },
        { cmd: 'LLEN [key]', description: '获取列表长度' },
        { cmd: 'LINDEX [key] [index]', description: '获取列表指定索引的元素' },
        { cmd: 'LSET [key] [index] [value]', description: '设置列表指定索引的元素' },
        { cmd: 'LREM [key] [count] [value]', description: '移除列表中的元素' },
        { cmd: 'LTRIM [key] [start] [stop]', description: '修剪列表' },
        { cmd: 'BLPOP [key] [timeout]', description: '阻塞式从列表左端弹出值' },
        { cmd: 'BRPOP [key] [timeout]', description: '阻塞式从列表右端弹出值' },
        
        // 集合操作
        { cmd: 'SADD [key] [member]', description: '添加集合成员' },
        { cmd: 'SREM [key] [member]', description: '移除集合成员' },
        { cmd: 'SMEMBERS [key]', description: '获取集合所有成员' },
        { cmd: 'SISMEMBER [key] [member]', description: '检查成员是否在集合中' },
        { cmd: 'SCARD [key]', description: '获取集合成员数量' },
        { cmd: 'SINTER [key1] [key2] ...', description: '获取集合的交集' },
        { cmd: 'SUNION [key1] [key2] ...', description:
/**
 * 开发命令速查工具 - 命令数据
 */

window.duobaoTools = window.duobaoTools || {};

// 命令数据
window.duobaoTools.commandsData = {
  // 命令分类
  categories: [
    {
      id: 'mysql',
      name: 'MySQL',
      icon: 'fas fa-database',
      commands: [
        // 连接管理
        { cmd: 'mysql -u [username] -p', description: '使用指定用户名登录MySQL' },
        { cmd: 'mysql -u [username] -p [database]', description: '登录并选择指定数据库' },
        { cmd: 'mysql -h [host] -P [port] -u [username] -p', description: '连接到远程MySQL服务器' },
        { cmd: 'mysqladmin -u [username] -p version', description: '查看MySQL版本信息' },
        { cmd: 'mysqladmin -u [username] -p status', description: '查看MySQL状态' },
        
        // 数据库操作
        { cmd: 'SHOW DATABASES;', description: '显示所有数据库' },
        { cmd: 'CREATE DATABASE [database];', description: '创建数据库' },
        { cmd: 'CREATE DATABASE [database] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', description: '创建UTF-8编码的数据库' },
        { cmd: 'DROP DATABASE [database];', description: '删除数据库' },
        { cmd: 'USE [database];', description: '选择数据库' },
        { cmd: 'SHOW CREATE DATABASE [database];', description: '显示创建数据库的SQL语句' },
        { cmd: 'ALTER DATABASE [database] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', description: '修改数据库字符集' },
        
        // 表操作
        { cmd: 'SHOW TABLES;', description: '显示所有表' },
        { cmd: 'DESCRIBE [table];', description: '显示表结构' },
        { cmd: 'SHOW COLUMNS FROM [table];', description: '显示表的列信息' },
        { cmd: 'SHOW CREATE TABLE [table];', description: '显示创建表的SQL语句' },
        { cmd: 'CREATE TABLE [table] (column1 datatype, column2 datatype);', description: '创建表' },
        { cmd: 'DROP TABLE [table];', description: '删除表' },
        { cmd: 'TRUNCATE TABLE [table];', description: '清空表数据' },
        { cmd: 'ALTER TABLE [table] ADD [column] [datatype];', description: '添加列' },
        { cmd: 'ALTER TABLE [table] MODIFY [column] [datatype];', description: '修改列类型' },
        { cmd: 'ALTER TABLE [table] DROP COLUMN [column];', description: '删除列' },
        { cmd: 'ALTER TABLE [table] RENAME TO [new_table];', description: '重命名表' },
        
        // 索引和约束
        { cmd: 'CREATE INDEX [index] ON [table] ([column]);', description: '创建索引' },
        { cmd: 'CREATE UNIQUE INDEX [index] ON [table] ([column]);', description: '创建唯一索引' },
        { cmd: 'SHOW INDEX FROM [table];', description: '显示表的索引' },
        { cmd: 'DROP INDEX [index] ON [table];', description: '删除索引' },
        { cmd: 'ALTER TABLE [table] ADD PRIMARY KEY ([column]);', description: '添加主键' },
        { cmd: 'ALTER TABLE [table] ADD CONSTRAINT [constraint] FOREIGN KEY ([column]) REFERENCES [ref_table]([ref_column]);', description: '添加外键' },
        
        // 数据操作
        { cmd: 'SELECT * FROM [table];', description: '查询表中所有数据' },
        { cmd: 'SELECT [column1], [column2] FROM [table];', description: '查询指定列' },
        { cmd: 'SELECT * FROM [table] WHERE [condition];', description: '条件查询' },
        { cmd: 'SELECT * FROM [table] ORDER BY [column] [ASC|DESC];', description: '排序查询' },
        { cmd: 'SELECT * FROM [table] LIMIT [offset], [count];', description: '分页查询' },
        { cmd: 'SELECT * FROM [table1] JOIN [table2] ON [table1.column] = [table2.column];', description: '表连接查询' },
        { cmd: 'SELECT * FROM [table] GROUP BY [column] HAVING [condition];', description: '分组查询' },
        { cmd: 'INSERT INTO [table] (column1, column2) VALUES (value1, value2);', description: '插入数据' },
        { cmd: 'INSERT INTO [table] VALUES (value1, value2, ...);', description: '插入所有列的数据' },
        { cmd: 'UPDATE [table] SET [column] = [value] WHERE [condition];', description: '更新数据' },
        { cmd: 'DELETE FROM [table] WHERE [condition];', description: '删除数据' },
        
        // 事务
        { cmd: 'START TRANSACTION;', description: '开始事务' },
        { cmd: 'COMMIT;', description: '提交事务' },
        { cmd: 'ROLLBACK;', description: '回滚事务' },
        { cmd: 'SET autocommit = 0;', description: '禁用自动提交' },
        { cmd: 'SET autocommit = 1;', description: '启用自动提交' },
        
        // 用户和权限
        { cmd: 'CREATE USER \'[username]\'@\'[host]\' IDENTIFIED BY \'[password]\';', description: '创建用户' },
        { cmd: 'DROP USER \'[username]\'@\'[host]\';', description: '删除用户' },
        { cmd: 'GRANT ALL PRIVILEGES ON [database].[table] TO \'[username]\'@\'[host]\';', description: '授予权限' },
        { cmd: 'REVOKE ALL PRIVILEGES ON [database].[table] FROM \'[username]\'@\'[host]\';', description: '撤销权限' },
        { cmd: 'SHOW GRANTS FOR \'[username]\'@\'[host]\';', description: '显示用户权限' },
        { cmd: 'FLUSH PRIVILEGES;', description: '刷新权限' },
        
        // 备份和恢复
        { cmd: 'mysqldump -u [username] -p [database] > [filename].sql', description: '导出数据库' },
        { cmd: 'mysqldump -u [username] -p [database] [table] > [filename].sql', description: '导出指定表' },
        { cmd: 'mysql -u [username] -p [database] < [filename].sql', description: '导入数据库' },
        { cmd: 'mysqlimport -u [username] -p [database] [filename].sql', description: '导入数据' },
        
        // 性能和优化
        { cmd: 'EXPLAIN SELECT * FROM [table] WHERE [condition];', description: '分析查询执行计划' },
        { cmd: 'SHOW PROCESSLIST;', description: '显示当前连接' },
        { cmd: 'KILL [connection_id];', description: '终止指定连接' },
        { cmd: 'OPTIMIZE TABLE [table];', description: '优化表' },
        { cmd: 'ANALYZE TABLE [table];', description: '分析表' },
        { cmd: 'REPAIR TABLE [table];', description: '修复表' },
        { cmd: 'CHECK TABLE [table];', description: '检查表' }
      ]
    },
    {
      id: 'redis',
      name: 'Redis',
      icon: 'fas fa-server',
      commands: [
        // 连接和服务器
        { cmd: 'redis-cli', description: '启动Redis命令行客户端' },
        { cmd: 'redis-cli -h [host] -p [port] -a [password]', description: '连接到指定Redis服务器' },
        { cmd: 'redis-server', description: '启动Redis服务器' },
        { cmd: 'redis-server [config_file]', description: '使用配置文件启动Redis服务器' },
        { cmd: 'INFO', description: '获取Redis服务器信息' },
        { cmd: 'CONFIG GET [parameter]', description: '获取配置参数' },
        { cmd: 'CONFIG SET [parameter] [value]', description: '设置配置参数' },
        { cmd: 'PING', description: '测试连接是否正常' },
        { cmd: 'ECHO [message]', description: '打印消息' },
        { cmd: 'SELECT [index]', description: '切换数据库' },
        { cmd: 'QUIT', description: '关闭连接' },
        { cmd: 'AUTH [password]', description: '验证密码' },
        
        // 键值操作
        { cmd: 'SET [key] [value]', description: '设置键值对' },
        { cmd: 'GET [key]', description: '获取键值' },
        { cmd: 'DEL [key]', description: '删除键' },
        { cmd: 'EXISTS [key]', description: '检查键是否存在' },
        { cmd: 'KEYS [pattern]', description: '查找匹配模式的键' },
        { cmd: 'SCAN [cursor] MATCH [pattern] COUNT [count]', description: '增量迭代键' },
        { cmd: 'RANDOMKEY', description: '随机返回一个键' },
        { cmd: 'RENAME [key] [newkey]', description: '重命名键' },
        { cmd: 'TYPE [key]', description: '返回键的数据类型' },
        { cmd: 'DUMP [key]', description: '序列化键' },
        { cmd: 'RESTORE [key] [ttl] [serialized-value]', description: '反序列化键' },
        
        // 过期时间
        { cmd: 'EXPIRE [key] [seconds]', description: '设置键过期时间(秒)' },
        { cmd: 'PEXPIRE [key] [milliseconds]', description: '设置键过期时间(毫秒)' },
        { cmd: 'EXPIREAT [key] [timestamp]', description: '设置键在指定时间戳过期' },
        { cmd: 'TTL [key]', description: '查看键剩余过期时间(秒)' },
        { cmd: 'PTTL [key]', description: '查看键剩余过期时间(毫秒)' },
        { cmd: 'PERSIST [key]', description: '移除键的过期时间' },
        
        // 字符串操作
        { cmd: 'APPEND [key] [value]', description: '追加值到字符串末尾' },
        { cmd: 'STRLEN [key]', description: '获取字符串长度' },
        { cmd: 'INCR [key]', description: '将键的整数值加1' },
        { cmd: 'DECR [key]', description: '将键的整数值减1' },
        { cmd: 'INCRBY [key] [increment]', description: '将键的整数值增加指定值' },
        { cmd: 'DECRBY [key] [decrement]', description: '将键的整数值减少指定值' },
        { cmd: 'GETRANGE [key] [start] [end]', description: '获取字符串指定范围的值' },
        { cmd: 'SETRANGE [key] [offset] [value]', description: '从指定偏移量开始覆盖字符串' },
        { cmd: 'GETSET [key] [value]', description: '设置新值并返回旧值' },
        { cmd: 'MSET [key1] [value1] [key2] [value2] ...', description: '设置多个键值对' },
        { cmd: 'MGET [key1] [key2] ...', description: '获取多个键的值' },
        
        // 哈希表操作
        { cmd: 'HSET [key] [field] [value]', description: '设置哈希表字段的值' },
        { cmd: 'HGET [key] [field]', description: '获取哈希表字段的值' },
        { cmd: 'HDEL [key] [field]', description: '删除哈希表字段' },
        { cmd: 'HEXISTS [key] [field]', description: '检查哈希表字段是否存在' },
        { cmd: 'HGETALL [key]', description: '获取哈希表所有字段和值' },
        { cmd: 'HKEYS [key]', description: '获取哈希表所有字段' },
        { cmd: 'HVALS [key]', description: '获取哈希表所有值' },
        { cmd: 'HLEN [key]', description: '获取哈希表字段数量' },
        { cmd: 'HMSET [key] [field1] [value1] [field2] [value2] ...', description: '设置多个哈希表字段' },
        { cmd: 'HMGET [key] [field1] [field2] ...', description: '获取多个哈希表字段的值' },
        { cmd: 'HINCRBY [key] [field] [increment]', description: '增加哈希表字段的整数值' },
        
        // 列表操作
        { cmd: 'LPUSH [key] [value]', description: '将值推入列表左端' },
        { cmd: 'RPUSH [key] [value]', description: '将值推入列表右端' },
        { cmd: 'LPOP [key]', description: '从列表左端弹出值' },
        { cmd: 'RPOP [key]', description: '从列表右端弹出值' },
        { cmd: 'LRANGE [key] [start] [stop]', description: '获取列表指定范围的元素' },
        { cmd: 'LLEN [key]', description: '获取列表长度' },
        { cmd: 'LINDEX [key] [index]', description: '获取列表指定索引的元素' },
        { cmd: 'LSET [key] [index] [value]', description: '设置列表指定索引的元素' },
        { cmd: 'LREM [key] [count] [value]', description: '移除列表中的元素' },
        { cmd: 'LTRIM [key] [start] [stop]', description: '修剪列表' },
        { cmd: 'BLPOP [key] [timeout]', description: '阻塞式从列表左端弹出值' },
        { cmd: 'BRPOP [key] [timeout]', description: '阻塞式从列表右端弹出值' },
        
        // 集合操作
        { cmd: 'SADD [key] [member]', description: '添加集合成员' },
        { cmd: 'SREM [key] [member]', description: '移除集合成员' },
        { cmd: 'SMEMBERS [key]', description: '获取集合所有成员' },
        { cmd: 'SISMEMBER [key] [member]', description: '检查成员是否在集合中' },
        { cmd: 'SCARD [key]', description: '获取集合成员数量' },
        { cmd: 'SINTER [key1] [key2] ...', description: '获取集合的交集' },
        { cmd: 'SUNION [key1] [key2] ...', description: '获取集合的并集' },
        { cmd: 'SDIFF [key1] [key2] ...', description: '获取集合的差集' },
        
        // 有序集合操作
        { cmd: 'ZADD [key] [score] [member]', description: '添加有序集合成员' },
        { cmd: 'ZRANGE [key] [start] [stop]', description: '获取有序集合指定范围的成员' },
        { cmd: 'ZREM [key] [member]', description: '移除有序集合成员' },
        { cmd: 'ZCARD [key]', description: '获取有序集合成员数量' },
        { cmd: 'ZSCORE [key] [member]', description: '获取有序集合成员的分数' },
        
        // 发布订阅
        { cmd: 'PUBLISH [channel] [message]', description: '发布消息到频道' },
        { cmd: 'SUBSCRIBE [channel]', description: '订阅频道' },
        { cmd: 'PSUBSCRIBE [pattern]', description: '订阅匹配模式的频道' },
        { cmd: 'UNSUBSCRIBE [channel]', description: '取消订阅频道' },
        
        // 数据库管理
        { cmd: 'FLUSHDB', description: '清空当前数据库' },
        { cmd: 'FLUSHALL', description: '清空所有数据库' },
        { cmd: 'DBSIZE', description: '获取当前数据库键数量' },
        { cmd: 'SAVE', description: '同步保存数据到磁盘' },
        { cmd: 'BGSAVE', description: '异步保存数据到磁盘' },
        { cmd: 'LASTSAVE', description: '获取最后一次成功保存的时间戳' }
      ]
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: 'fab fa-linux',
      commands: [
        // 文件和目录操作
        { cmd: 'ls', description: '列出目录内容' },
        { cmd: 'ls -l', description: '以长格式列出目录内容' },
        { cmd: 'ls -a', description: '列出所有文件，包括隐藏文件' },
        { cmd: 'ls -la', description: '以长格式列出所有文件，包括隐藏文件' },
        { cmd: 'ls -lh', description: '以长格式列出目录内容，显示人类可读的文件大小' },
        { cmd: 'cd [directory]', description: '切换目录' },
        { cmd: 'cd ..', description: '切换到上级目录' },
        { cmd: 'cd ~', description: '切换到用户主目录' },
        { cmd: 'cd -', description: '切换到上一个工作目录' },
        { cmd: 'pwd', description: '显示当前工作目录' },
        { cmd: 'mkdir [directory]', description: '创建目录' },
        { cmd: 'mkdir -p [directory/subdirectory]', description: '创建多级目录' },
        { cmd: 'rmdir [directory]', description: '删除空目录' },
        { cmd: 'rm [file]', description: '删除文件' },
        { cmd: 'rm -r [directory]', description: '递归删除目录' },
        { cmd: 'rm -rf [directory]', description: '强制递归删除目录' },
        { cmd: 'cp [source] [destination]', description: '复制文件' },
        { cmd: 'cp -r [source_directory] [destination_directory]', description: '递归复制目录' },
        { cmd: 'cp -p [source] [destination]', description: '复制文件并保留权限' },
        { cmd: 'mv [source] [destination]', description: '移动文件或重命名' },
        { cmd: 'touch [file]', description: '创建空文件或更新时间戳' },
        { cmd: 'ln -s [target] [link_name]', description: '创建符号链接' },
        { cmd: 'ln [target] [link_name]', description: '创建硬链接' },
        
        // 文件查看和编辑
        { cmd: 'cat [file]', description: '查看文件内容' },
        { cmd: 'more [file]', description: '分页查看文件内容' },
        { cmd: 'less [file]', description: '交互式查看文件内容' },
        { cmd: 'head [file]', description: '查看文件开头' },
        { cmd: 'head -n [number] [file]', description: '查看文件前N行' },
        { cmd: 'tail [file]', description: '查看文件结尾' },
        { cmd: 'tail -n [number] [file]', description: '查看文件后N行' },
        { cmd: 'tail -f [file]', description: '实时查看文件更新' },
        { cmd: 'nano [file]', description: '使用nano编辑文件' },
        { cmd: 'vi [file]', description: '使用vi编辑文件' },
        { cmd: 'vim [file]', description: '使用vim编辑文件' },
        { cmd: 'emacs [file]', description: '使用emacs编辑文件' },
        { cmd: 'diff [file1] [file2]', description: '比较两个文件的差异' },
        { cmd: 'cmp [file1] [file2]', description: '比较两个文件是否相同' },
        { cmd: 'file [file]', description: '确定文件类型' },
        
        // 文件搜索和过滤
        { cmd: 'grep [pattern] [file]', description: '搜索文件内容' },
        { cmd: 'grep -r [pattern] [directory]', description: '递归搜索目录中的文件内容' },
        { cmd: 'grep -i [pattern] [file]', description: '不区分大小写搜索文件内容' },
        { cmd: 'grep -v [pattern] [file]', description: '显示不匹配的行' },
        { cmd: 'find [directory] -name [pattern]', description: '按名称查找文件' },
        { cmd: 'find [directory] -type f -name "[pattern]"', description: '按名称查找文件（不包括目录）' },
        { cmd: 'find [directory] -type d -name "[pattern]"', description: '按名称查找目录' },
        { cmd: 'find [directory] -size +[size]', description: '查找大于指定大小的文件' },
        { cmd: 'find [directory] -mtime [days]', description: '查找N天前修改的文件' },
        { cmd: 'locate [pattern]', description: '快速查找文件（使用数据库）' },
        { cmd: 'which [command]', description: '查找可执行文件的位置' },
        { cmd: 'whereis [command]', description: '查找命令的二进制文件、源代码和手册页' },
        
        // 文件权限和所有权
        { cmd: 'chmod [permissions] [file]', description: '修改文件权限' },
        { cmd: 'chmod -R [permissions] [directory]', description: '递归修改目录权限' },
        { cmd: 'chmod u+x [file]', description: '给文件所有者添加执行权限' },
        { cmd: 'chmod 755 [file]', description: '设置文件权限为rwxr-xr-x' },
        { cmd: 'chmod 644 [file]', description: '设置文件权限为rw-r--r--' },
        { cmd: 'chown [user]:[group] [file]', description: '修改文件所有者和组' },
        { cmd: 'chown -R [user]:[group] [directory]', description: '递归修改目录所有者和组' },
        { cmd: 'chgrp [group] [file]', description: '修改文件所属组' },
        { cmd: 'umask', description: '显示或设置文件创建掩码' },
        
        // 进程管理
        { cmd: 'ps', description: '显示当前进程' },
        { cmd: 'ps aux', description: '显示所有进程详细信息' },
        { cmd: 'ps -ef', description: '显示所有进程（标准格式）' },
        { cmd: 'pgrep [pattern]', description: '根据名称查找进程ID' },
        { cmd: 'kill [pid]', description: '终止进程' },
        { cmd: 'kill -9 [pid]', description: '强制终止进程' },
        { cmd: 'killall [process_name]', description: '终止指定名称的所有进程' },
        { cmd: 'pkill [pattern]', description: '根据名称终止进程' },
        { cmd: 'top', description: '显示系统资源使用情况' },
        { cmd: 'htop', description: '交互式进程查看器' },
        { cmd: 'nice [command]', description: '以指定优先级运行命令' },
        { cmd: 'renice [priority] -p [pid]', description: '修改进程优先级' },
        { cmd: 'nohup [command] &', description: '在后台运行命令，忽略挂起信号' },
        { cmd: 'bg', description: '将作业放到后台运行' },
        { cmd: 'fg', description: '将作业放到前台运行' },
        { cmd: 'jobs', description: '列出当前终端的作业' },
        { cmd: 'screen', description: '终端会话管理器' },
        { cmd: 'tmux', description: '终端复用器' },
        
        // 系统信息和监控
        { cmd: 'uname -a', description: '显示系统信息' },
        { cmd: 'hostname', description: '显示主机名' },
        { cmd: 'uptime', description: '显示系统运行时间和负载' },
        { cmd: 'w', description: '显示当前登录用户和活动' },
        { cmd: 'who', description: '显示当前登录用户' },
        { cmd: 'whoami', description: '显示当前用户名' },
        { cmd: 'id', description: '显示当前用户ID和组ID' },
        { cmd: 'last', description: '显示最近登录用户' },
        { cmd: 'df -h', description: '显示磁盘使用情况（人类可读）' },
        { cmd: 'du -sh [directory]', description: '显示目录大小（人类可读）' },
        { cmd: 'du -h --max-depth=1', description: '显示当前目录下各子目录大小' },
        { cmd: 'free -m', description: '显示内存使用情况（MB）' },
        { cmd: 'free -h', description: '显示内存使用情况（人类可读）' },
        { cmd: 'vmstat', description: '显示虚拟内存统计信息' },
        { cmd: 'iostat', description: '显示CPU和I/O统计信息' },
        { cmd: 'mpstat', description: '显示多处理器统计信息' },
        { cmd: 'netstat -tuln', description: '显示监听的TCP和UDP端口' },
        { cmd: 'ss -tuln', description: '显示网络套接字统计信息' },
        { cmd: 'lsof -i', description: '列出打开的网络文件' },
        { cmd: 'dmesg', description: '显示内核环形缓冲区信息' },
        
        // 网络
        { cmd: 'ping [host]', description: '测试网络连接' },
        { cmd: 'ping -c [count] [host]', description: '发送指定数量的ping包' },
        { cmd: 'traceroute [host]', description: '跟踪数据包路由' },
        { cmd: 'tracepath [host]', description: '跟踪数据包路径' },
        { cmd: 'nslookup [domain]', description: '查询DNS记录' },
        { cmd: 'dig [domain]', description: '查询DNS记录（详细）' },
        { cmd: 'host [domain]', description: '查询DNS记录（简洁）' },
        { cmd: 'whois [domain]', description: '查询域名注册信息' },
        { cmd: 'ifconfig', description: '显示网络接口信息' },
        { cmd: 'ip addr', description: '显示IP地址信息' },
        { cmd: 'ip link', description: '显示网络接口信息' },
        { cmd: 'ip route', description: '显示路由表' },
        { cmd: 'netstat -r', description: '显示路由表' },
        { cmd: 'ssh [user]@[host]', description: 'SSH连接到远程服务器' },
        { cmd: 'ssh -p [port] [user]@[host]', description: '使用指定端口SSH连接' },
        { cmd: 'scp [file] [user]@[host]:[path]', description: '将文件复制到远程服务器' },
        { cmd: 'scp [user]@[host]:[path] [local_path]', description: '从远程服务器复制文件' },
        { cmd: 'rsync -avz [source] [destination]', description: '同步文件和目录' },
        { cmd: 'wget [url]', description: '下载文件' },
        { cmd: 'curl [url]', description: '发送HTTP请求' },
        
        // 压缩和解压
        { cmd: 'tar -czvf [archive.tar.gz] [directory]', description: '创建gzip压缩的tar归档' },
        { cmd: 'tar -xzvf [archive.tar.gz]', description: '解压gzip压缩的tar归档' },
        { cmd: 'tar -cjvf [archive.tar.bz2] [directory]', description: '创建bzip2压缩的tar归档' },
        { cmd: 'tar -xjvf [archive.tar.bz2]', description: '解压bzip2压缩的tar归档' },
        { cmd: 'gzip [file]', description: '压缩文件（创建.gz文件）' },
        { cmd: 'gunzip [file.gz]', description: '解压.gz文件' },
        { cmd: 'zip [archive.zip] [file(s)]', description: '创建zip归档' },
        { cmd: 'unzip [archive.zip]', description: '解压zip归档' },
        
        // 用户和组管理
        { cmd: 'useradd [username]', description: '创建新用户' },
        { cmd: 'userdel [username]', description: '删除用户' },
        { cmd: 'usermod [options] [username]', description: '修改用户账户' },
        { cmd: 'passwd [username]', description: '修改用户密码' },
        { cmd: 'groupadd [groupname]', description: '创建新组' },
        { cmd: 'groupdel [groupname]', description: '删除组' },
        { cmd: 'groupmod [options] [groupname]', description: '修改组' },
        { cmd: 'groups [username]', description: '显示用户所属的组' },
        { cmd: 'su [username]', description: '切换用户' },
        { cmd: 'su -', description: '切换到root用户（带环境变量）' },
        { cmd: 'sudo [command]', description: '以管理员权限执行命令' },
        { cmd: 'visudo', description: '编辑sudoers文件' },
        
        // 系统服务和启动
        { cmd: 'systemctl start [service]', description: '启动服务' },
        { cmd: 'systemctl stop [service]', description: '停止服务' },
        { cmd: 'systemctl restart [service]', description: '重启服务' },
        { cmd: 'systemctl status [service]', description: '查看服务状态' },
        { cmd: 'systemctl enable [service]', description: '设置服务开机启动' },
        { cmd: 'systemctl disable [service]', description: '禁用服务开机启动' },
        { cmd: 'service [service] start', description: '启动服务（旧方式）' },
        { cmd: 'service [service] stop', description: '停止服务（旧方式）' },
        { cmd: 'service [service] restart', description: '重启服务（旧方式）' },
        { cmd: 'service [service] status', description: '查看服务状态（旧方式）' },
        { cmd: 'chkconfig [service] on', description: '设置服务开机启动（旧方式）' },
        { cmd: 'chkconfig [service] off', description: '禁用服务开机启动（旧方式）' },
        { cmd: 'shutdown -h now', description: '立即关机' },
        { cmd: 'shutdown -r now', description: '立即重启' },
        { cmd: 'reboot', description: '重启系统' },
        { cmd: 'halt', description: '停止系统' },
        { cmd: 'poweroff', description: '关闭系统电源' }
      ]
    },
    {
      id: 'docker',
      name: 'Docker',
      icon: 'fab fa-docker',
      commands: [
        { cmd: 'docker --version', description: '显示Docker版本' },
        { cmd: 'docker info', description: '显示Docker系统信息' },
        { cmd: 'docker images', description: '列出本地镜像' },
        { cmd: 'docker pull [image]', description: '拉取镜像' },
        { cmd: 'docker build -t [name]:[tag] [path]', description: '构建镜像' },
        { cmd: 'docker rmi [image]', description: '删除镜像' },
        { cmd: 'docker ps', description: '列出运行中的容器' },
        { cmd: 'docker ps -a', description: '列出所有容器' },
        { cmd: 'docker run [image]', description: '运行容器' },
        { cmd: 'docker run -d [image]', description: '后台运行容器' },
        { cmd: 'docker run -p [host_port]:[container_port] [image]', description: '映射端口运行容器' },
        { cmd: 'docker run -v [host_path]:[container_path] [image]', description: '挂载卷运行容器' },
        { cmd: 'docker start [container]', description: '启动容器' },
        { cmd: 'docker stop [container]', description: '停止容器' },
        { cmd: 'docker restart [container]', description: '重启容器' },
        { cmd: 'docker rm [container]', description: '删除容器' },
        { cmd: 'docker logs [container]', description: '查看容器日志' },
        { cmd: 'docker logs -f [container]', description: '实时查看容器日志' },
        { cmd: 'docker exec -it [container] [command]', description: '在容器中执行命令' },
        { cmd: 'docker exec -it [container] bash', description: '进入容器bash' },
        { cmd: 'docker-compose up', description: '启动docker-compose服务' },
        { cmd: 'docker-compose up -d', description: '后台启动docker-compose服务' },
        { cmd: 'docker-compose down', description: '停止docker-compose服务' }
      ]
    },
    {
      id: 'docker',
      name: 'Docker',
      icon: 'fab fa-docker',
      commands: [
        // 容器管理
        { cmd: 'docker ps', description: '列出运行中的容器' },
        { cmd: 'docker ps -a', description: '列出所有容器（包括已停止的）' },
        { cmd: 'docker ps -q', description: '只显示容器ID' },
        { cmd: 'docker ps --format "{{.ID}}: {{.Names}}"', description: '自定义输出格式' },
        { cmd: 'docker run [image]', description: '运行容器' },
        { cmd: 'docker run -d [image]', description: '后台运行容器' },
        { cmd: 'docker run -it [image] [command]', description: '交互式运行容器' },
        { cmd: 'docker run --name [name] [image]', description: '指定容器名称运行' },
        { cmd: 'docker run -p [host_port]:[container_port] [image]', description: '映射端口运行容器' },
        { cmd: 'docker run -v [host_path]:[container_path] [image]', description: '挂载卷运行容器' },
        { cmd: 'docker run --rm [image]', description: '容器停止后自动删除' },
        { cmd: 'docker run --restart=always [image]', description: '设置容器自动重启' },
        { cmd: 'docker run -e [ENV_VAR]=[value] [image]', description: '设置环境变量' },
        { cmd: 'docker start [container]', description: '启动已停止的容器' },
        { cmd: 'docker stop [container]', description: '停止容器' },
        { cmd: 'docker restart [container]', description: '重启容器' },
        { cmd: 'docker pause [container]', description: '暂停容器' },
        { cmd: 'docker unpause [container]', description: '恢复暂停的容器' },
        { cmd: 'docker kill [container]', description: '强制停止容器' },
        { cmd: 'docker rm [container]', description: '删除容器' },
        { cmd: 'docker rm -f [container]', description: '强制删除运行中的容器' },
        { cmd: 'docker rm $(docker ps -aq)', description: '删除所有容器' },
        { cmd: 'docker container prune', description: '删除所有停止的容器' },
        { cmd: 'docker rename [old_name] [new_name]', description: '重命名容器' },
        
        // 容器交互
        { cmd: 'docker exec -it [container] [command]', description: '在容器中执行交互式命令' },
        { cmd: 'docker exec [container] [command]', description: '在容器中执行命令' },
        { cmd: 'docker logs [container]', description: '查看容器日志' },
        { cmd: 'docker logs -f [container]', description: '实时查看容器日志' },
        { cmd: 'docker logs --tail [number] [container]', description: '查看容器最后N行日志' },
        { cmd: 'docker logs --since [time] [container]', description: '查看指定时间后的日志' },
        { cmd: 'docker attach [container]', description: '连接到容器的标准输入输出' },
        { cmd: 'docker cp [container]:[path] [host_path]', description: '从容器复制文件到主机' },
        { cmd: 'docker cp [host_path] [container]:[path]', description: '从主机复制文件到容器' },
        { cmd: 'docker port [container]', description: '显示容器的端口映射' },
        { cmd: 'docker stats', description: '显示容器资源使用统计' },
        { cmd: 'docker top [container]', description: '显示容器中运行的进程' },
        { cmd: 'docker diff [container]', description: '显示容器文件系统的变化' },
        { cmd: 'docker inspect [container]', description: '查看容器详细信息' },
        
        // 镜像管理
        { cmd: 'docker images', description: '列出所有镜像' },
        { cmd: 'docker images -a', description: '列出所有镜像（包括中间层）' },
        { cmd: 'docker images -q', description: '只显示镜像ID' },
        { cmd: 'docker pull [image]', description: '拉取镜像' },
        { cmd: 'docker pull [image]:[tag]', description: '拉取指定标签的镜像' },
        { cmd: 'docker build -t [name:tag] .', description: '从当前目录的Dockerfile构建镜像' },
        { cmd: 'docker build -t [name:tag] -f [dockerfile] .', description: '从指定Dockerfile构建镜像' },
        { cmd: 'docker build --no-cache -t [name:tag] .', description: '不使用缓存构建镜像' },
        { cmd: 'docker rmi [image]', description: '删除镜像' },
        { cmd: 'docker rmi -f [image]', description: '强制删除镜像' },
        { cmd: 'docker rmi $(docker images -q)', description: '删除所有镜像' },
        { cmd: 'docker image prune', description: '删除未使用的镜像' },
        { cmd: 'docker image prune -a', description: '删除所有未使用的镜像' },
        { cmd: 'docker tag [image] [new_image:tag]', description: '给镜像添加标签' },
        { cmd: 'docker save -o [file.tar] [image]', description: '将镜像保存为tar文件' },
        { cmd: 'docker load -i [file.tar]', description: '从tar文件加载镜像' },
        { cmd: 'docker history [image]', description: '显示镜像的历史' },
        { cmd: 'docker commit [container] [image:tag]', description: '从容器创建新镜像' },
        { cmd: 'docker inspect [image]', description: '查看镜像详细信息' },
        
        // 网络管理
        { cmd: 'docker network ls', description: '列出所有网络' },
        { cmd: 'docker network create [network]', description: '创建网络' },
        { cmd: 'docker network rm [network]', description: '删除网络' },
        { cmd: 'docker network connect [network] [container]', description: '将容器连接到网络' },
        { cmd: 'docker network disconnect [network] [container]', description: '将容器从网络断开' },
        { cmd: 'docker network inspect [network]', description: '查看网络详细信息' },
        { cmd: 'docker network prune', description: '删除所有未使用的网络' },
        
        // 卷管理
        { cmd: 'docker volume ls', description: '列出所有卷' },
        { cmd: 'docker volume create [volume]', description: '创建卷' },
        { cmd: 'docker volume rm [volume]', description: '删除卷' },
        { cmd: 'docker volume inspect [volume]', description: '查看卷详细信息' },
        { cmd: 'docker volume prune', description: '删除所有未使用的卷' },
        
        // Docker Compose
        { cmd: 'docker-compose up', description: '创建并启动所有服务' },
        { cmd: 'docker-compose up -d', description: '后台启动所有服务' },
        { cmd: 'docker-compose down', description: '停止并删除所有服务' },
        { cmd: 'docker-compose ps', description: '列出所有服务' },
        { cmd: 'docker-compose logs', description: '查看服务日志' },
        { cmd: 'docker-compose logs -f', description: '实时查看服务日志' },
        { cmd: 'docker-compose exec [service] [command]', description: '在服务中执行命令' },
        { cmd: 'docker-compose build', description: '构建或重建服务' },
        { cmd: 'docker-compose pull', description: '拉取服务镜像' },
        { cmd: 'docker-compose restart', description: '重启所有服务' },
        { cmd: 'docker-compose stop', description: '停止所有服务' },
        { cmd: 'docker-compose start', description: '启动所有服务' },
        { cmd: 'docker-compose rm', description: '删除已停止的服务容器' },
        { cmd: 'docker-compose -f [file.yml] up', description: '使用指定的compose文件' },
        
        // Docker系统
        { cmd: 'docker info', description: '显示Docker系统信息' },
        { cmd: 'docker version', description: '显示Docker版本信息' },
        { cmd: 'docker system df', description: '显示Docker磁盘使用情况' },
        { cmd: 'docker system prune', description: '删除未使用的数据' },
        { cmd: 'docker system prune -a', description: '删除所有未使用的数据（包括未使用的镜像）' },
        { cmd: 'docker login', description: '登录Docker仓库' },
        { cmd: 'docker logout', description: '登出Docker仓库' },
        { cmd: 'docker push [image:tag]', description: '推送镜像到仓库' }
      ]
    },
    {
      id: 'git',
      name: 'Git',
      icon: 'fab fa-git-alt',
      commands: [
        // 基本操作
        { cmd: 'git init', description: '初始化仓库' },
        { cmd: 'git clone [url]', description: '克隆仓库' },
        { cmd: 'git clone --depth 1 [url]', description: '浅克隆仓库（只获取最新版本）' },
        { cmd: 'git clone --branch [branch] [url]', description: '克隆特定分支' },
        { cmd: 'git status', description: '查看仓库状态' },
        { cmd: 'git status -s', description: '查看简洁的仓库状态' },
        
        // 添加和提交
        { cmd: 'git add [file]', description: '添加文件到暂存区' },
        { cmd: 'git add .', description: '添加所有文件到暂存区' },
        { cmd: 'git add -p', description: '交互式添加文件的部分内容' },
        { cmd: 'git commit -m "[message]"', description: '提交暂存区到仓库' },
        { cmd: 'git commit -a -m "[message]"', description: '添加所有修改并提交' },
        { cmd: 'git commit --amend', description: '修改最近的提交' },
        { cmd: 'git commit --amend --no-edit', description: '修改最近的提交但不修改提交信息' },
        
        // 分支管理
        { cmd: 'git branch', description: '列出本地分支' },
        { cmd: 'git branch -r', description: '列出远程分支' },
        { cmd: 'git branch -a', description: '列出所有分支' },
        { cmd: 'git branch [branch]', description: '创建分支' },
        { cmd: 'git branch -d [branch]', description: '删除分支' },
        { cmd: 'git branch -D [branch]', description: '强制删除分支' },
        { cmd: 'git branch -m [old] [new]', description: '重命名分支' },
        { cmd: 'git checkout [branch]', description: '切换分支' },
        { cmd: 'git checkout -b [branch]', description: '创建并切换分支' },
        { cmd: 'git checkout -', description: '切换到上一个分支' },
        { cmd: 'git checkout [commit] [file]', description: '检出特定提交的文件' },
        { cmd: 'git switch [branch]', description: '切换分支（Git 2.23+）' },
        { cmd: 'git switch -c [branch]', description: '创建并切换分支（Git 2.23+）' },
        
        // 合并和变基
        { cmd: 'git merge [branch]', description: '合并分支到当前分支' },
        { cmd: 'git merge --no-ff [branch]', description: '合并分支（禁用快进）' },
        { cmd: 'git merge --abort', description: '中止合并' },
        { cmd: 'git rebase [branch]', description: '变基到指定分支' },
        { cmd: 'git rebase -i HEAD~[n]', description: '交互式变基最近n个提交' },
        { cmd: 'git rebase --abort', description: '中止变基' },
        { cmd: 'git rebase --continue', description: '继续变基' },
        { cmd: 'git cherry-pick [commit]', description: '应用特定提交' },
        
        // 远程操作
        { cmd: 'git remote -v', description: '查看远程仓库' },
        { cmd: 'git remote add [name] [url]', description: '添加远程仓库' },
        { cmd: 'git remote remove [name]', description: '删除远程仓库' },
        { cmd: 'git remote rename [old] [new]', description: '重命名远程仓库' },
        { cmd: 'git remote set-url [name] [url]', description: '修改远程仓库URL' },
        { cmd: 'git fetch', description: '从远程获取但不合并' },
        { cmd: 'git fetch --all', description: '从所有远程获取' },
        { cmd: 'git pull', description: '拉取并合并远程分支' },
        { cmd: 'git pull --rebase', description: '拉取并变基远程分支' },
        { cmd: 'git push', description: '推送到远程仓库' },
        { cmd: 'git push -u origin [branch]', description: '推送并设置上游分支' },
        { cmd: 'git push --force', description: '强制推送（谨慎使用）' },
        { cmd: 'git push --force-with-lease', description: '安全的强制推送' },
        { cmd: 'git push origin --delete [branch]', description: '删除远程分支' },
        
        // 查看历史
        { cmd: 'git log', description: '查看提交历史' },
        { cmd: 'git log --oneline', description: '查看简洁的提交历史' },
        { cmd: 'git log --graph', description: '图形化查看提交历史' },
        { cmd: 'git log --graph --oneline', description: '图形化查看简洁的提交历史' },
        { cmd: 'git log -p [file]', description: '查看文件的修改历史' },
        { cmd: 'git log -n [number]', description: '查看最近n次提交' },
        { cmd: 'git log --author="[name]"', description: '查看特定作者的提交' },
        { cmd: 'git log --since="[date]"', description: '查看特定日期后的提交' },
        { cmd: 'git blame [file]', description: '查看文件的每一行是谁修改的' },
        { cmd: 'git show [commit]', description: '查看特定提交的详细信息' },
        { cmd: 'git diff', description: '查看工作区和暂存区的差异' },
        { cmd: 'git diff --staged', description: '查看暂存区和最新提交的差异' },
        { cmd: 'git diff [commit1] [commit2]', description: '查看两个提交之间的差异' },
        
        // 撤销和重置
        { cmd: 'git restore [file]', description: '恢复工作区文件（Git 2.23+）' },
        { cmd: 'git restore --staged [file]', description: '取消暂存文件（Git 2.23+）' },
        { cmd: 'git reset [file]', description: '取消暂存文件' },
        { cmd: 'git reset --soft HEAD~1', description: '撤销最近的提交，保留修改' },
        { cmd: 'git reset --hard HEAD~1', description: '撤销最近的提交，丢弃修改' },
        { cmd: 'git reset --hard [commit]', description: '重置到指定提交，丢弃修改' },
        { cmd: 'git revert [commit]', description: '创建一个新提交来撤销指定提交' },
        { cmd: 'git clean -f', description: '删除未跟踪的文件' },
        { cmd: 'git clean -fd', description: '删除未跟踪的文件和目录' },
        { cmd: 'git clean -n', description: '预览将被删除的未跟踪文件' },
        
        // 暂存和贮藏
        { cmd: 'git stash', description: '暂存修改' },
        { cmd: 'git stash save "[message]"', description: '暂存修改并添加描述' },
        { cmd: 'git stash list', description: '列出所有暂存' },
        { cmd: 'git stash apply', description: '应用最近的暂存但不删除' },
        { cmd: 'git stash apply stash@{n}', description: '应用指定的暂存但不删除' },
        { cmd: 'git stash pop', description: '应用最近的暂存并删除' },
        { cmd: 'git stash drop', description: '删除最近的暂存' },
        { cmd: 'git stash drop stash@{n}', description: '删除指定的暂存' },
        { cmd: 'git stash clear', description: '删除所有暂存' },
        { cmd: 'git stash show', description: '查看最近暂存的差异' },
        { cmd: 'git stash show -p', description: '查看最近暂存的详细差异' },
        
        // 标签
        { cmd: 'git tag', description: '列出所有标签' },
        { cmd: 'git tag [tag]', description: '创建轻量级标签' },
        { cmd: 'git tag -a [tag] -m "[message]"', description: '创建带注释的标签' },
        { cmd: 'git tag -d [tag]', description: '删除标签' },
        { cmd: 'git push origin [tag]', description: '推送标签到远程' },
        { cmd: 'git push origin --tags', description: '推送所有标签到远程' },
        
        // 配置
        { cmd: 'git config --global user.name "[name]"', description: '设置全局用户名' },
        { cmd: 'git config --global user.email "[email]"', description: '设置全局邮箱' },
        { cmd: 'git config --local user.name "[name]"', description: '设置仓库用户名' },
        { cmd: 'git config --local user.email "[email]"', description: '设置仓库邮箱' },
        { cmd: 'git config --list', description: '列出所有配置' },
        { cmd: 'git config --global alias.[alias] "[command]"', description: '创建命令别名' }
      ]
    },
    {
      id: 'npm',
      name: 'NPM',
      icon: 'fab fa-npm',
      commands: [
        // 基本操作
        { cmd: 'npm -v', description: '显示npm版本' },
        { cmd: 'npm init', description: '初始化项目' },
        { cmd: 'npm init -y', description: '初始化项目（使用默认值）' },
        
        // 安装包
        { cmd: 'npm install', description: '安装package.json中的所有依赖' },
        { cmd: 'npm install --production', description: '只安装生产环境依赖' },
        { cmd: 'npm install [package]', description: '安装指定包' },
        { cmd: 'npm install [package]@[version]', description: '安装指定版本的包' },
        { cmd: 'npm install [package]@latest', description: '安装最新版本的包' },
        { cmd: 'npm install --save [package]', description: '安装并添加到dependencies（npm 5+默认行为）' },
        { cmd: 'npm install --save-dev [package]', description: '安装并添加到devDependencies' },
        { cmd: 'npm install --save-exact [package]', description: '安装并添加精确版本到dependencies' },
        { cmd: 'npm install -g [package]', description: '全局安装包' },
        { cmd: 'npm ci', description: '从package-lock.json安装依赖（CI环境）' },
        
        // 更新和卸载
        { cmd: 'npm uninstall [package]', description: '卸载包' },
        { cmd: 'npm uninstall --save [package]', description: '卸载包并从dependencies移除' },
        { cmd: 'npm uninstall --save-dev [package]', description: '卸载包并从devDependencies移除' },
        { cmd: 'npm uninstall -g [package]', description: '卸载全局包' },
        { cmd: 'npm update', description: '更新所有包' },
        { cmd: 'npm update [package]', description: '更新指定包' },
        { cmd: 'npm update -g', description: '更新所有全局包' },
        
        // 列表和信息
        { cmd: 'npm list', description: '列出已安装的包' },
        { cmd: 'npm list --depth=0', description: '列出顶层已安装的包' },
        { cmd: 'npm list -g', description: '列出全局安装的包' },
        { cmd: 'npm list -g --depth=0', description: '列出顶层全局安装的包' },
        { cmd: 'npm view [package]', description: '查看包信息' },
        { cmd: 'npm view [package] versions', description: '查看包的所有版本' },
        { cmd: 'npm view [package] version', description: '查看包的最新版本' },
        { cmd: 'npm search [keyword]', description: '搜索包' },
        { cmd: 'npm outdated', description: '检查过时的包' },
        
        // 脚本和发布
        { cmd: 'npm run [script]', description: '运行package.json中的脚本' },
        { cmd: 'npm start', description: '运行start脚本' },
        { cmd: 'npm test', description: '运行test脚本' },
        { cmd: 'npm publish', description: '发布包' },
        { cmd: 'npm publish --access public', description: '发布公共包（作用域包）' },
        { cmd: 'npm version [major|minor|patch]', description: '更新版本号' },
        { cmd: 'npm version [version]', description: '设置特定版本号' },
        { cmd: 'npm deprecate [package]@[version] [message]', description: '标记包版本为废弃' },
        { cmd: 'npm unpublish [package]@[version]', description: '取消发布包的特定版本' },
        
        // 配置和缓存
        { cmd: 'npm config list', description: '列出npm配置' },
        { cmd: 'npm config set [key]=[value]', description: '设置npm配置' },
        { cmd: 'npm config get [key]', description: '获取npm配置' },
        { cmd: 'npm config delete [key]', description: '删除npm配置' },
        { cmd: 'npm cache clean --force', description: '清除npm缓存' },
        { cmd: 'npm cache verify', description: '验证缓存' },
        
        // 其他
        { cmd: 'npm audit', description: '检查安全漏洞' },
        { cmd: 'npm audit fix', description: '自动修复安全漏洞' },
        { cmd: 'npm dedupe', description: '删除重复的包' },
        { cmd: 'npm doctor', description: '检查npm安装环境' },
        { cmd: 'npm help', description: '显示npm帮助信息' },
        { cmd: 'npm help [command]', description: '显示特定命令的帮助信息' },
        { cmd: 'npm shrinkwrap', description: '生成npm-shrinkwrap.json' },
        { cmd: 'npx [command]', description: '执行npm包二进制文件' }
      ]
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      icon: 'fas fa-database',
      commands: [
        // 连接
        { cmd: 'mongo', description: '启动MongoDB Shell' },
        { cmd: 'mongo [database]', description: '连接到指定数据库' },
        { cmd: 'mongo --host [host] --port [port]', description: '连接到指定主机和端口' },
        { cmd: 'mongo "mongodb://[username]:[password]@[host]:[port]/[database]"', description: '使用连接字符串连接' },
        { cmd: 'mongosh', description: '启动MongoDB Shell（新版）' },
        
        // 数据库操作
        { cmd: 'show dbs', description: '显示所有数据库' },
        { cmd: 'use [database]', description: '切换数据库' },
        { cmd: 'db', description: '显示当前数据库' },
        { cmd: 'db.dropDatabase()', description: '删除当前数据库' },
        { cmd: 'db.stats()', description: '显示数据库统计信息' },
        
        // 集合操作
        { cmd: 'show collections', description: '显示所有集合' },
        { cmd: 'db.createCollection("[collection]")', description: '创建集合' },
        { cmd: 'db.[collection].drop()', description: '删除集合' },
        { cmd: 'db.[collection].stats()', description: '显示集合统计信息' },
        { cmd: 'db.[collection].renameCollection("[newName]")', description: '重命名集合' },
        
        // 文档操作
        { cmd: 'db.[collection].insertOne({key: "value"})', description: '插入单个文档' },
        { cmd: 'db.[collection].insertMany([{key1: "value1"}, {key2: "value2"}])', description: '插入多个文档' },
        { cmd: 'db.[collection].find()', description: '查询所有文档' },
        { cmd: 'db.[collection].find({key: "value"})', description: '按条件查询文档' },
        { cmd: 'db.[collection].find().pretty()', description: '格式化显示查询结果' },
        { cmd: 'db.[collection].findOne({key: "value"})', description: '查询单个文档' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$set: {key2: "value2"}})', description: '更新单个文档' },
        { cmd: 'db.[collection].updateMany({key: "value"}, {$set: {key2: "value2"}})', description: '更新多个文档' },
        { cmd: 'db.[collection].deleteOne({key: "value"})', description: '删除单个文档' },
        { cmd: 'db.[collection].deleteMany({key: "value"})', description: '删除多个文档' },
        { cmd: 'db.[collection].count()', description: '统计文档数量' },
        
        // 查询操作符
        { cmd: 'db.[collection].find({key: {$gt: value}})', description: '大于' },
        { cmd: 'db.[collection].find({key: {$gte: value}})', description: '大于等于' },
        { cmd: 'db.[collection].find({key: {$lt: value}})', description: '小于' },
        { cmd: 'db.[collection].find({key: {$lte: value}})', description: '小于等于' },
        { cmd: 'db.[collection].find({key: {$ne: value}})', description: '不等于' },
        { cmd: 'db.[collection].find({key: {$in: [value1, value2]}})', description: '在数组中' },
        { cmd: 'db.[collection].find({key: {$nin: [value1, value2]}})', description: '不在数组中' },
        { cmd: 'db.[collection].find({$and: [{key1: value1}, {key2: value2}]})', description: '逻辑与' },
        { cmd: 'db.[collection].find({$or: [{key1: value1}, {key2: value2}]})', description: '逻辑或' },
        
        // 更新操作符
        { cmd: 'db.[collection].updateOne({key: "value"}, {$set: {key2: "value2"}})', description: '设置字段值' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$unset: {key2: ""}})', description: '删除字段' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$inc: {key2: 1}})', description: '增加字段值' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$push: {array: value}})', description: '向数组添加元素' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$pull: {array: value}})', description: '从数组删除元素' },
        
        // 索引
        { cmd: 'db.[collection].createIndex({key: 1})', description: '创建升序索引' },
        { cmd: 'db.[collection].createIndex({key: -1})', description: '创建降序索引' },
        { cmd: 'db.[collection].createIndex({key1: 1, key2: -1})', description: '创建复合索引' },
        { cmd: 'db.[collection].createIndex({key: 1}, {unique: true})', description: '创建唯一索引' },
        { cmd: 'db.[collection].getIndexes()', description: '查看所有索引' },
        { cmd: 'db.[collection].dropIndex("indexName")', description: '删除索引' },
        { cmd: 'db.[collection].dropIndexes()', description: '删除所有索引' },
        
        // 聚合
        { cmd: 'db.[collection].aggregate([{$match: {key: "value"}}])', description: '匹配文档' },
        { cmd: 'db.[collection].aggregate([{$group: {_id: "$key", total: {$sum: "$value"}}}])', description: '分组并求和' },
        { cmd: 'db.[collection].aggregate([{$sort: {key: 1}}])', description: '排序' },
        { cmd: 'db.[collection].aggregate([{$limit: 10}])', description: '限制结果数量' },
        { cmd: 'db.[collection].aggregate([{$skip: 10}])', description: '跳过结果' },
        { cmd: 'db.[collection].aggregate([{$project: {key: 1, _id: 0}}])', description: '投影字段' },
        
        // 用户管理
        { cmd: 'db.createUser({user: "username", pwd: "password", roles: ["readWrite"]})', description: '创建用户' },
        { cmd: 'db.dropUser("username")', description: '删除用户' },
        { cmd: 'show users', description: '显示所有用户' },
        { cmd: 'db.auth("username", "password")', description: '验证用户' }
      ]
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      icon: 'fas fa-dharmachakra',
      commands: [
        // 集群信息
        { cmd: 'kubectl version', description: '显示客户端和服务器版本' },
        { cmd: 'kubectl cluster-info', description: '显示集群信息' },
        { cmd: 'kubectl config view', description: '显示kubeconfig配置' },
        { cmd: 'kubectl config current-context', description: '显示当前上下文' },
        { cmd: 'kubectl config use-context [context]', description: '切换上下文' },
        
        // 资源管理
        { cmd: 'kubectl get pods', description: '列出所有Pod' },
        { cmd: 'kubectl get pods -n [namespace]', description: '列出指定命名空间的Pod' },
        { cmd: 'kubectl get pods --all-namespaces', description: '列出所有命名空间的Pod' },
        { cmd: 'kubectl get services', description: '列出所有Service' },
        { cmd: 'kubectl get deployments', description: '列出所有Deployment' },
        { cmd: 'kubectl get nodes', description: '列出所有Node' },
        { cmd: 'kubectl get namespaces', description: '列出所有Namespace' },
        { cmd: 'kubectl get all', description: '列出所有资源' },
        { cmd: 'kubectl get [resource] [name] -o yaml', description: '以YAML格式显示资源' },
        { cmd: 'kubectl get [resource] [name] -o json', description: '以JSON格式显示资源' },
        
        // 创建和应用
        { cmd: 'kubectl create -f [file.yaml]', description: '从文件创建资源' },
        { cmd: 'kubectl apply -f [file.yaml]', description: '应用配置到资源' },
        { cmd: 'kubectl apply -f [directory]', description: '应用目录中的所有配置' },
        { cmd: 'kubectl create namespace [name]', description: '创建命名空间' },
        { cmd: 'kubectl create deployment [name] --image=[image]', description: '创建Deployment' },
        { cmd: 'kubectl expose deployment [name] --port=[port] --type=LoadBalancer', description: '为Deployment创建Service' },
        
        // 删除资源
        { cmd: 'kubectl delete -f [file.yaml]', description: '删除文件中定义的资源' },
        { cmd: 'kubectl delete [resource] [name]', description: '删除资源' },
        { cmd: 'kubectl delete pods --all', description: '删除所有Pod' },
        { cmd: 'kubectl delete --all [resource] --namespace=[namespace]', description: '删除命名空间中的所有指定资源' },
        
        // 查看和编辑
        { cmd: 'kubectl describe [resource] [name]', description: '显示资源详细信息' },
        { cmd: 'kubectl edit [resource] [name]', description: '编辑资源' },
        { cmd: 'kubectl logs [pod]', description: '查看Pod日志' },
        { cmd: 'kubectl logs -f [pod]', description: '实时查看Pod日志' },
        { cmd: 'kubectl logs [pod] -c [container]', description: '查看Pod中特定容器的日志' },
        
        // 执行命令
        { cmd: 'kubectl exec -it [pod] -- [command]', description: '在Pod中执行命令' },
        { cmd: 'kubectl exec -it [pod] -c [container] -- [command]', description: '在Pod的特定容器中执行命令' },
        { cmd: 'kubectl exec -it [pod] -- /bin/bash', description: '在Pod中启动bash会话' },
        
        // 端口转发和代理
        { cmd: 'kubectl port-forward [pod] [local_port]:[pod_port]', description: '将本地端口转发到Pod端口' },
        { cmd: 'kubectl port-forward svc/[service] [local_port]:[service_port]', description: '将本地端口转发到Service端口' },
        { cmd: 'kubectl proxy', description: '启动代理到Kubernetes API服务器' },
        
        // 扩缩容
        { cmd: 'kubectl scale deployment [name] --replicas=[count]', description: '扩展Deployment' },
        { cmd: 'kubectl autoscale deployment [name] --min=[min] --max=[max] --cpu-percent=[percent]', description: '自动扩展Deployment' },
        
        // 更新
        { cmd: 'kubectl rollout status deployment/[name]', description: '查看Deployment的部署状态' },
        { cmd: 'kubectl rollout history deployment/[name]', description: '查看Deployment的部署历史' },
        { cmd: 'kubectl rollout undo deployment/[name]', description: '回滚Deployment' },
        { cmd: 'kubectl rollout undo deployment/[name] --to-revision=[revision]', description: '回
/**
 * 开发命令速查工具 - 命令数据
 */

window.duobaoTools = window.duobaoTools || {};

// 命令数据
window.duobaoTools.commandsData = {
  // 命令分类
  categories: [
    {
      id: 'mysql',
      name: 'MySQL',
      icon: 'fas fa-database',
      commands: [
        // 连接管理
        { cmd: 'mysql -u [username] -p', description: '使用指定用户名登录MySQL' },
        { cmd: 'mysql -u [username] -p [database]', description: '登录并选择指定数据库' },
        { cmd: 'mysql -h [host] -P [port] -u [username] -p', description: '连接到远程MySQL服务器' },
        { cmd: 'mysqladmin -u [username] -p version', description: '查看MySQL版本信息' },
        { cmd: 'mysqladmin -u [username] -p status', description: '查看MySQL状态' },
        
        // 数据库操作
        { cmd: 'SHOW DATABASES;', description: '显示所有数据库' },
        { cmd: 'CREATE DATABASE [database];', description: '创建数据库' },
        { cmd: 'CREATE DATABASE [database] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', description: '创建UTF-8编码的数据库' },
        { cmd: 'DROP DATABASE [database];', description: '删除数据库' },
        { cmd: 'USE [database];', description: '选择数据库' },
        { cmd: 'SHOW CREATE DATABASE [database];', description: '显示创建数据库的SQL语句' },
        { cmd: 'ALTER DATABASE [database] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', description: '修改数据库字符集' },
        
        // 表操作
        { cmd: 'SHOW TABLES;', description: '显示所有表' },
        { cmd: 'DESCRIBE [table];', description: '显示表结构' },
        { cmd: 'SHOW COLUMNS FROM [table];', description: '显示表的列信息' },
        { cmd: 'SHOW CREATE TABLE [table];', description: '显示创建表的SQL语句' },
        { cmd: 'CREATE TABLE [table] (column1 datatype, column2 datatype);', description: '创建表' },
        { cmd: 'DROP TABLE [table];', description: '删除表' },
        { cmd: 'TRUNCATE TABLE [table];', description: '清空表数据' },
        { cmd: 'ALTER TABLE [table] ADD [column] [datatype];', description: '添加列' },
        { cmd: 'ALTER TABLE [table] MODIFY [column] [datatype];', description: '修改列类型' },
        { cmd: 'ALTER TABLE [table] DROP COLUMN [column];', description: '删除列' },
        { cmd: 'ALTER TABLE [table] RENAME TO [new_table];', description: '重命名表' },
        
        // 索引和约束
        { cmd: 'CREATE INDEX [index] ON [table] ([column]);', description: '创建索引' },
        { cmd: 'CREATE UNIQUE INDEX [index] ON [table] ([column]);', description: '创建唯一索引' },
        { cmd: 'SHOW INDEX FROM [table];', description: '显示表的索引' },
        { cmd: 'DROP INDEX [index] ON [table];', description: '删除索引' },
        { cmd: 'ALTER TABLE [table] ADD PRIMARY KEY ([column]);', description: '添加主键' },
        { cmd: 'ALTER TABLE [table] ADD CONSTRAINT [constraint] FOREIGN KEY ([column]) REFERENCES [ref_table]([ref_column]);', description: '添加外键' },
        
        // 数据操作
        { cmd: 'SELECT * FROM [table];', description: '查询表中所有数据' },
        { cmd: 'SELECT [column1], [column2] FROM [table];', description: '查询指定列' },
        { cmd: 'SELECT * FROM [table] WHERE [condition];', description: '条件查询' },
        { cmd: 'SELECT * FROM [table] ORDER BY [column] [ASC|DESC];', description: '排序查询' },
        { cmd: 'SELECT * FROM [table] LIMIT [offset], [count];', description: '分页查询' },
        { cmd: 'SELECT * FROM [table1] JOIN [table2] ON [table1.column] = [table2.column];', description: '表连接查询' },
        { cmd: 'SELECT * FROM [table] GROUP BY [column] HAVING [condition];', description: '分组查询' },
        { cmd: 'INSERT INTO [table] (column1, column2) VALUES (value1, value2);', description: '插入数据' },
        { cmd: 'INSERT INTO [table] VALUES (value1, value2, ...);', description: '插入所有列的数据' },
        { cmd: 'UPDATE [table] SET [column] = [value] WHERE [condition];', description: '更新数据' },
        { cmd: 'DELETE FROM [table] WHERE [condition];', description: '删除数据' },
        
        // 事务
        { cmd: 'START TRANSACTION;', description: '开始事务' },
        { cmd: 'COMMIT;', description: '提交事务' },
        { cmd: 'ROLLBACK;', description: '回滚事务' },
        { cmd: 'SET autocommit = 0;', description: '禁用自动提交' },
        { cmd: 'SET autocommit = 1;', description: '启用自动提交' },
        
        // 用户和权限
        { cmd: 'CREATE USER \'[username]\'@\'[host]\' IDENTIFIED BY \'[password]\';', description: '创建用户' },
        { cmd: 'DROP USER \'[username]\'@\'[host]\';', description: '删除用户' },
        { cmd: 'GRANT ALL PRIVILEGES ON [database].[table] TO \'[username]\'@\'[host]\';', description: '授予权限' },
        { cmd: 'REVOKE ALL PRIVILEGES ON [database].[table] FROM \'[username]\'@\'[host]\';', description: '撤销权限' },
        { cmd: 'SHOW GRANTS FOR \'[username]\'@\'[host]\';', description: '显示用户权限' },
        { cmd: 'FLUSH PRIVILEGES;', description: '刷新权限' },
        
        // 备份和恢复
        { cmd: 'mysqldump -u [username] -p [database] > [filename].sql', description: '导出数据库' },
        { cmd: 'mysqldump -u [username] -p [database] [table] > [filename].sql', description: '导出指定表' },
        { cmd: 'mysql -u [username] -p [database] < [filename].sql', description: '导入数据库' },
        { cmd: 'mysqlimport -u [username] -p [database] [filename].sql', description: '导入数据' },
        
        // 性能和优化
        { cmd: 'EXPLAIN SELECT * FROM [table] WHERE [condition];', description: '分析查询执行计划' },
        { cmd: 'SHOW PROCESSLIST;', description: '显示当前连接' },
        { cmd: 'KILL [connection_id];', description: '终止指定连接' },
        { cmd: 'OPTIMIZE TABLE [table];', description: '优化表' },
        { cmd: 'ANALYZE TABLE [table];', description: '分析表' },
        { cmd: 'REPAIR TABLE [table];', description: '修复表' },
        { cmd: 'CHECK TABLE [table];', description: '检查表' }
      ]
    },
    {
      id: 'redis',
      name: 'Redis',
      icon: 'fas fa-server',
      commands: [
        // 连接和服务器
        { cmd: 'redis-cli', description: '启动Redis命令行客户端' },
        { cmd: 'redis-cli -h [host] -p [port] -a [password]', description: '连接到指定Redis服务器' },
        { cmd: 'redis-server', description: '启动Redis服务器' },
        { cmd: 'redis-server [config_file]', description: '使用配置文件启动Redis服务器' },
        { cmd: 'INFO', description: '获取Redis服务器信息' },
        { cmd: 'CONFIG GET [parameter]', description: '获取配置参数' },
        { cmd: 'CONFIG SET [parameter] [value]', description: '设置配置参数' },
        { cmd: 'PING', description: '测试连接是否正常' },
        { cmd: 'ECHO [message]', description: '打印消息' },
        { cmd: 'SELECT [index]', description: '切换数据库' },
        { cmd: 'QUIT', description: '关闭连接' },
        { cmd: 'AUTH [password]', description: '验证密码' },
        
        // 键值操作
        { cmd: 'SET [key] [value]', description: '设置键值对' },
        { cmd: 'GET [key]', description: '获取键值' },
        { cmd: 'DEL [key]', description: '删除键' },
        { cmd: 'EXISTS [key]', description: '检查键是否存在' },
        { cmd: 'KEYS [pattern]', description: '查找匹配模式的键' },
        { cmd: 'SCAN [cursor] MATCH [pattern] COUNT [count]', description: '增量迭代键' },
        { cmd: 'RANDOMKEY', description: '随机返回一个键' },
        { cmd: 'RENAME [key] [newkey]', description: '重命名键' },
        { cmd: 'TYPE [key]', description: '返回键的数据类型' },
        { cmd: 'DUMP [key]', description: '序列化键' },
        { cmd: 'RESTORE [key] [ttl] [serialized-value]', description: '反序列化键' },
        
        // 过期时间
        { cmd: 'EXPIRE [key] [seconds]', description: '设置键过期时间(秒)' },
        { cmd: 'PEXPIRE [key] [milliseconds]', description: '设置键过期时间(毫秒)' },
        { cmd: 'EXPIREAT [key] [timestamp]', description: '设置键在指定时间戳过期' },
        { cmd: 'TTL [key]', description: '查看键剩余过期时间(秒)' },
        { cmd: 'PTTL [key]', description: '查看键剩余过期时间(毫秒)' },
        { cmd: 'PERSIST [key]', description: '移除键的过期时间' },
        
        // 字符串操作
        { cmd: 'APPEND [key] [value]', description: '追加值到字符串末尾' },
        { cmd: 'STRLEN [key]', description: '获取字符串长度' },
        { cmd: 'INCR [key]', description: '将键的整数值加1' },
        { cmd: 'DECR [key]', description: '将键的整数值减1' },
        { cmd: 'INCRBY [key] [increment]', description: '将键的整数值增加指定值' },
        { cmd: 'DECRBY [key] [decrement]', description: '将键的整数值减少指定值' },
        { cmd: 'GETRANGE [key] [start] [end]', description: '获取字符串指定范围的值' },
        { cmd: 'SETRANGE [key] [offset] [value]', description: '从指定偏移量开始覆盖字符串' },
        { cmd: 'GETSET [key] [value]', description: '设置新值并返回旧值' },
        { cmd: 'MSET [key1] [value1] [key2] [value2] ...', description: '设置多个键值对' },
        { cmd: 'MGET [key1] [key2] ...', description: '获取多个键的值' },
        
        // 哈希表操作
        { cmd: 'HSET [key] [field] [value]', description: '设置哈希表字段的值' },
        { cmd: 'HGET [key] [field]', description: '获取哈希表字段的值' },
        { cmd: 'HDEL [key] [field]', description: '删除哈希表字段' },
        { cmd: 'HEXISTS [key] [field]', description: '检查哈希表字段是否存在' },
        { cmd: 'HGETALL [key]', description: '获取哈希表所有字段和值' },
        { cmd: 'HKEYS [key]', description: '获取哈希表所有字段' },
        { cmd: 'HVALS [key]', description: '获取哈希表所有值' },
        { cmd: 'HLEN [key]', description: '获取哈希表字段数量' },
        { cmd: 'HMSET [key] [field1] [value1] [field2] [value2] ...', description: '设置多个哈希表字段' },
        { cmd: 'HMGET [key] [field1] [field2] ...', description: '获取多个哈希表字段的值' },
        { cmd: 'HINCRBY [key] [field] [increment]', description: '增加哈希表字段的整数值' },
        
        // 列表操作
        { cmd: 'LPUSH [key] [value]', description: '将值推入列表左端' },
        { cmd: 'RPUSH [key] [value]', description: '将值推入列表右端' },
        { cmd: 'LPOP [key]', description: '从列表左端弹出值' },
        { cmd: 'RPOP [key]', description: '从列表右端弹出值' },
        { cmd: 'LRANGE [key] [start] [stop]', description: '获取列表指定范围的元素' },
        { cmd: 'LLEN [key]', description: '获取列表长度' },
        { cmd: 'LINDEX [key] [index]', description: '获取列表指定索引的元素' },
        { cmd: 'LSET [key] [index] [value]', description: '设置列表指定索引的元素' },
        { cmd: 'LREM [key] [count] [value]', description: '移除列表中的元素' },
        { cmd: 'LTRIM [key] [start] [stop]', description: '修剪列表' },
        { cmd: 'BLPOP [key] [timeout]', description: '阻塞式从列表左端弹出值' },
        { cmd: 'BRPOP [key] [timeout]', description: '阻塞式从列表右端弹出值' },
        
        // 集合操作
        { cmd: 'SADD [key] [member]', description: '添加集合成员' },
        { cmd: 'SREM [key] [member]', description: '移除集合成员' },
        { cmd: 'SMEMBERS [key]', description: '获取集合所有成员' },
        { cmd: 'SISMEMBER [key] [member]', description: '检查成员是否在集合中' },
        { cmd: 'SCARD [key]', description: '获取集合成员数量' },
        { cmd: 'SINTER [key1] [key2] ...', description: '获取集合的交集' },
        { cmd: 'SUNION [key1] [key2] ...', description:
/**
 * 开发命令速查工具 - 命令数据
 */

window.duobaoTools = window.duobaoTools || {};

// 命令数据
window.duobaoTools.commandsData = {
  // 命令分类
  categories: [
    {
      id: 'mysql',
      name: 'MySQL',
      icon: 'fas fa-database',
      commands: [
        // 连接管理
        { cmd: 'mysql -u [username] -p', description: '使用指定用户名登录MySQL' },
        { cmd: 'mysql -u [username] -p [database]', description: '登录并选择指定数据库' },
        { cmd: 'mysql -h [host] -P [port] -u [username] -p', description: '连接到远程MySQL服务器' },
        { cmd: 'mysqladmin -u [username] -p version', description: '查看MySQL版本信息' },
        { cmd: 'mysqladmin -u [username] -p status', description: '查看MySQL状态' },
        
        // 数据库操作
        { cmd: 'SHOW DATABASES;', description: '显示所有数据库' },
        { cmd: 'CREATE DATABASE [database];', description: '创建数据库' },
        { cmd: 'CREATE DATABASE [database] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', description: '创建UTF-8编码的数据库' },
        { cmd: 'DROP DATABASE [database];', description: '删除数据库' },
        { cmd: 'USE [database];', description: '选择数据库' },
        { cmd: 'SHOW CREATE DATABASE [database];', description: '显示创建数据库的SQL语句' },
        { cmd: 'ALTER DATABASE [database] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;', description: '修改数据库字符集' },
        
        // 表操作
        { cmd: 'SHOW TABLES;', description: '显示所有表' },
        { cmd: 'DESCRIBE [table];', description: '显示表结构' },
        { cmd: 'SHOW COLUMNS FROM [table];', description: '显示表的列信息' },
        { cmd: 'SHOW CREATE TABLE [table];', description: '显示创建表的SQL语句' },
        { cmd: 'CREATE TABLE [table] (column1 datatype, column2 datatype);', description: '创建表' },
        { cmd: 'DROP TABLE [table];', description: '删除表' },
        { cmd: 'TRUNCATE TABLE [table];', description: '清空表数据' },
        { cmd: 'ALTER TABLE [table] ADD [column] [datatype];', description: '添加列' },
        { cmd: 'ALTER TABLE [table] MODIFY [column] [datatype];', description: '修改列类型' },
        { cmd: 'ALTER TABLE [table] DROP COLUMN [column];', description: '删除列' },
        { cmd: 'ALTER TABLE [table] RENAME TO [new_table];', description: '重命名表' },
        
        // 索引和约束
        { cmd: 'CREATE INDEX [index] ON [table] ([column]);', description: '创建索引' },
        { cmd: 'CREATE UNIQUE INDEX [index] ON [table] ([column]);', description: '创建唯一索引' },
        { cmd: 'SHOW INDEX FROM [table];', description: '显示表的索引' },
        { cmd: 'DROP INDEX [index] ON [table];', description: '删除索引' },
        { cmd: 'ALTER TABLE [table] ADD PRIMARY KEY ([column]);', description: '添加主键' },
        { cmd: 'ALTER TABLE [table] ADD CONSTRAINT [constraint] FOREIGN KEY ([column]) REFERENCES [ref_table]([ref_column]);', description: '添加外键' },
        
        // 数据操作
        { cmd: 'SELECT * FROM [table];', description: '查询表中所有数据' },
        { cmd: 'SELECT [column1], [column2] FROM [table];', description: '查询指定列' },
        { cmd: 'SELECT * FROM [table] WHERE [condition];', description: '条件查询' },
        { cmd: 'SELECT * FROM [table] ORDER BY [column] [ASC|DESC];', description: '排序查询' },
        { cmd: 'SELECT * FROM [table] LIMIT [offset], [count];', description: '分页查询' },
        { cmd: 'SELECT * FROM [table1] JOIN [table2] ON [table1.column] = [table2.column];', description: '表连接查询' },
        { cmd: 'SELECT * FROM [table] GROUP BY [column] HAVING [condition];', description: '分组查询' },
        { cmd: 'INSERT INTO [table] (column1, column2) VALUES (value1, value2);', description: '插入数据' },
        { cmd: 'INSERT INTO [table] VALUES (value1, value2, ...);', description: '插入所有列的数据' },
        { cmd: 'UPDATE [table] SET [column] = [value] WHERE [condition];', description: '更新数据' },
        { cmd: 'DELETE FROM [table] WHERE [condition];', description: '删除数据' },
        
        // 事务
        { cmd: 'START TRANSACTION;', description: '开始事务' },
        { cmd: 'COMMIT;', description: '提交事务' },
        { cmd: 'ROLLBACK;', description: '回滚事务' },
        { cmd: 'SET autocommit = 0;', description: '禁用自动提交' },
        { cmd: 'SET autocommit = 1;', description: '启用自动提交' },
        
        // 用户和权限
        { cmd: 'CREATE USER \'[username]\'@\'[host]\' IDENTIFIED BY \'[password]\';', description: '创建用户' },
        { cmd: 'DROP USER \'[username]\'@\'[host]\';', description: '删除用户' },
        { cmd: 'GRANT ALL PRIVILEGES ON [database].[table] TO \'[username]\'@\'[host]\';', description: '授予权限' },
        { cmd: 'REVOKE ALL PRIVILEGES ON [database].[table] FROM \'[username]\'@\'[host]\';', description: '撤销权限' },
        { cmd: 'SHOW GRANTS FOR \'[username]\'@\'[host]\';', description: '显示用户权限' },
        { cmd: 'FLUSH PRIVILEGES;', description: '刷新权限' },
        
        // 备份和恢复
        { cmd: 'mysqldump -u [username] -p [database] > [filename].sql', description: '导出数据库' },
        { cmd: 'mysqldump -u [username] -p [database] [table] > [filename].sql', description: '导出指定表' },
        { cmd: 'mysql -u [username] -p [database] < [filename].sql', description: '导入数据库' },
        { cmd: 'mysqlimport -u [username] -p [database] [filename].sql', description: '导入数据' },
        
        // 性能和优化
        { cmd: 'EXPLAIN SELECT * FROM [table] WHERE [condition];', description: '分析查询执行计划' },
        { cmd: 'SHOW PROCESSLIST;', description: '显示当前连接' },
        { cmd: 'KILL [connection_id];', description: '终止指定连接' },
        { cmd: 'OPTIMIZE TABLE [table];', description: '优化表' },
        { cmd: 'ANALYZE TABLE [table];', description: '分析表' },
        { cmd: 'REPAIR TABLE [table];', description: '修复表' },
        { cmd: 'CHECK TABLE [table];', description: '检查表' }
      ]
    },
    {
      id: 'redis',
      name: 'Redis',
      icon: 'fas fa-server',
      commands: [
        // 连接和服务器
        { cmd: 'redis-cli', description: '启动Redis命令行客户端' },
        { cmd: 'redis-cli -h [host] -p [port] -a [password]', description: '连接到指定Redis服务器' },
        { cmd: 'redis-server', description: '启动Redis服务器' },
        { cmd: 'redis-server [config_file]', description: '使用配置文件启动Redis服务器' },
        { cmd: 'INFO', description: '获取Redis服务器信息' },
        { cmd: 'CONFIG GET [parameter]', description: '获取配置参数' },
        { cmd: 'CONFIG SET [parameter] [value]', description: '设置配置参数' },
        { cmd: 'PING', description: '测试连接是否正常' },
        { cmd: 'ECHO [message]', description: '打印消息' },
        { cmd: 'SELECT [index]', description: '切换数据库' },
        { cmd: 'QUIT', description: '关闭连接' },
        { cmd: 'AUTH [password]', description: '验证密码' },
        
        // 键值操作
        { cmd: 'SET [key] [value]', description: '设置键值对' },
        { cmd: 'GET [key]', description: '获取键值' },
        { cmd: 'DEL [key]', description: '删除键' },
        { cmd: 'EXISTS [key]', description: '检查键是否存在' },
        { cmd: 'KEYS [pattern]', description: '查找匹配模式的键' },
        { cmd: 'SCAN [cursor] MATCH [pattern] COUNT [count]', description: '增量迭代键' },
        { cmd: 'RANDOMKEY', description: '随机返回一个键' },
        { cmd: 'RENAME [key] [newkey]', description: '重命名键' },
        { cmd: 'TYPE [key]', description: '返回键的数据类型' },
        { cmd: 'DUMP [key]', description: '序列化键' },
        { cmd: 'RESTORE [key] [ttl] [serialized-value]', description: '反序列化键' },
        
        // 过期时间
        { cmd: 'EXPIRE [key] [seconds]', description: '设置键过期时间(秒)' },
        { cmd: 'PEXPIRE [key] [milliseconds]', description: '设置键过期时间(毫秒)' },
        { cmd: 'EXPIREAT [key] [timestamp]', description: '设置键在指定时间戳过期' },
        { cmd: 'TTL [key]', description: '查看键剩余过期时间(秒)' },
        { cmd: 'PTTL [key]', description: '查看键剩余过期时间(毫秒)' },
        { cmd: 'PERSIST [key]', description: '移除键的过期时间' },
        
        // 字符串操作
        { cmd: 'APPEND [key] [value]', description: '追加值到字符串末尾' },
        { cmd: 'STRLEN [key]', description: '获取字符串长度' },
        { cmd: 'INCR [key]', description: '将键的整数值加1' },
        { cmd: 'DECR [key]', description: '将键的整数值减1' },
        { cmd: 'INCRBY [key] [increment]', description: '将键的整数值增加指定值' },
        { cmd: 'DECRBY [key] [decrement]', description: '将键的整数值减少指定值' },
        { cmd: 'GETRANGE [key] [start] [end]', description: '获取字符串指定范围的值' },
        { cmd: 'SETRANGE [key] [offset] [value]', description: '从指定偏移量开始覆盖字符串' },
        { cmd: 'GETSET [key] [value]', description: '设置新值并返回旧值' },
        { cmd: 'MSET [key1] [value1] [key2] [value2] ...', description: '设置多个键值对' },
        { cmd: 'MGET [key1] [key2] ...', description: '获取多个键的值' },
        
        // 哈希表操作
        { cmd: 'HSET [key] [field] [value]', description: '设置哈希表字段的值' },
        { cmd: 'HGET [key] [field]', description: '获取哈希表字段的值' },
        { cmd: 'HDEL [key] [field]', description: '删除哈希表字段' },
        { cmd: 'HEXISTS [key] [field]', description: '检查哈希表字段是否存在' },
        { cmd: 'HGETALL [key]', description: '获取哈希表所有字段和值' },
        { cmd: 'HKEYS [key]', description: '获取哈希表所有字段' },
        { cmd: 'HVALS [key]', description: '获取哈希表所有值' },
        { cmd: 'HLEN [key]', description: '获取哈希表字段数量' },
        { cmd: 'HMSET [key] [field1] [value1] [field2] [value2] ...', description: '设置多个哈希表字段' },
        { cmd: 'HMGET [key] [field1] [field2] ...', description: '获取多个哈希表字段的值' },
        { cmd: 'HINCRBY [key] [field] [increment]', description: '增加哈希表字段的整数值' },
        
        // 列表操作
        { cmd: 'LPUSH [key] [value]', description: '将值推入列表左端' },
        { cmd: 'RPUSH [key] [value]', description: '将值推入列表右端' },
        { cmd: 'LPOP [key]', description: '从列表左端弹出值' },
        { cmd: 'RPOP [key]', description: '从列表右端弹出值' },
        { cmd: 'LRANGE [key] [start] [stop]', description: '获取列表指定范围的元素' },
        { cmd: 'LLEN [key]', description: '获取列表长度' },
        { cmd: 'LINDEX [key] [index]', description: '获取列表指定索引的元素' },
        { cmd: 'LSET [key] [index] [value]', description: '设置列表指定索引的元素' },
        { cmd: 'LREM [key] [count] [value]', description: '移除列表中的元素' },
        { cmd: 'LTRIM [key] [start] [stop]', description: '修剪列表' },
        { cmd: 'BLPOP [key] [timeout]', description: '阻塞式从列表左端弹出值' },
        { cmd: 'BRPOP [key] [timeout]', description: '阻塞式从列表右端弹出值' },
        
        // 集合操作
        { cmd: 'SADD [key] [member]', description: '添加集合成员' },
        { cmd: 'SREM [key] [member]', description: '移除集合成员' },
        { cmd: 'SMEMBERS [key]', description: '获取集合所有成员' },
        { cmd: 'SISMEMBER [key] [member]', description: '检查成员是否在集合中' },
        { cmd: 'SCARD [key]', description: '获取集合成员数量' },
        { cmd: 'SINTER [key1] [key2] ...', description: '获取集合的交集' },
        { cmd: 'SUNION [key1] [key2] ...', description: '获取集合的并集' },
        { cmd: 'SDIFF [key1] [key2] ...', description: '获取集合的差集' },
        
        // 有序集合操作
        { cmd: 'ZADD [key] [score] [member]', description: '添加有序集合成员' },
        { cmd: 'ZRANGE [key] [start] [stop]', description: '获取有序集合指定范围的成员' },
        { cmd: 'ZREM [key] [member]', description: '移除有序集合成员' },
        { cmd: 'ZCARD [key]', description: '获取有序集合成员数量' },
        { cmd: 'ZSCORE [key] [member]', description: '获取有序集合成员的分数' },
        
        // 发布订阅
        { cmd: 'PUBLISH [channel] [message]', description: '发布消息到频道' },
        { cmd: 'SUBSCRIBE [channel]', description: '订阅频道' },
        { cmd: 'PSUBSCRIBE [pattern]', description: '订阅匹配模式的频道' },
        { cmd: 'UNSUBSCRIBE [channel]', description: '取消订阅频道' },
        
        // 数据库管理
        { cmd: 'FLUSHDB', description: '清空当前数据库' },
        { cmd: 'FLUSHALL', description: '清空所有数据库' },
        { cmd: 'DBSIZE', description: '获取当前数据库键数量' },
        { cmd: 'SAVE', description: '同步保存数据到磁盘' },
        { cmd: 'BGSAVE', description: '异步保存数据到磁盘' },
        { cmd: 'LASTSAVE', description: '获取最后一次成功保存的时间戳' }
      ]
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: 'fab fa-linux',
      commands: [
        // 文件和目录操作
        { cmd: 'ls', description: '列出目录内容' },
        { cmd: 'ls -l', description: '以长格式列出目录内容' },
        { cmd: 'ls -a', description: '列出所有文件，包括隐藏文件' },
        { cmd: 'ls -la', description: '以长格式列出所有文件，包括隐藏文件' },
        { cmd: 'ls -lh', description: '以长格式列出目录内容，显示人类可读的文件大小' },
        { cmd: 'cd [directory]', description: '切换目录' },
        { cmd: 'cd ..', description: '切换到上级目录' },
        { cmd: 'cd ~', description: '切换到用户主目录' },
        { cmd: 'cd -', description: '切换到上一个工作目录' },
        { cmd: 'pwd', description: '显示当前工作目录' },
        { cmd: 'mkdir [directory]', description: '创建目录' },
        { cmd: 'mkdir -p [directory/subdirectory]', description: '创建多级目录' },
        { cmd: 'rmdir [directory]', description: '删除空目录' },
        { cmd: 'rm [file]', description: '删除文件' },
        { cmd: 'rm -r [directory]', description: '递归删除目录' },
        { cmd: 'rm -rf [directory]', description: '强制递归删除目录' },
        { cmd: 'cp [source] [destination]', description: '复制文件' },
        { cmd: 'cp -r [source_directory] [destination_directory]', description: '递归复制目录' },
        { cmd: 'cp -p [source] [destination]', description: '复制文件并保留权限' },
        { cmd: 'mv [source] [destination]', description: '移动文件或重命名' },
        { cmd: 'touch [file]', description: '创建空文件或更新时间戳' },
        { cmd: 'ln -s [target] [link_name]', description: '创建符号链接' },
        { cmd: 'ln [target] [link_name]', description: '创建硬链接' },
        
        // 文件查看和编辑
        { cmd: 'cat [file]', description: '查看文件内容' },
        { cmd: 'more [file]', description: '分页查看文件内容' },
        { cmd: 'less [file]', description: '交互式查看文件内容' },
        { cmd: 'head [file]', description: '查看文件开头' },
        { cmd: 'head -n [number] [file]', description: '查看文件前N行' },
        { cmd: 'tail [file]', description: '查看文件结尾' },
        { cmd: 'tail -n [number] [file]', description: '查看文件后N行' },
        { cmd: 'tail -f [file]', description: '实时查看文件更新' },
        { cmd: 'nano [file]', description: '使用nano编辑文件' },
        { cmd: 'vi [file]', description: '使用vi编辑文件' },
        { cmd: 'vim [file]', description: '使用vim编辑文件' },
        { cmd: 'emacs [file]', description: '使用emacs编辑文件' },
        { cmd: 'diff [file1] [file2]', description: '比较两个文件的差异' },
        { cmd: 'cmp [file1] [file2]', description: '比较两个文件是否相同' },
        { cmd: 'file [file]', description: '确定文件类型' },
        
        // 文件搜索和过滤
        { cmd: 'grep [pattern] [file]', description: '搜索文件内容' },
        { cmd: 'grep -r [pattern] [directory]', description: '递归搜索目录中的文件内容' },
        { cmd: 'grep -i [pattern] [file]', description: '不区分大小写搜索文件内容' },
        { cmd: 'grep -v [pattern] [file]', description: '显示不匹配的行' },
        { cmd: 'find [directory] -name [pattern]', description: '按名称查找文件' },
        { cmd: 'find [directory] -type f -name "[pattern]"', description: '按名称查找文件（不包括目录）' },
        { cmd: 'find [directory] -type d -name "[pattern]"', description: '按名称查找目录' },
        { cmd: 'find [directory] -size +[size]', description: '查找大于指定大小的文件' },
        { cmd: 'find [directory] -mtime [days]', description: '查找N天前修改的文件' },
        { cmd: 'locate [pattern]', description: '快速查找文件（使用数据库）' },
        { cmd: 'which [command]', description: '查找可执行文件的位置' },
        { cmd: 'whereis [command]', description: '查找命令的二进制文件、源代码和手册页' },
        
        // 文件权限和所有权
        { cmd: 'chmod [permissions] [file]', description: '修改文件权限' },
        { cmd: 'chmod -R [permissions] [directory]', description: '递归修改目录权限' },
        { cmd: 'chmod u+x [file]', description: '给文件所有者添加执行权限' },
        { cmd: 'chmod 755 [file]', description: '设置文件权限为rwxr-xr-x' },
        { cmd: 'chmod 644 [file]', description: '设置文件权限为rw-r--r--' },
        { cmd: 'chown [user]:[group] [file]', description: '修改文件所有者和组' },
        { cmd: 'chown -R [user]:[group] [directory]', description: '递归修改目录所有者和组' },
        { cmd: 'chgrp [group] [file]', description: '修改文件所属组' },
        { cmd: 'umask', description: '显示或设置文件创建掩码' },
        
        // 进程管理
        { cmd: 'ps', description: '显示当前进程' },
        { cmd: 'ps aux', description: '显示所有进程详细信息' },
        { cmd: 'ps -ef', description: '显示所有进程（标准格式）' },
        { cmd: 'pgrep [pattern]', description: '根据名称查找进程ID' },
        { cmd: 'kill [pid]', description: '终止进程' },
        { cmd: 'kill -9 [pid]', description: '强制终止进程' },
        { cmd: 'killall [process_name]', description: '终止指定名称的所有进程' },
        { cmd: 'pkill [pattern]', description: '根据名称终止进程' },
        { cmd: 'top', description: '显示系统资源使用情况' },
        { cmd: 'htop', description: '交互式进程查看器' },
        { cmd: 'nice [command]', description: '以指定优先级运行命令' },
        { cmd: 'renice [priority] -p [pid]', description: '修改进程优先级' },
        { cmd: 'nohup [command] &', description: '在后台运行命令，忽略挂起信号' },
        { cmd: 'bg', description: '将作业放到后台运行' },
        { cmd: 'fg', description: '将作业放到前台运行' },
        { cmd: 'jobs', description: '列出当前终端的作业' },
        { cmd: 'screen', description: '终端会话管理器' },
        { cmd: 'tmux', description: '终端复用器' },
        
        // 系统信息和监控
        { cmd: 'uname -a', description: '显示系统信息' },
        { cmd: 'hostname', description: '显示主机名' },
        { cmd: 'uptime', description: '显示系统运行时间和负载' },
        { cmd: 'w', description: '显示当前登录用户和活动' },
        { cmd: 'who', description: '显示当前登录用户' },
        { cmd: 'whoami', description: '显示当前用户名' },
        { cmd: 'id', description: '显示当前用户ID和组ID' },
        { cmd: 'last', description: '显示最近登录用户' },
        { cmd: 'df -h', description: '显示磁盘使用情况（人类可读）' },
        { cmd: 'du -sh [directory]', description: '显示目录大小（人类可读）' },
        { cmd: 'du -h --max-depth=1', description: '显示当前目录下各子目录大小' },
        { cmd: 'free -m', description: '显示内存使用情况（MB）' },
        { cmd: 'free -h', description: '显示内存使用情况（人类可读）' },
        { cmd: 'vmstat', description: '显示虚拟内存统计信息' },
        { cmd: 'iostat', description: '显示CPU和I/O统计信息' },
        { cmd: 'mpstat', description: '显示多处理器统计信息' },
        { cmd: 'netstat -tuln', description: '显示监听的TCP和UDP端口' },
        { cmd: 'ss -tuln', description: '显示网络套接字统计信息' },
        { cmd: 'lsof -i', description: '列出打开的网络文件' },
        { cmd: 'dmesg', description: '显示内核环形缓冲区信息' },
        
        // 网络
        { cmd: 'ping [host]', description: '测试网络连接' },
        { cmd: 'ping -c [count] [host]', description: '发送指定数量的ping包' },
        { cmd: 'traceroute [host]', description: '跟踪数据包路由' },
        { cmd: 'tracepath [host]', description: '跟踪数据包路径' },
        { cmd: 'nslookup [domain]', description: '查询DNS记录' },
        { cmd: 'dig [domain]', description: '查询DNS记录（详细）' },
        { cmd: 'host [domain]', description: '查询DNS记录（简洁）' },
        { cmd: 'whois [domain]', description: '查询域名注册信息' },
        { cmd: 'ifconfig', description: '显示网络接口信息' },
        { cmd: 'ip addr', description: '显示IP地址信息' },
        { cmd: 'ip link', description: '显示网络接口信息' },
        { cmd: 'ip route', description: '显示路由表' },
        { cmd: 'netstat -r', description: '显示路由表' },
        { cmd: 'ssh [user]@[host]', description: 'SSH连接到远程服务器' },
        { cmd: 'ssh -p [port] [user]@[host]', description: '使用指定端口SSH连接' },
        { cmd: 'scp [file] [user]@[host]:[path]', description: '将文件复制到远程服务器' },
        { cmd: 'scp [user]@[host]:[path] [local_path]', description: '从远程服务器复制文件' },
        { cmd: 'rsync -avz [source] [destination]', description: '同步文件和目录' },
        { cmd: 'wget [url]', description: '下载文件' },
        { cmd: 'curl [url]', description: '发送HTTP请求' },
        
        // 压缩和解压
        { cmd: 'tar -czvf [archive.tar.gz] [directory]', description: '创建gzip压缩的tar归档' },
        { cmd: 'tar -xzvf [archive.tar.gz]', description: '解压gzip压缩的tar归档' },
        { cmd: 'tar -cjvf [archive.tar.bz2] [directory]', description: '创建bzip2压缩的tar归档' },
        { cmd: 'tar -xjvf [archive.tar.bz2]', description: '解压bzip2压缩的tar归档' },
        { cmd: 'gzip [file]', description: '压缩文件（创建.gz文件）' },
        { cmd: 'gunzip [file.gz]', description: '解压.gz文件' },
        { cmd: 'zip [archive.zip] [file(s)]', description: '创建zip归档' },
        { cmd: 'unzip [archive.zip]', description: '解压zip归档' },
        
        // 用户和组管理
        { cmd: 'useradd [username]', description: '创建新用户' },
        { cmd: 'userdel [username]', description: '删除用户' },
        { cmd: 'usermod [options] [username]', description: '修改用户账户' },
        { cmd: 'passwd [username]', description: '修改用户密码' },
        { cmd: 'groupadd [groupname]', description: '创建新组' },
        { cmd: 'groupdel [groupname]', description: '删除组' },
        { cmd: 'groupmod [options] [groupname]', description: '修改组' },
        { cmd: 'groups [username]', description: '显示用户所属的组' },
        { cmd: 'su [username]', description: '切换用户' },
        { cmd: 'su -', description: '切换到root用户（带环境变量）' },
        { cmd: 'sudo [command]', description: '以管理员权限执行命令' },
        { cmd: 'visudo', description: '编辑sudoers文件' },
        
        // 系统服务和启动
        { cmd: 'systemctl start [service]', description: '启动服务' },
        { cmd: 'systemctl stop [service]', description: '停止服务' },
        { cmd: 'systemctl restart [service]', description: '重启服务' },
        { cmd: 'systemctl status [service]', description: '查看服务状态' },
        { cmd: 'systemctl enable [service]', description: '设置服务开机启动' },
        { cmd: 'systemctl disable [service]', description: '禁用服务开机启动' },
        { cmd: 'service [service] start', description: '启动服务（旧方式）' },
        { cmd: 'service [service] stop', description: '停止服务（旧方式）' },
        { cmd: 'service [service] restart', description: '重启服务（旧方式）' },
        { cmd: 'service [service] status', description: '查看服务状态（旧方式）' },
        { cmd: 'chkconfig [service] on', description: '设置服务开机启动（旧方式）' },
        { cmd: 'chkconfig [service] off', description: '禁用服务开机启动（旧方式）' },
        { cmd: 'shutdown -h now', description: '立即关机' },
        { cmd: 'shutdown -r now', description: '立即重启' },
        { cmd: 'reboot', description: '重启系统' },
        { cmd: 'halt', description: '停止系统' },
        { cmd: 'poweroff', description: '关闭系统电源' }
      ]
    },
    {
      id: 'docker',
      name: 'Docker',
      icon: 'fab fa-docker',
      commands: [
        { cmd: 'docker --version', description: '显示Docker版本' },
        { cmd: 'docker info', description: '显示Docker系统信息' },
        { cmd: 'docker images', description: '列出本地镜像' },
        { cmd: 'docker pull [image]', description: '拉取镜像' },
        { cmd: 'docker build -t [name]:[tag] [path]', description: '构建镜像' },
        { cmd: 'docker rmi [image]', description: '删除镜像' },
        { cmd: 'docker ps', description: '列出运行中的容器' },
        { cmd: 'docker ps -a', description: '列出所有容器' },
        { cmd: 'docker run [image]', description: '运行容器' },
        { cmd: 'docker run -d [image]', description: '后台运行容器' },
        { cmd: 'docker run -p [host_port]:[container_port] [image]', description: '映射端口运行容器' },
        { cmd: 'docker run -v [host_path]:[container_path] [image]', description: '挂载卷运行容器' },
        { cmd: 'docker start [container]', description: '启动容器' },
        { cmd: 'docker stop [container]', description: '停止容器' },
        { cmd: 'docker restart [container]', description: '重启容器' },
        { cmd: 'docker rm [container]', description: '删除容器' },
        { cmd: 'docker logs [container]', description: '查看容器日志' },
        { cmd: 'docker logs -f [container]', description: '实时查看容器日志' },
        { cmd: 'docker exec -it [container] [command]', description: '在容器中执行命令' },
        { cmd: 'docker exec -it [container] bash', description: '进入容器bash' },
        { cmd: 'docker-compose up', description: '启动docker-compose服务' },
        { cmd: 'docker-compose up -d', description: '后台启动docker-compose服务' },
        { cmd: 'docker-compose down', description: '停止docker-compose服务' }
      ]
    },
    {
      id: 'docker',
      name: 'Docker',
      icon: 'fab fa-docker',
      commands: [
        // 容器管理
        { cmd: 'docker ps', description: '列出运行中的容器' },
        { cmd: 'docker ps -a', description: '列出所有容器（包括已停止的）' },
        { cmd: 'docker ps -q', description: '只显示容器ID' },
        { cmd: 'docker ps --format "{{.ID}}: {{.Names}}"', description: '自定义输出格式' },
        { cmd: 'docker run [image]', description: '运行容器' },
        { cmd: 'docker run -d [image]', description: '后台运行容器' },
        { cmd: 'docker run -it [image] [command]', description: '交互式运行容器' },
        { cmd: 'docker run --name [name] [image]', description: '指定容器名称运行' },
        { cmd: 'docker run -p [host_port]:[container_port] [image]', description: '映射端口运行容器' },
        { cmd: 'docker run -v [host_path]:[container_path] [image]', description: '挂载卷运行容器' },
        { cmd: 'docker run --rm [image]', description: '容器停止后自动删除' },
        { cmd: 'docker run --restart=always [image]', description: '设置容器自动重启' },
        { cmd: 'docker run -e [ENV_VAR]=[value] [image]', description: '设置环境变量' },
        { cmd: 'docker start [container]', description: '启动已停止的容器' },
        { cmd: 'docker stop [container]', description: '停止容器' },
        { cmd: 'docker restart [container]', description: '重启容器' },
        { cmd: 'docker pause [container]', description: '暂停容器' },
        { cmd: 'docker unpause [container]', description: '恢复暂停的容器' },
        { cmd: 'docker kill [container]', description: '强制停止容器' },
        { cmd: 'docker rm [container]', description: '删除容器' },
        { cmd: 'docker rm -f [container]', description: '强制删除运行中的容器' },
        { cmd: 'docker rm $(docker ps -aq)', description: '删除所有容器' },
        { cmd: 'docker container prune', description: '删除所有停止的容器' },
        { cmd: 'docker rename [old_name] [new_name]', description: '重命名容器' },
        
        // 容器交互
        { cmd: 'docker exec -it [container] [command]', description: '在容器中执行交互式命令' },
        { cmd: 'docker exec [container] [command]', description: '在容器中执行命令' },
        { cmd: 'docker logs [container]', description: '查看容器日志' },
        { cmd: 'docker logs -f [container]', description: '实时查看容器日志' },
        { cmd: 'docker logs --tail [number] [container]', description: '查看容器最后N行日志' },
        { cmd: 'docker logs --since [time] [container]', description: '查看指定时间后的日志' },
        { cmd: 'docker attach [container]', description: '连接到容器的标准输入输出' },
        { cmd: 'docker cp [container]:[path] [host_path]', description: '从容器复制文件到主机' },
        { cmd: 'docker cp [host_path] [container]:[path]', description: '从主机复制文件到容器' },
        { cmd: 'docker port [container]', description: '显示容器的端口映射' },
        { cmd: 'docker stats', description: '显示容器资源使用统计' },
        { cmd: 'docker top [container]', description: '显示容器中运行的进程' },
        { cmd: 'docker diff [container]', description: '显示容器文件系统的变化' },
        { cmd: 'docker inspect [container]', description: '查看容器详细信息' },
        
        // 镜像管理
        { cmd: 'docker images', description: '列出所有镜像' },
        { cmd: 'docker images -a', description: '列出所有镜像（包括中间层）' },
        { cmd: 'docker images -q', description: '只显示镜像ID' },
        { cmd: 'docker pull [image]', description: '拉取镜像' },
        { cmd: 'docker pull [image]:[tag]', description: '拉取指定标签的镜像' },
        { cmd: 'docker build -t [name:tag] .', description: '从当前目录的Dockerfile构建镜像' },
        { cmd: 'docker build -t [name:tag] -f [dockerfile] .', description: '从指定Dockerfile构建镜像' },
        { cmd: 'docker build --no-cache -t [name:tag] .', description: '不使用缓存构建镜像' },
        { cmd: 'docker rmi [image]', description: '删除镜像' },
        { cmd: 'docker rmi -f [image]', description: '强制删除镜像' },
        { cmd: 'docker rmi $(docker images -q)', description: '删除所有镜像' },
        { cmd: 'docker image prune', description: '删除未使用的镜像' },
        { cmd: 'docker image prune -a', description: '删除所有未使用的镜像' },
        { cmd: 'docker tag [image] [new_image:tag]', description: '给镜像添加标签' },
        { cmd: 'docker save -o [file.tar] [image]', description: '将镜像保存为tar文件' },
        { cmd: 'docker load -i [file.tar]', description: '从tar文件加载镜像' },
        { cmd: 'docker history [image]', description: '显示镜像的历史' },
        { cmd: 'docker commit [container] [image:tag]', description: '从容器创建新镜像' },
        { cmd: 'docker inspect [image]', description: '查看镜像详细信息' },
        
        // 网络管理
        { cmd: 'docker network ls', description: '列出所有网络' },
        { cmd: 'docker network create [network]', description: '创建网络' },
        { cmd: 'docker network rm [network]', description: '删除网络' },
        { cmd: 'docker network connect [network] [container]', description: '将容器连接到网络' },
        { cmd: 'docker network disconnect [network] [container]', description: '将容器从网络断开' },
        { cmd: 'docker network inspect [network]', description: '查看网络详细信息' },
        { cmd: 'docker network prune', description: '删除所有未使用的网络' },
        
        // 卷管理
        { cmd: 'docker volume ls', description: '列出所有卷' },
        { cmd: 'docker volume create [volume]', description: '创建卷' },
        { cmd: 'docker volume rm [volume]', description: '删除卷' },
        { cmd: 'docker volume inspect [volume]', description: '查看卷详细信息' },
        { cmd: 'docker volume prune', description: '删除所有未使用的卷' },
        
        // Docker Compose
        { cmd: 'docker-compose up', description: '创建并启动所有服务' },
        { cmd: 'docker-compose up -d', description: '后台启动所有服务' },
        { cmd: 'docker-compose down', description: '停止并删除所有服务' },
        { cmd: 'docker-compose ps', description: '列出所有服务' },
        { cmd: 'docker-compose logs', description: '查看服务日志' },
        { cmd: 'docker-compose logs -f', description: '实时查看服务日志' },
        { cmd: 'docker-compose exec [service] [command]', description: '在服务中执行命令' },
        { cmd: 'docker-compose build', description: '构建或重建服务' },
        { cmd: 'docker-compose pull', description: '拉取服务镜像' },
        { cmd: 'docker-compose restart', description: '重启所有服务' },
        { cmd: 'docker-compose stop', description: '停止所有服务' },
        { cmd: 'docker-compose start', description: '启动所有服务' },
        { cmd: 'docker-compose rm', description: '删除已停止的服务容器' },
        { cmd: 'docker-compose -f [file.yml] up', description: '使用指定的compose文件' },
        
        // Docker系统
        { cmd: 'docker info', description: '显示Docker系统信息' },
        { cmd: 'docker version', description: '显示Docker版本信息' },
        { cmd: 'docker system df', description: '显示Docker磁盘使用情况' },
        { cmd: 'docker system prune', description: '删除未使用的数据' },
        { cmd: 'docker system prune -a', description: '删除所有未使用的数据（包括未使用的镜像）' },
        { cmd: 'docker login', description: '登录Docker仓库' },
        { cmd: 'docker logout', description: '登出Docker仓库' },
        { cmd: 'docker push [image:tag]', description: '推送镜像到仓库' }
      ]
    },
    {
      id: 'git',
      name: 'Git',
      icon: 'fab fa-git-alt',
      commands: [
        // 基本操作
        { cmd: 'git init', description: '初始化仓库' },
        { cmd: 'git clone [url]', description: '克隆仓库' },
        { cmd: 'git clone --depth 1 [url]', description: '浅克隆仓库（只获取最新版本）' },
        { cmd: 'git clone --branch [branch] [url]', description: '克隆特定分支' },
        { cmd: 'git status', description: '查看仓库状态' },
        { cmd: 'git status -s', description: '查看简洁的仓库状态' },
        
        // 添加和提交
        { cmd: 'git add [file]', description: '添加文件到暂存区' },
        { cmd: 'git add .', description: '添加所有文件到暂存区' },
        { cmd: 'git add -p', description: '交互式添加文件的部分内容' },
        { cmd: 'git commit -m "[message]"', description: '提交暂存区到仓库' },
        { cmd: 'git commit -a -m "[message]"', description: '添加所有修改并提交' },
        { cmd: 'git commit --amend', description: '修改最近的提交' },
        { cmd: 'git commit --amend --no-edit', description: '修改最近的提交但不修改提交信息' },
        
        // 分支管理
        { cmd: 'git branch', description: '列出本地分支' },
        { cmd: 'git branch -r', description: '列出远程分支' },
        { cmd: 'git branch -a', description: '列出所有分支' },
        { cmd: 'git branch [branch]', description: '创建分支' },
        { cmd: 'git branch -d [branch]', description: '删除分支' },
        { cmd: 'git branch -D [branch]', description: '强制删除分支' },
        { cmd: 'git branch -m [old] [new]', description: '重命名分支' },
        { cmd: 'git checkout [branch]', description: '切换分支' },
        { cmd: 'git checkout -b [branch]', description: '创建并切换分支' },
        { cmd: 'git checkout -', description: '切换到上一个分支' },
        { cmd: 'git checkout [commit] [file]', description: '检出特定提交的文件' },
        { cmd: 'git switch [branch]', description: '切换分支（Git 2.23+）' },
        { cmd: 'git switch -c [branch]', description: '创建并切换分支（Git 2.23+）' },
        
        // 合并和变基
        { cmd: 'git merge [branch]', description: '合并分支到当前分支' },
        { cmd: 'git merge --no-ff [branch]', description: '合并分支（禁用快进）' },
        { cmd: 'git merge --abort', description: '中止合并' },
        { cmd: 'git rebase [branch]', description: '变基到指定分支' },
        { cmd: 'git rebase -i HEAD~[n]', description: '交互式变基最近n个提交' },
        { cmd: 'git rebase --abort', description: '中止变基' },
        { cmd: 'git rebase --continue', description: '继续变基' },
        { cmd: 'git cherry-pick [commit]', description: '应用特定提交' },
        
        // 远程操作
        { cmd: 'git remote -v', description: '查看远程仓库' },
        { cmd: 'git remote add [name] [url]', description: '添加远程仓库' },
        { cmd: 'git remote remove [name]', description: '删除远程仓库' },
        { cmd: 'git remote rename [old] [new]', description: '重命名远程仓库' },
        { cmd: 'git remote set-url [name] [url]', description: '修改远程仓库URL' },
        { cmd: 'git fetch', description: '从远程获取但不合并' },
        { cmd: 'git fetch --all', description: '从所有远程获取' },
        { cmd: 'git pull', description: '拉取并合并远程分支' },
        { cmd: 'git pull --rebase', description: '拉取并变基远程分支' },
        { cmd: 'git push', description: '推送到远程仓库' },
        { cmd: 'git push -u origin [branch]', description: '推送并设置上游分支' },
        { cmd: 'git push --force', description: '强制推送（谨慎使用）' },
        { cmd: 'git push --force-with-lease', description: '安全的强制推送' },
        { cmd: 'git push origin --delete [branch]', description: '删除远程分支' },
        
        // 查看历史
        { cmd: 'git log', description: '查看提交历史' },
        { cmd: 'git log --oneline', description: '查看简洁的提交历史' },
        { cmd: 'git log --graph', description: '图形化查看提交历史' },
        { cmd: 'git log --graph --oneline', description: '图形化查看简洁的提交历史' },
        { cmd: 'git log -p [file]', description: '查看文件的修改历史' },
        { cmd: 'git log -n [number]', description: '查看最近n次提交' },
        { cmd: 'git log --author="[name]"', description: '查看特定作者的提交' },
        { cmd: 'git log --since="[date]"', description: '查看特定日期后的提交' },
        { cmd: 'git blame [file]', description: '查看文件的每一行是谁修改的' },
        { cmd: 'git show [commit]', description: '查看特定提交的详细信息' },
        { cmd: 'git diff', description: '查看工作区和暂存区的差异' },
        { cmd: 'git diff --staged', description: '查看暂存区和最新提交的差异' },
        { cmd: 'git diff [commit1] [commit2]', description: '查看两个提交之间的差异' },
        
        // 撤销和重置
        { cmd: 'git restore [file]', description: '恢复工作区文件（Git 2.23+）' },
        { cmd: 'git restore --staged [file]', description: '取消暂存文件（Git 2.23+）' },
        { cmd: 'git reset [file]', description: '取消暂存文件' },
        { cmd: 'git reset --soft HEAD~1', description: '撤销最近的提交，保留修改' },
        { cmd: 'git reset --hard HEAD~1', description: '撤销最近的提交，丢弃修改' },
        { cmd: 'git reset --hard [commit]', description: '重置到指定提交，丢弃修改' },
        { cmd: 'git revert [commit]', description: '创建一个新提交来撤销指定提交' },
        { cmd: 'git clean -f', description: '删除未跟踪的文件' },
        { cmd: 'git clean -fd', description: '删除未跟踪的文件和目录' },
        { cmd: 'git clean -n', description: '预览将被删除的未跟踪文件' },
        
        // 暂存和贮藏
        { cmd: 'git stash', description: '暂存修改' },
        { cmd: 'git stash save "[message]"', description: '暂存修改并添加描述' },
        { cmd: 'git stash list', description: '列出所有暂存' },
        { cmd: 'git stash apply', description: '应用最近的暂存但不删除' },
        { cmd: 'git stash apply stash@{n}', description: '应用指定的暂存但不删除' },
        { cmd: 'git stash pop', description: '应用最近的暂存并删除' },
        { cmd: 'git stash drop', description: '删除最近的暂存' },
        { cmd: 'git stash drop stash@{n}', description: '删除指定的暂存' },
        { cmd: 'git stash clear', description: '删除所有暂存' },
        { cmd: 'git stash show', description: '查看最近暂存的差异' },
        { cmd: 'git stash show -p', description: '查看最近暂存的详细差异' },
        
        // 标签
        { cmd: 'git tag', description: '列出所有标签' },
        { cmd: 'git tag [tag]', description: '创建轻量级标签' },
        { cmd: 'git tag -a [tag] -m "[message]"', description: '创建带注释的标签' },
        { cmd: 'git tag -d [tag]', description: '删除标签' },
        { cmd: 'git push origin [tag]', description: '推送标签到远程' },
        { cmd: 'git push origin --tags', description: '推送所有标签到远程' },
        
        // 配置
        { cmd: 'git config --global user.name "[name]"', description: '设置全局用户名' },
        { cmd: 'git config --global user.email "[email]"', description: '设置全局邮箱' },
        { cmd: 'git config --local user.name "[name]"', description: '设置仓库用户名' },
        { cmd: 'git config --local user.email "[email]"', description: '设置仓库邮箱' },
        { cmd: 'git config --list', description: '列出所有配置' },
        { cmd: 'git config --global alias.[alias] "[command]"', description: '创建命令别名' }
      ]
    },
    {
      id: 'npm',
      name: 'NPM',
      icon: 'fab fa-npm',
      commands: [
        // 基本操作
        { cmd: 'npm -v', description: '显示npm版本' },
        { cmd: 'npm init', description: '初始化项目' },
        { cmd: 'npm init -y', description: '初始化项目（使用默认值）' },
        
        // 安装包
        { cmd: 'npm install', description: '安装package.json中的所有依赖' },
        { cmd: 'npm install --production', description: '只安装生产环境依赖' },
        { cmd: 'npm install [package]', description: '安装指定包' },
        { cmd: 'npm install [package]@[version]', description: '安装指定版本的包' },
        { cmd: 'npm install [package]@latest', description: '安装最新版本的包' },
        { cmd: 'npm install --save [package]', description: '安装并添加到dependencies（npm 5+默认行为）' },
        { cmd: 'npm install --save-dev [package]', description: '安装并添加到devDependencies' },
        { cmd: 'npm install --save-exact [package]', description: '安装并添加精确版本到dependencies' },
        { cmd: 'npm install -g [package]', description: '全局安装包' },
        { cmd: 'npm ci', description: '从package-lock.json安装依赖（CI环境）' },
        
        // 更新和卸载
        { cmd: 'npm uninstall [package]', description: '卸载包' },
        { cmd: 'npm uninstall --save [package]', description: '卸载包并从dependencies移除' },
        { cmd: 'npm uninstall --save-dev [package]', description: '卸载包并从devDependencies移除' },
        { cmd: 'npm uninstall -g [package]', description: '卸载全局包' },
        { cmd: 'npm update', description: '更新所有包' },
        { cmd: 'npm update [package]', description: '更新指定包' },
        { cmd: 'npm update -g', description: '更新所有全局包' },
        
        // 列表和信息
        { cmd: 'npm list', description: '列出已安装的包' },
        { cmd: 'npm list --depth=0', description: '列出顶层已安装的包' },
        { cmd: 'npm list -g', description: '列出全局安装的包' },
        { cmd: 'npm list -g --depth=0', description: '列出顶层全局安装的包' },
        { cmd: 'npm view [package]', description: '查看包信息' },
        { cmd: 'npm view [package] versions', description: '查看包的所有版本' },
        { cmd: 'npm view [package] version', description: '查看包的最新版本' },
        { cmd: 'npm search [keyword]', description: '搜索包' },
        { cmd: 'npm outdated', description: '检查过时的包' },
        
        // 脚本和发布
        { cmd: 'npm run [script]', description: '运行package.json中的脚本' },
        { cmd: 'npm start', description: '运行start脚本' },
        { cmd: 'npm test', description: '运行test脚本' },
        { cmd: 'npm publish', description: '发布包' },
        { cmd: 'npm publish --access public', description: '发布公共包（作用域包）' },
        { cmd: 'npm version [major|minor|patch]', description: '更新版本号' },
        { cmd: 'npm version [version]', description: '设置特定版本号' },
        { cmd: 'npm deprecate [package]@[version] [message]', description: '标记包版本为废弃' },
        { cmd: 'npm unpublish [package]@[version]', description: '取消发布包的特定版本' },
        
        // 配置和缓存
        { cmd: 'npm config list', description: '列出npm配置' },
        { cmd: 'npm config set [key]=[value]', description: '设置npm配置' },
        { cmd: 'npm config get [key]', description: '获取npm配置' },
        { cmd: 'npm config delete [key]', description: '删除npm配置' },
        { cmd: 'npm cache clean --force', description: '清除npm缓存' },
        { cmd: 'npm cache verify', description: '验证缓存' },
        
        // 其他
        { cmd: 'npm audit', description: '检查安全漏洞' },
        { cmd: 'npm audit fix', description: '自动修复安全漏洞' },
        { cmd: 'npm dedupe', description: '删除重复的包' },
        { cmd: 'npm doctor', description: '检查npm安装环境' },
        { cmd: 'npm help', description: '显示npm帮助信息' },
        { cmd: 'npm help [command]', description: '显示特定命令的帮助信息' },
        { cmd: 'npm shrinkwrap', description: '生成npm-shrinkwrap.json' },
        { cmd: 'npx [command]', description: '执行npm包二进制文件' }
      ]
    }
    {
      id: 'mongodb',
      name: 'MongoDB',
      icon: 'fas fa-database',
      commands: [
        // 连接
        { cmd: 'mongo', description: '启动MongoDB Shell' },
        { cmd: 'mongo [database]', description: '连接到指定数据库' },
        { cmd: 'mongo --host [host] --port [port]', description: '连接到指定主机和端口' },
        { cmd: 'mongo "mongodb://[username]:[password]@[host]:[port]/[database]"', description: '使用连接字符串连接' },
        { cmd: 'mongosh', description: '启动MongoDB Shell（新版）' },
        
        // 数据库操作
        { cmd: 'show dbs', description: '显示所有数据库' },
        { cmd: 'use [database]', description: '切换数据库' },
        { cmd: 'db', description: '显示当前数据库' },
        { cmd: 'db.dropDatabase()', description: '删除当前数据库' },
        { cmd: 'db.stats()', description: '显示数据库统计信息' },
        
        // 集合操作
        { cmd: 'show collections', description: '显示所有集合' },
        { cmd: 'db.createCollection("[collection]")', description: '创建集合' },
        { cmd: 'db.[collection].drop()', description: '删除集合' },
        { cmd: 'db.[collection].stats()', description: '显示集合统计信息' },
        { cmd: 'db.[collection].renameCollection("[newName]")', description: '重命名集合' },
        
        // 文档操作
        { cmd: 'db.[collection].insertOne({key: "value"})', description: '插入单个文档' },
        { cmd: 'db.[collection].insertMany([{key1: "value1"}, {key2: "value2"}])', description: '插入多个文档' },
        { cmd: 'db.[collection].find()', description: '查询所有文档' },
        { cmd: 'db.[collection].find({key: "value"})', description: '按条件查询文档' },
        { cmd: 'db.[collection].find().pretty()', description: '格式化显示查询结果' },
        { cmd: 'db.[collection].findOne({key: "value"})', description: '查询单个文档' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$set: {key2: "value2"}})', description: '更新单个文档' },
        { cmd: 'db.[collection].updateMany({key: "value"}, {$set: {key2: "value2"}})', description: '更新多个文档' },
        { cmd: 'db.[collection].deleteOne({key: "value"})', description: '删除单个文档' },
        { cmd: 'db.[collection].deleteMany({key: "value"})', description: '删除多个文档' },
        { cmd: 'db.[collection].count()', description: '统计文档数量' },
        
        // 查询操作符
        { cmd: 'db.[collection].find({key: {$gt: value}})', description: '大于' },
        { cmd: 'db.[collection].find({key: {$gte: value}})', description: '大于等于' },
        { cmd: 'db.[collection].find({key: {$lt: value}})', description: '小于' },
        { cmd: 'db.[collection].find({key: {$lte: value}})', description: '小于等于' },
        { cmd: 'db.[collection].find({key: {$ne: value}})', description: '不等于' },
        { cmd: 'db.[collection].find({key: {$in: [value1, value2]}})', description: '在数组中' },
        { cmd: 'db.[collection].find({key: {$nin: [value1, value2]}})', description: '不在数组中' },
        { cmd: 'db.[collection].find({$and: [{key1: value1}, {key2: value2}]})', description: '逻辑与' },
        { cmd: 'db.[collection].find({$or: [{key1: value1}, {key2: value2}]})', description: '逻辑或' },
        
        // 更新操作符
        { cmd: 'db.[collection].updateOne({key: "value"}, {$set: {key2: "value2"}})', description: '设置字段值' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$unset: {key2: ""}})', description: '删除字段' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$inc: {key2: 1}})', description: '增加字段值' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$push: {array: value}})', description: '向数组添加元素' },
        { cmd: 'db.[collection].updateOne({key: "value"}, {$pull: {array: value}})', description: '从数组删除元素' },
        
        // 索引
        { cmd: 'db.[collection].createIndex({key: 1})', description: '创建升序索引' },
        { cmd: 'db.[collection].createIndex({key: -1})', description: '创建降序索引' },
        { cmd: 'db.[collection].createIndex({key1: 1, key2: -1})', description: '创建复合索引' },
        { cmd: 'db.[collection].createIndex({key: 1}, {unique: true})', description: '创建唯一索引' },
        { cmd: 'db.[collection].getIndexes()', description: '查看所有索引' },
        { cmd: 'db.[collection].dropIndex("indexName")', description: '删除索引' },
        { cmd: 'db.[collection].dropIndexes()', description: '删除所有索引' },
        
        // 聚合
        { cmd: 'db.[collection].aggregate([{$match: {key: "value"}}])', description: '匹配文档' },
        { cmd: 'db.[collection].aggregate([{$group: {_id: "$key", total: {$sum: "$value"}}}])', description: '分组并求和' },
        { cmd: 'db.[collection].aggregate([{$sort: {key: 1}}])', description: '排序' },
        { cmd: 'db.[collection].aggregate([{$limit: 10}])', description: '限制结果数量' },
        { cmd: 'db.[collection].aggregate([{$skip: 10}])', description: '跳过结果' },
        { cmd: 'db.[collection].aggregate([{$project: {key: 1, _id: 0}}])', description: '投影字段' },
        
        // 用户管理
        { cmd: 'db.createUser({user: "username", pwd: "password", roles: ["readWrite"]})', description: '创建用户' },
        { cmd: 'db.dropUser("username")', description: '删除用户' },
        { cmd: 'show users', description: '显示所有用户' },
        { cmd: 'db.auth("username", "password")', description: '验证用户' }
      ]
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      icon: 'fas fa-dharmachakra',
      commands: [
        // 集群信息
        { cmd: 'kubectl version', description: '显示客户端和服务器版本' },
        { cmd: 'kubectl cluster-info', description: '显示集群信息' },
        { cmd: 'kubectl config view', description: '显示kubeconfig配置' },
        { cmd: 'kubectl config current-context', description: '显示当前上下文' },
        { cmd: 'kubectl config use-context [context]', description: '切换上下文' },
        
        // 资源管理
        { cmd: 'kubectl get pods', description: '列出所有Pod' },
        { cmd: 'kubectl get pods -n [namespace]', description: '列出指定命名空间的Pod' },
        { cmd: 'kubectl get pods --all-namespaces', description: '列出所有命名空间的Pod' },
        { cmd: 'kubectl get services', description: '列出所有Service' },
        { cmd: 'kubectl get deployments', description: '列出所有Deployment' },
        { cmd: 'kubectl get nodes', description: '列出所有Node' },
        { cmd: 'kubectl get namespaces', description: '列出所有Namespace' },
        { cmd: 'kubectl get all', description: '列出所有资源' },
        { cmd: 'kubectl get [resource] [name] -o yaml', description: '以YAML格式显示资源' },
        { cmd: 'kubectl get [resource] [name] -o json', description: '以JSON格式显示资源' },
        
        // 创建和应用
        { cmd: 'kubectl create -f [file.yaml]', description: '从文件创建资源' },
        { cmd: 'kubectl apply -f [file.yaml]', description: '应用配置到资源' },
        { cmd: 'kubectl apply -f [directory]', description: '应用目录中的所有配置' },
        { cmd: 'kubectl create namespace [name]', description: '创建命名空间' },
        { cmd: 'kubectl create deployment [name] --image=[image]', description: '创建Deployment' },
        { cmd: 'kubectl expose deployment [name] --port=[port] --type=LoadBalancer', description: '为Deployment创建Service' },
        
        // 删除资源
        { cmd: 'kubectl delete -f [file.yaml]', description: '删除文件中定义的资源' },
        { cmd: 'kubectl delete [resource] [name]', description: '删除资源' },
        { cmd: 'kubectl delete pods --all', description: '删除所有Pod' },
        { cmd: 'kubectl delete --all [resource] --namespace=[namespace]', description: '删除命名空间中的所有指定资源' },
        
        // 查看和编辑
        { cmd: 'kubectl describe [resource] [name]', description: '显示资源详细信息' },
        { cmd: 'kubectl edit [resource] [name]', description: '编辑资源' },
        { cmd: 'kubectl logs [pod]', description: '查看Pod日志' },
        { cmd: 'kubectl logs -f [pod]', description: '实时查看Pod日志' },
        { cmd: 'kubectl logs [pod] -c [container]', description: '查看Pod中特定容器的日志' },
        
        // 执行命令
        { cmd: 'kubectl exec -it [pod] -- [command]', description: '在Pod中执行命令' },
        { cmd: 'kubectl exec -it [pod] -c [container] -- [command]', description: '在Pod的特定容器中执行命令' },
        { cmd: 'kubectl exec -it [pod] -- /bin/bash', description: '在Pod中启动bash会话' },
        
        // 端口转发和代理
        { cmd: 'kubectl port-forward [pod] [local_port]:[pod_port]', description: '将本地端口转发到Pod端口' },
        { cmd: 'kubectl port-forward svc/[service] [local_port]:[service_port]', description: '将本地端口转发到Service端口' },
        { cmd: 'kubectl proxy', description: '启动代理到Kubernetes API服务器' },
        
        // 扩缩容
        { cmd: 'kubectl scale deployment [name] --replicas=[count]', description: '扩展Deployment' },
        { cmd: 'kubectl autoscale deployment [name] --min=[min] --max=[max] --cpu-percent=[percent]', description: '自动扩展Deployment' },
        
        // 更新
        { cmd: 'kubectl rollout status deployment/[name]', description: '查看Deployment的部署状态' },
        { cmd: 'kubectl rollout history deployment/[name]', description: '查看Deployment的部署历史' },
        { cmd: 'kubectl rollout undo deployment/[name]', description: '回滚Deployment' },
        { cmd: 'kubectl rollout undo deployment/[name] --to-revision=[revision]', description: '回滚Deployment到指定版本' },
        { cmd: 'kubectl rollout restart deployment/[name]', description: '重启Deployment' },
        { cmd: 'kubectl rollout pause deployment/[name]', description: '暂停Deployment的部署' },
        { cmd: 'kubectl rollout resume deployment/[name]', description: '恢复Deployment的部署' }
      ]
    },
    {
      id: 'nginx',
      name: 'Nginx',
      icon: 'fas fa-server',
      commands: [
        // 基本操作
        { cmd: 'nginx -v', description: '显示Nginx版本' },
        { cmd: 'nginx -t', description: '测试配置文件语法' },
        { cmd: 'nginx -T', description: '测试配置文件语法并打印' },
        { cmd: 'nginx', description: '启动Nginx' },
        { cmd: 'nginx -s stop', description: '快速停止Nginx' },
        { cmd: 'nginx -s quit', description: '优雅停止Nginx' },
        { cmd: 'nginx -s reload', description: '重新加载配置' },
        { cmd: 'nginx -s reopen', description: '重新打开日志文件' },
        
        // 配置文件
        { cmd: 'cat /etc/nginx/nginx.conf', description: '查看主配置文件' },
        { cmd: 'cat /etc/nginx/sites-available/default', description: '查看默认站点配置' },
        { cmd: 'ls /etc/nginx/sites-enabled/', description: '列出启用的站点' },
        { cmd: 'ls /etc/nginx/sites-available/', description: '列出可用的站点' },
        { cmd: 'ln -s /etc/nginx/sites-available/[site] /etc/nginx/sites-enabled/', description: '启用站点' },
        { cmd: 'rm /etc/nginx/sites-enabled/[site]', description: '禁用站点' },
        
        // 状态和监控
        { cmd: 'systemctl status nginx', description: '查看Nginx状态（systemd）' },
        { cmd: 'service nginx status', description: '查看Nginx状态（service）' },
        { cmd: 'ps aux | grep nginx', description: '查看Nginx进程' },
        { cmd: 'netstat -tulpn | grep nginx', description: '查看Nginx监听的端口' },
        { cmd: 'curl -I http://localhost', description: '检查本地Nginx响应' },
        
        // 日志
        { cmd: 'tail -f /var/log/nginx/access.log', description: '实时查看访问日志' },
        { cmd: 'tail -f /var/log/nginx/error.log', description: '实时查看错误日志' },
        { cmd: 'grep [pattern] /var/log/nginx/access.log', description: '搜索访问日志' },
        { cmd: 'grep [pattern] /var/log/nginx/error.log', description: '搜索错误日志' },
        
        // 常用配置示例
        { cmd: 'server { listen 80; server_name example.com; root /var/www/html; }', description: '基本虚拟主机' },
        { cmd: 'location / { try_files $uri $uri/ /index.php?$args; }', description: 'WordPress伪静态' },
        { cmd: 'location / { try_files $uri $uri/ /index.html; }', description: 'SPA应用配置' },
        { cmd: 'location ~ \\.php$ { fastcgi_pass unix:/var/run/php/php7.4-fpm.sock; }', description: 'PHP-FPM配置' },
        { cmd: 'location /api/ { proxy_pass http://localhost:3000; }', description: '反向代理配置' },
        { cmd: 'ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;', description: 'SSL证书配置' },
        { cmd: 'ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;', description: 'SSL密钥配置' },
        { cmd: 'add_header Strict-Transport-Security "max-age=31536000" always;', description: 'HSTS配置' },
        
        // 性能优化
        { cmd: 'gzip on; gzip_types text/plain text/css application/javascript;', description: 'Gzip压缩' },
        { cmd: 'client_max_body_size 100M;', description: '上传文件大小限制' },
        { cmd: 'worker_processes auto;', description: '自动设置工作进程数' },
        { cmd: 'worker_connections 1024;', description: '每个工作进程的连接数' },
        { cmd: 'keepalive_timeout 65;', description: '保持连接超时' },
        { cmd: 'proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;', description: '代理缓存配置' },
        
        // 安全配置
        { cmd: 'location ~ /\\.ht { deny all; }', description: '禁止访问.htaccess文件' },
        { cmd: 'add_header X-Frame-Options "SAMEORIGIN" always;', description: '防止点击劫持' },
        { cmd: 'add_header X-Content-Type-Options "nosniff" always;', description: '防止MIME类型嗅探' },
        { cmd: 'add_header X-XSS-Protection "1; mode=block" always;', description: '启用XSS过滤' },
        { cmd: 'limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;', description: '请求速率限制' }
      ]
    }
  ],
  
  // 获取所有命令
  getAllCommands: function() {
    const allCommands = [];
    this.categories.forEach(category => {
      category.commands.forEach(command => {
        allCommands.push({
          ...command,
          category: category.name,
          categoryId: category.id
        });
      });
    });
    return allCommands;
  },
  
  // 获取指定分类的命令
  getCategoryCommands: function(categoryId) {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.commands : [];
  },
  
  // 搜索命令
  searchCommands: function(query) {
    if (!query) return this.getAllCommands();
    
    query = query.toLowerCase();
    return this.getAllCommands().filter(cmd => 
      cmd.cmd.toLowerCase().includes(query) || 
      cmd.description.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query)
    );
  }
};