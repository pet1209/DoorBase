module.exports = {
  apps: [
    {
      name: "app-door",
      script: "door.js",
      watch: ["controllers", "routes", "models", "middlewares"], // List of directories to watch
      ignore_watch: [
        "node_modules",
        "logs",
        "models/projectdb.db",
        "models/projectdb.db-journal", // Ignore SQLite journal file
        "uploads", // Ignore uploads directory
        "uploads/*", // Ignore files directly in uploads directory
        "uploads/**/*", // Ignore all subdirectories and files in uploads directory
        "views",
      ],
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
    },
  ],
};
