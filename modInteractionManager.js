// Allows listening for all of an interactionManager's events from a single emitter (a drastic form of event delegation)
// User must supply the emitter

module.exports = (PIXI) => {
  PIXI.interaction.InteractionManager.prototype.dispatchEvent = function (displayObject, eventString, eventData)
  {
    if(!eventData.stopped) {
      eventData.target = displayObject
      eventData.type = eventString

      displayObject.emit(eventString, eventData)
      // --- START CHANGE ---
      this.emitter && this.emitter.emit(eventString, eventData)
      // --- END CHANGE ---
      if (displayObject[eventString]) {
        displayObject[eventString](eventData)
      }
    }
  }
}