module.exports = {
  apps: [
    {
      name: 'jobpay-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/jobpay-frontend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Logging
      log_file: '/var/log/jobpay-frontend/combined.log',
      out_file: '/var/log/jobpay-frontend/out.log',
      error_file: '/var/log/jobpay-frontend/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Process management
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,

      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],

      // Performance
      node_args: '--max-old-space-size=2048',

      // Health checks
      health_check_url: 'http://localhost:3000/api/health',
      health_check_grace_period: 3000,

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,

      // Environment-specific configurations
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001,
      },

      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        watch: true,
        watch_delay: 1000,
      },
    },
  ],
};
