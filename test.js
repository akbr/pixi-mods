// Mock up some stuff so PIXI can exist in node
if (typeof window === "undefined") {
  global.navigator = {
    userAgent: ''
  }
    global.document = {
      createElement: function(s) {
        return {
          getContext: function(id){
            return {
              globalCompositeOperation: null,
                drawImage: function(){},
                  getImageData: function(){
                    return {data: [0, 0, 0]} 
                  },
              }
          },
      }
    }
  }
  global.window = global;
  global.Image = function(){};
}

let test = require("tape")
let PIXI = require("./pixi.min.js")
let patch = require("./index.js")

PIXI = patch(PIXI)

let sprite = obj => Object.assign(new PIXI.Sprite(), obj)

test("Container", (t) => {
  let container
  let children = [sprite({key: 1}), sprite({key: 2})]

  // addChild
  container = new PIXI.Container()
  container.addChild.apply(container, children)
  t.equals(container.children.length, 2)
  t.equals(Object.keys(container.childrenKeys).length, 2)

  // addChildAt
  container = new PIXI.Container()
  container.addChildAt(children[0], 0)
  t.equals(container.children.length, 1)
  t.equals(Object.keys(container.childrenKeys).length, 1)

  // removeChild
  container = new PIXI.Container()
  container.addChild.apply(container, children)
  container.removeChild.apply(container, children)
  t.equals(container.children.length, 0)
  t.equals(Object.keys(container.childrenKeys).length, 0)

  // removeChildAt
  container = new PIXI.Container()
  container.addChild.apply(container, children)
  container.removeChildAt(1)
  t.equals(container.children.length, 1)
  t.equals(Object.keys(container.childrenKeys).length, 1)

  // removeChildren
  container = new PIXI.Container()
  container.addChild.apply(container, children)
  container.removeChildren(0,2)
  t.equals(container.children.length, 0)
  t.equals(Object.keys(container.childrenKeys).length, 0)

  // replaceChildren
  container = new PIXI.Container()
  container.addChild.apply(container, children)
  container.replaceChildren.apply(container, [sprite({key: 4})])
  t.equals(container.children.length, 1)
  t.equals(Object.keys(container.childrenKeys).length, 1)

  // getChildByKey
  let deepContainer = new PIXI.Container()
  let mid = new PIXI.Container()
  let bottom = new PIXI.Container()
  bottom.addChild.apply(bottom, children)
  mid.addChild(bottom)
  deepContainer.addChild(mid)
  t.equals(deepContainer.getChildByKey(2).key, 2)
  t.equals(deepContainer.getChildByKey(3), undefined)

  t.end()
})