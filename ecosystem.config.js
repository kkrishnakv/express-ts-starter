module.exports = {
  apps: [
    {
      name: "es-starter",
      script: "ejs-api.js",
      max_memory_restart: "300M",
      instances: "max",
      watch: false,
      out_file: "./ec2.log",
    },
  ],
};
