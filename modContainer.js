// Seamlessly improves PIXI.Container
// Mods all add* and remove* methods support a key-based lookup for children that specify a "key" property.
// New method, getChildByKey, quickly searches container and its children for a child matching that key.
// Also adds convenience method replaceChildren.

module.exports = (PIXI) => {
  let {addChild, addChildAt, removeChild, removeChildAt, removeChildren} = PIXI.Container.prototype

  Object.assign(PIXI.Container.prototype, {
    recordChild: function (child) {
      if (child.key) {
        this.childrenKeys = this.childrenKeys || {}
        if (this.childrenKeys[child.key]) {
          throw new Error("Duplicate key " + child.key + " on this Container.")
        }
        this.childrenKeys[child.key] = child
      }
    },

    unrecordChild: function (child) {
      if (this.childrenKeys && child.key) {
        delete this.childrenKeys[child.key]
      }
    },

    addChild: function (...args) {
      let result
      [...args].forEach(child => {
        this.recordChild(child)
        result = addChild.call(this, child)
      })
      return result
    },

    addChildAt: function (child, index) {
      this.recordChild(child)
      return addChildAt.call(this, child, index)
    },

    removeChild: function (...args) {
      let result
      [...args].forEach(child => {
        this.unrecordChild(child)
        result = removeChild.call(this, child)
      })
      return result
    },

    removeChildAt: function (index) {
      let child = removeChildAt.call(this, index)
      if (child) {
        this.unrecordChild(child)
      }
      return child
    },

    removeChildren: function (beginIndex, endIndex) {
      let childArray = removeChildren.call(this, beginIndex, endIndex)
      childArray.forEach(child => this.unrecordChild(child))
      return childArray
    },

    // new methods
    replaceChildren: function (...args) {
      this.removeChild.apply(this, this.children)
      this.addChild.apply(this, [].concat(...args))
    },

    getChildByKey: function (key) {
      return recurseSearch(this, key)
    }
  })

  function recurseSearch ({children, childrenKeys}, key) {
    let result
    if (childrenKeys && childrenKeys[key]) {
      result = childrenKeys[key]
    } else {
      for (let i in children) {
        result = recurseSearch(children[i], key)
        if (result) break
      }
    }
    return result
  }

  return PIXI
}