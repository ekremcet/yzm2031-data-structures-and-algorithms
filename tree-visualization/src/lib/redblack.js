const RED = 'red'
const BLACK = 'black'

class RBNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.parent = null
    this.color = RED
    this.isNew = false
    this.isHighlighted = false
    this.isComparing = false
    this.isRotating = false
  }

  clone(parent = null) {
    const node = new RBNode(this.value)
    node.color = this.color
    node.isNew = this.isNew
    node.isHighlighted = this.isHighlighted
    node.isComparing = this.isComparing
    node.isRotating = this.isRotating
    node.parent = parent
    node.left = this.left ? this.left.clone(node) : null
    node.right = this.right ? this.right.clone(node) : null
    return node
  }

  get isRed() {
    return this.color === RED
  }

  get isBlack() {
    return this.color === BLACK
  }
}

export class RedBlackTree {
  constructor() {
    this.root = null
    this.operations = []
  }

  clone() {
    const tree = new RedBlackTree()
    tree.root = this.root ? this.root.clone() : null
    return tree
  }

  clearFlags(node) {
    if (!node) return
    node.isNew = false
    node.isHighlighted = false
    node.isComparing = false
    node.isRotating = false
    this.clearFlags(node.left)
    this.clearFlags(node.right)
  }

  contains(value) {
    return this._contains(this.root, value)
  }

  _contains(node, value) {
    if (!node) return false
    if (value === node.value) return true
    if (value < node.value) return this._contains(node.left, value)
    return this._contains(node.right, value)
  }

  getDeleteAnimationSteps(value) {
    // Simplified for now - just return basic steps
    const steps = []
    if (!this.root) {
      steps.push({ type: 'message', message: 'Tree is empty', logType: 'info' })
      return steps
    }
    steps.push({ type: 'message', message: `Searching for ${value}...`, logType: 'info' })
    return steps
  }

  setHighlight(nodeValue, highlighted = true) {
    this._setHighlightRecursive(this.root, nodeValue, highlighted)
  }

  _setHighlightRecursive(node, nodeValue, highlighted) {
    if (!node) return
    if (node.value === nodeValue) {
      node.isHighlighted = highlighted
      node.isComparing = highlighted
    }
    this._setHighlightRecursive(node.left, nodeValue, highlighted)
    this._setHighlightRecursive(node.right, nodeValue, highlighted)
  }

  leftRotate(x) {
    this.operations.push({
      type: 'rotation',
      message: `⟲ Left rotation at node ${x.value}`
    })

    const y = x.right
    x.right = y.left

    if (y.left !== null) {
      y.left.parent = x
    }

    y.parent = x.parent

    if (x.parent === null) {
      this.root = y
    } else if (x === x.parent.left) {
      x.parent.left = y
    } else {
      x.parent.right = y
    }

    y.left = x
    x.parent = y
  }

  rightRotate(y) {
    this.operations.push({
      type: 'rotation',
      message: `⟳ Right rotation at node ${y.value}`
    })

    const x = y.left
    y.left = x.right

    if (x.right !== null) {
      x.right.parent = y
    }

    x.parent = y.parent

    if (y.parent === null) {
      this.root = x
    } else if (y === y.parent.right) {
      y.parent.right = x
    } else {
      y.parent.left = x
    }

    x.right = y
    y.parent = x
  }

  getInsertAnimationSteps(value) {
    const steps = []
    
    if (this.root === null) {
      steps.push({
        type: 'message',
        message: `Tree is empty. Inserting ${value} as BLACK root.`,
        logType: 'insert'
      })
      steps.push({
        type: 'insert',
        value,
        path: [],
        message: `Inserted ${value} as root (colored BLACK)`
      })
      return steps
    }

    const path = []
    let current = this.root
    
    steps.push({
      type: 'message',
      message: `Starting Red-Black insertion of ${value} (new nodes are RED)`,
      logType: 'info'
    })

    while (current !== null) {
      path.push(current.value)
      
      steps.push({
        type: 'traverse',
        nodeValue: current.value,
        comparing: value,
        message: `Comparing ${value} with ${current.value} (${current.color})`,
        path: [...path]
      })

      if (value < current.value) {
        steps.push({
          type: 'decision',
          message: `${value} < ${current.value}, go LEFT`,
          direction: 'left'
        })
        if (current.left === null) {
          steps.push({
            type: 'insert',
            value,
            parent: current.value,
            direction: 'left',
            path: [...path],
            message: `Insert ${value} as RED left child of ${current.value}`
          })
          break
        }
        current = current.left
      } else if (value > current.value) {
        steps.push({
          type: 'decision',
          message: `${value} > ${current.value}, go RIGHT`,
          direction: 'right'
        })
        if (current.right === null) {
          steps.push({
            type: 'insert',
            value,
            parent: current.value,
            direction: 'right',
            path: [...path],
            message: `Insert ${value} as RED right child of ${current.value}`
          })
          break
        }
        current = current.right
      } else {
        steps.push({
          type: 'duplicate',
          message: `${value} already exists!`,
          logType: 'info'
        })
        return steps
      }
    }

    steps.push({
      type: 'message',
      message: `Now checking Red-Black properties...`,
      logType: 'info'
    })

    return steps
  }

