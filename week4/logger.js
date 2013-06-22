var log4js = require('log4js');
log4js.configure("logger.json");
//log4js.configure("logger.json", {cwd: "外部設定檔目錄"});



var logger = log4js.getLogger("absolute-logger" );

logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');