function logStep(step, emoji = '⏳') {
    console.log(`[${new Date().toLocaleTimeString()}] [${emoji}] ${step}`);
  }
  
  function randomDelay(min, max) {
    return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
  }
  
  module.exports = { logStep, randomDelay };