module.exports = {
  apps: [
    {
      name: "tienda-frontend",
      script: "npm",
      args: "start",
      cwd: "/var/www/tienda-frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
    {
      name: "webhook-server",
      script: "scripts/webhook-server.js",
      cwd: "/var/www/tienda-frontend",
      env: {
        WEBHOOK_PORT: 3002,
        GITHUB_WEBHOOK_SECRET: "TU_SECRET_DE_GITHUB",
        DEPLOY_PATH: "/var/www/tienda-frontend",
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
    },
  ],
};
