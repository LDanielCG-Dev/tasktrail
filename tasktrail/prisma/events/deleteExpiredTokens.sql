-- The following command is temporary,
-- you'll have to set event_scheduler=ON
-- in your my.ini or my.cnf file
-- under the [mysqld] section

-- After that, you'll have to restart MariaDB/MySQL
-- You can view if it's enabled by using
-- SHOW VARIABLES LIKE 'event_scheduler';

SET GLOBAL event_scheduler = ON;

DROP EVENT IF EXISTS deleteExpiredTokens;

CREATE EVENT deleteExpiredTokens
ON SCHEDULE
EVERY 1 HOUR
STARTS DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00')
DO
    DELETE FROM tokens WHERE expiracy < DATE_SUB(NOW(), INTERVAL 2 HOUR);