  insert(value) {
    this.operations = []
    this.clearFlags(this.root)

    const newNode = new RBNode(value)
    newNode.isNew = true

    let parent = null
    let current = this.root

    while (current !== null) {
      parent = current
      if (value < current.value) {
        current = current.left
      } else if (value > current.value) {
        current = current.right
      } else {
        this.operations.push({ type: 'info', message: `Value ${value} already exists` })
        return this.operations
      }
    }

    newNode.parent = parent

    if (parent === null) {
      this.root = newNode
      this.operations.push({ type: 'insert', message: `Inserted ${value} as root` })
    } else if (value < parent.value) {
      parent.left = newNode
      this.operations.push({ type: 'insert', message: `Inserted ${value} as left child of ${parent.value}` })
    } else {
      parent.right = newNode
      this.operations.push({ type: 'insert', message: `Inserted ${value} as right child of ${parent.value}` })
    }

    this.insertFixup(newNode)

    return this.operations
  }

  insertFixup(z) {
    while (z.parent !== null && z.parent.isRed) {
      if (z.parent === z.parent.parent?.left) {
        const uncle = z.parent.parent?.right

        if (uncle !== null && uncle.isRed) {
          this.operations.push({
            type: 'info',
            message: `🔴 Case 1: Uncle ${uncle.value} is RED → Recolor parent, uncle, grandparent`
          })
          z.parent.color = BLACK
          uncle.color = BLACK
          z.parent.parent.color = RED
          this.operations.push({
            type: 'info',
            message: `Recolored: ${z.parent.value}→BLACK, ${uncle.value}→BLACK, ${z.parent.parent.value}→RED`
          })
          z = z.parent.parent
        } else {
          if (z === z.parent.right) {
            this.operations.push({
              type: 'info',
              message: `🔴 Case 2: Uncle is BLACK, ${z.value} is right child → Left rotate parent`
            })
            z = z.parent
            this.leftRotate(z)
          }
          this.operations.push({
            type: 'info',
            message: `🔴 Case 3: Uncle is BLACK, ${z.value} is left child → Recolor & right rotate`
          })
          z.parent.color = BLACK
          z.parent.parent.color = RED
          this.rightRotate(z.parent.parent)
        }
      } else {
        const uncle = z.parent.parent?.left

        if (uncle !== null && uncle.isRed) {
          this.operations.push({
            type: 'info',
            message: `🔴 Case 1: Uncle ${uncle.value} is RED → Recolor parent, uncle, grandparent`
          })
          z.parent.color = BLACK
          uncle.color = BLACK
          z.parent.parent.color = RED
          this.operations.push({
            type: 'info',
            message: `Recolored: ${z.parent.value}→BLACK, ${uncle.value}→BLACK, ${z.parent.parent.value}→RED`
          })
          z = z.parent.parent
        } else {
          if (z === z.parent.left) {
            this.operations.push({
              type: 'info',
              message: `🔴 Case 2: Uncle is BLACK, ${z.value} is left child → Right rotate parent`
            })
            z = z.parent
            this.rightRotate(z)
          }
          this.operations.push({
            type: 'info',
            message: `🔴 Case 3: Uncle is BLACK, ${z.value} is right child → Recolor & left rotate`
          })
          z.parent.color = BLACK
          z.parent.parent.color = RED
          this.leftRotate(z.parent.parent)
        }
      }
    }

    if (this.root.color === RED) {
      this.operations.push({
        type: 'info',
        message: `Root must be BLACK → Recoloring root`
      })
      this.root.color = BLACK
    }
  }

  getHeight(node) {
    if (node === null) return 0
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
  }

  getTreeHeight() {
    return this.getHeight(this.root)
  }

  getNodeCount(node = this.root) {
    if (node === null) return 0
    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right)
  }

  getBalance(node) {
    if (!node) return 0
    return this.getHeight(node.left) - this.getHeight(node.right)
  }

  clear() {
    this.root = null
    this.operations = [{ type: 'info', message: 'Tree cleared' }]
    return this.operations
  }
}
