module.exports = {
  extends: 'airbnb-base',
  env: {
    mocha: true,
  },
  rules:{
    'no-param-reassign': ["error", { "props": false }]
  }
};
