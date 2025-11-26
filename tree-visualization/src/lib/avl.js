class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.height = 1
    this.isNew = false
    this.isHighlighted = false
    this.isComparing = false
    this.isRotating = false
    this.isDeleting = false
    this.isSuccessor = false
  }

  clone() {
    const node = new TreeNode(this.value)
    node.height = this.height
    node.isNew = this.isNew
    node.isHighlighted = this.isHighlighted
    node.isComparing = this.isComparing
    node.isRotating = this.isRotating
    node.isDeleting = this.isDeleting
    node.isSuccessor = this.isSuccessor
    node.left = this.left ? this.left.clone() : null
    node.right = this.right ? this.right.clone() : null
    return node
  }
}

export class AVLTree {
  constructor() {
    this.root = null
    this.operations = []
  }

  clone() {
    const tree = new AVLTree()
    tree.root = this.root ? this.root.clone() : null
    return tree
  }

  getHeight(node) {
    return node ? node.height : 0
  }

  getTreeHeight() {
    return this.getHeight(this.root)
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0
  }

  updateHeight(node) {
    if (node) {
      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
    }
  }

  updateAllHeights(node) {
    if (!node) return
    this.updateAllHeights(node.left)
    this.updateAllHeights(node.right)
    this.updateHeight(node)
  }

  clearFlags(node) {
    if (!node) return
    node.isNew = false
    node.isHighlighted = false
    node.isComparing = false
    node.isRotating = false
    node.isDeleting = false
    node.isSuccessor = false
    this.clearFlags(node.left)
    this.clearFlags(node.right)
  }

