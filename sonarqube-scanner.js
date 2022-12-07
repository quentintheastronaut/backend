const scanner = require('sonarqube-scanner');
scanner(
  {
    serverUrl: 'http://localhost:9000',
    login: 'admin',
    password: 'happymeal',
    options: {
      'sonar.sources': './src',
      'sonar.projectKey': 'happy-meal-backend',
      'sonar.login': 'sqp_0b384447ee5eae0c5c7ca93f399883c2bef713d6',
    },
  },
  () => process.exit(),
);
