module.exports = (PIXI) => {
  require("./modContainer.js")(PIXI)
  require("./modInteractionManager.js")(PIXI)
  return PIXI
}