  findMin(node) {
    while (node.left !== null) {
      node = node.left
    }
    return node
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

  markForDeletion(value) {
    this._markNode(this.root, value, 'isDeleting', true)
  }

  markAsSuccessor(value) {
    this._markNode(this.root, value, 'isSuccessor', true)
  }

  _markNode(node, value, flag, state) {
    if (!node) return
    if (node.value === value) {
      node[flag] = state
    }
    this._markNode(node.left, value, flag, state)
    this._markNode(node.right, value, flag, state)
  }

  // Delete animation steps
  getDeleteAnimationSteps(value) {
    const steps = []
    
    if (!this.root) {
      steps.push({
        type: 'message',
        message: `Tree is empty. Nothing to delete.`,
        logType: 'info'
      })
      return steps
    }

    const path = []
    let current = this.root
    let found = false
    
    steps.push({
      type: 'message',
      message: `Searching for ${value} to delete...`,
      logType: 'info'
    })

    while (current !== null) {
      path.push(current.value)
      
      steps.push({
        type: 'traverse',
        nodeValue: current.value,
        comparing: value,
        message: `Comparing ${value} with ${current.value}`,
        path: [...path]
      })

      if (value === current.value) {
        found = true
        steps.push({
          type: 'found',
          nodeValue: current.value,
          message: `Found ${value}! Determining deletion case...`,
          path: [...path]
        })
        
        if (!current.left && !current.right) {
          steps.push({
            type: 'case',
            caseType: 'leaf',
            message: `Case 1: Leaf node - Simply remove it`
          })
        } else if (!current.left || !current.right) {
          steps.push({
            type: 'case',
            caseType: 'oneChild',
            message: `Case 2: One child - Replace with child`
          })
        } else {
          steps.push({
            type: 'case',
            caseType: 'twoChildren',
            message: `Case 3: Two children - Find in-order successor`
          })
          
          let successor = current.right
          const successorPath = [current.value]
          while (successor.left !== null) {
            successorPath.push(successor.value)
            successor = successor.left
          }
          successorPath.push(successor.value)
          
          steps.push({
            type: 'successor',
            nodeValue: successor.value,
            message: `In-order successor is ${successor.value}`,
            path: successorPath
          })
          
          steps.push({
            type: 'replace',
            message: `Replace ${value} with ${successor.value}, then delete successor`
          })
        }
        break
      } else if (value < current.value) {
        steps.push({
          type: 'decision',
          message: `${value} < ${current.value}, go LEFT`,
          direction: 'left'
        })
        current = current.left
      } else {
        steps.push({
          type: 'decision',
          message: `${value} > ${current.value}, go RIGHT`,
          direction: 'right'
        })
        current = current.right
      }
    }

    if (!found) {
      steps.push({
        type: 'notFound',
        message: `${value} not found in tree!`,
        logType: 'info'
      })
    }

    return steps
  }

  // Delete WITHOUT rebalancing - for animation
  deleteWithoutBalance(value) {
    this.operations = []
    this.clearFlags(this.root)
    this.root = this._deleteWithoutBalance(this.root, value)
    this.updateAllHeights(this.root)
    return this.operations
  }

  _deleteWithoutBalance(node, value) {
    if (!node) {
      this.operations.push({ type: 'info', message: `${value} not found` })
      return null
    }

    if (value < node.value) {
      node.left = this._deleteWithoutBalance(node.left, value)
    } else if (value > node.value) {
      node.right = this._deleteWithoutBalance(node.right, value)
    } else {
      this.operations.push({ type: 'info', message: `Deleting ${value}` })
      
      if (!node.left && !node.right) {
        this.operations.push({ type: 'info', message: `Leaf node removed` })
        return null
      }
      
      if (!node.left) {
        this.operations.push({ type: 'info', message: `Replaced with right child` })
        return node.right
      }
      if (!node.right) {
        this.operations.push({ type: 'info', message: `Replaced with left child` })
        return node.left
      }
      
      const successor = this.findMin(node.right)
      this.operations.push({ type: 'info', message: `Replacing with successor ${successor.value}` })
      node.value = successor.value
      node.right = this._deleteWithoutBalance(node.right, successor.value)
    }

    return node
  }

  // Check for imbalance after deletion
  checkImbalance() {
    return this._findImbalance(this.root, null)
  }

  _findImbalance(node, parent) {
    if (!node) return null

    const balance = this.getBalance(node)
    
    if (Math.abs(balance) > 1) {
      let caseType = ''
      let rotationType = ''
      
      if (balance > 1) {
        const leftBalance = this.getBalance(node.left)
        if (leftBalance >= 0) {
          caseType = 'LL'
          rotationType = 'Right rotation needed'
        } else {
          caseType = 'LR'
          rotationType = 'Left-Right (double) rotation needed'
        }
      } else {
        const rightBalance = this.getBalance(node.right)
        if (rightBalance <= 0) {
          caseType = 'RR'
          rotationType = 'Left rotation needed'
        } else {
          caseType = 'RL'
          rotationType = 'Right-Left (double) rotation needed'
        }
      }

      return {
        node: node.value,
        balance,
        caseType,
        rotationType,
        parent: parent?.value
      }
    }

    const leftImbalance = this._findImbalance(node.left, node)
    if (leftImbalance) return leftImbalance
    
    return this._findImbalance(node.right, node)
  }

  // Rebalance the tree
  rebalance() {
    this.operations = []
    this.root = this._rebalance(this.root)
    return this.operations
  }

  _rebalance(node) {
    if (!node) return null

    node.left = this._rebalance(node.left)
    node.right = this._rebalance(node.right)

    this.updateHeight(node)
    const balance = this.getBalance(node)

    if (balance > 1 && this.getBalance(node.left) >= 0) {
      this.operations.push({ type: 'info', message: `LL Case at ${node.value}: Right rotation` })
      return this.rightRotate(node)
    }

    if (balance > 1 && this.getBalance(node.left) < 0) {
      this.operations.push({ type: 'info', message: `LR Case at ${node.value}: Double rotation` })
      node.left = this.leftRotate(node.left)
      return this.rightRotate(node)
    }

    if (balance < -1 && this.getBalance(node.right) <= 0) {
      this.operations.push({ type: 'info', message: `RR Case at ${node.value}: Left rotation` })
      return this.leftRotate(node)
    }

    if (balance < -1 && this.getBalance(node.right) > 0) {
      this.operations.push({ type: 'info', message: `RL Case at ${node.value}: Double rotation` })
      node.right = this.rightRotate(node.right)
      return this.leftRotate(node)
    }

    return node
  }

  rightRotate(y) {
    this.operations.push({ type: 'rotation', message: `⟳ Right rotation at node ${y.value}` })
    const x = y.left
    const T2 = x.right
    x.right = y
    y.left = T2
    this.updateHeight(y)
    this.updateHeight(x)
    return x
  }

  leftRotate(x) {
    this.operations.push({ type: 'rotation', message: `⟲ Left rotation at node ${x.value}` })
    const y = x.right
    const T2 = y.left
    y.left = x
    x.right = T2
    this.updateHeight(x)
    this.updateHeight(y)
    return y
  }

  // Standard delete with immediate rebalancing
  delete(value) {
    this.operations = []
    this.clearFlags(this.root)
    this.root = this._delete(this.root, value)
    return this.operations
  }

  _delete(node, value) {
    if (!node) {
      this.operations.push({ type: 'info', message: `${value} not found` })
      return null
    }

    if (value < node.value) {
      node.left = this._delete(node.left, value)
    } else if (value > node.value) {
      node.right = this._delete(node.right, value)
    } else {
      this.operations.push({ type: 'info', message: `Deleting ${value}` })
      
      if (!node.left && !node.right) {
        return null
      }
      if (!node.left) return node.right
      if (!node.right) return node.left
      
      const successor = this.findMin(node.right)
      this.operations.push({ type: 'info', message: `Successor: ${successor.value}` })
      node.value = successor.value
      node.right = this._delete(node.right, successor.value)
    }

    this.updateHeight(node)
    const balance = this.getBalance(node)

    if (Math.abs(balance) > 1) {
      this.operations.push({ type: 'info', message: `⚠️ Imbalance at ${node.value} (BF: ${balance > 0 ? '+' : ''}${balance})` })
    }

    if (balance > 1 && this.getBalance(node.left) >= 0) {
      this.operations.push({ type: 'info', message: `LL Case → Right rotation` })
      return this.rightRotate(node)
    }
    if (balance > 1 && this.getBalance(node.left) < 0) {
      this.operations.push({ type: 'info', message: `LR Case → Double rotation` })
      node.left = this.leftRotate(node.left)
      return this.rightRotate(node)
    }
    if (balance < -1 && this.getBalance(node.right) <= 0) {
      this.operations.push({ type: 'info', message: `RR Case → Left rotation` })
      return this.leftRotate(node)
    }
    if (balance < -1 && this.getBalance(node.right) > 0) {
      this.operations.push({ type: 'info', message: `RL Case → Double rotation` })
      node.right = this.rightRotate(node.right)
      return this.leftRotate(node)
    }

    return node
  }

  // Insert WITHOUT rebalancing - for animation
  insertWithoutBalance(value) {
    this.operations = []
    this.clearFlags(this.root)
    this.root = this._insertWithoutBalance(this.root, value)
    this.updateAllHeights(this.root)
    return this.operations
  }

  _insertWithoutBalance(node, value) {
    if (node === null) {
      const newNode = new TreeNode(value)
      newNode.isNew = true
      this.operations.push({ type: 'insert', message: `Inserted ${value}` })
      return newNode
    }

    if (value < node.value) {
      node.left = this._insertWithoutBalance(node.left, value)
    } else if (value > node.value) {
      node.right = this._insertWithoutBalance(node.right, value)
    } else {
      this.operations.push({ type: 'info', message: `Value ${value} already exists` })
    }

    return node
  }

  // Standard insert with immediate rebalancing
  insert(value) {
    this.operations = []
    this.clearFlags(this.root)
    this.root = this.insertNode(this.root, value)
    return this.operations
  }

  insertNode(node, value) {
    if (node === null) {
      const newNode = new TreeNode(value)
      newNode.isNew = true
      this.operations.push({ type: 'insert', message: `Inserted ${value}` })
      return newNode
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value)
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value)
    } else {
      this.operations.push({ type: 'info', message: `Value ${value} already exists` })
      return node
    }

