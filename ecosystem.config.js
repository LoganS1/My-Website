module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'logansinclair.me',
      script    : 'app.js',
      instances : '2',
      exec_mode : 'cluster'
    }
  ]
};