    this.updateHeight(node)
    const balance = this.getBalance(node)

    if (Math.abs(balance) > 1) {
      this.operations.push({ type: 'info', message: `⚠️ Imbalance at ${node.value} (BF: ${balance > 0 ? '+' : ''}${balance})` })
    }

    if (balance > 1 && value < node.left.value) {
      this.operations.push({ type: 'info', message: `LL Case → Right rotation` })
      return this.rightRotate(node)
    }
    if (balance < -1 && value > node.right.value) {
      this.operations.push({ type: 'info', message: `RR Case → Left rotation` })
      return this.leftRotate(node)
    }
    if (balance > 1 && value > node.left.value) {
      this.operations.push({ type: 'info', message: `LR Case → Double rotation` })
      node.left = this.leftRotate(node.left)
      return this.rightRotate(node)
    }
    if (balance < -1 && value < node.right.value) {
      this.operations.push({ type: 'info', message: `RL Case → Double rotation` })
      node.right = this.rightRotate(node.right)
      return this.leftRotate(node)
    }

    return node
  }

  getInsertAnimationSteps(value) {
    const steps = []
    
    if (this.root === null) {
      steps.push({
        type: 'message',
        message: `Tree is empty. Inserting ${value} as root.`,
        logType: 'insert'
      })
      return steps
    }

    const path = []
    let current = this.root
    
    steps.push({
      type: 'message',
      message: `Starting AVL insertion of ${value}`,
      logType: 'info'
    })

    while (current !== null) {
      path.push(current.value)
      
      steps.push({
        type: 'traverse',
        nodeValue: current.value,
        comparing: value,
        message: `Comparing ${value} with ${current.value}`,
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
            message: `Insert ${value} as left child of ${current.value}`
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
            message: `Insert ${value} as right child of ${current.value}`
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

  getNodeCount(node = this.root) {
    if (node === null) return 0
    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right)
  }

  clear() {
    this.root = null
    this.operations = [{ type: 'info', message: 'Tree cleared' }]
    return this.operations
  }
}
