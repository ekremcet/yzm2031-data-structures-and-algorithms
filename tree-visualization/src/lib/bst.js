class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.height = 1
    this.isNew = false
    this.isHighlighted = false
    this.isComparing = false
    this.isDeleting = false
    this.isSuccessor = false
  }

  clone(parent = null) {
    const node = new TreeNode(this.value)
    node.height = this.height
    node.isNew = this.isNew
    node.isHighlighted = this.isHighlighted
    node.isComparing = this.isComparing
    node.isDeleting = this.isDeleting
    node.isSuccessor = this.isSuccessor
    node.left = this.left ? this.left.clone(node) : null
    node.right = this.right ? this.right.clone(node) : null
    return node
  }
}

export class BST {
  constructor() {
    this.root = null
    this.operations = []
  }

  clone() {
    const tree = new BST()
    tree.root = this.root ? this.root.clone() : null
    return tree
  }

  clearFlags(node) {
    if (!node) return
    node.isNew = false
    node.isHighlighted = false
    node.isComparing = false
    node.isDeleting = false
    node.isSuccessor = false
    this.clearFlags(node.left)
    this.clearFlags(node.right)
  }

  // Find minimum node in a subtree
  findMin(node) {
    while (node.left !== null) {
      node = node.left
    }
    return node
  }

  // Check if value exists
  contains(value) {
    return this._contains(this.root, value)
  }

  _contains(node, value) {
    if (!node) return false
    if (value === node.value) return true
    if (value < node.value) return this._contains(node.left, value)
    return this._contains(node.right, value)
  }

  // Get animation steps for deletion
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

    // Find the node
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
        
        // Determine case
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
          
          // Find successor
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
            message: `In-order successor is ${successor.value} (smallest in right subtree)`,
            path: successorPath
          })
          
          steps.push({
            type: 'replace',
            message: `Replace ${value} with successor ${successor.value}, then delete successor`
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

  // Mark a node for deletion visualization
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

  // Delete a node
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
      // Found the node to delete
      this.operations.push({ type: 'info', message: `Deleting ${value}` })
      
      // Case 1: Leaf node
      if (!node.left && !node.right) {
        this.operations.push({ type: 'info', message: `Leaf node removed` })
        return null
      }
      
      // Case 2: One child
      if (!node.left) {
        this.operations.push({ type: 'info', message: `Replaced with right child` })
        return node.right
      }
      if (!node.right) {
        this.operations.push({ type: 'info', message: `Replaced with left child` })
        return node.left
      }
      
      // Case 3: Two children
      const successor = this.findMin(node.right)
      this.operations.push({ type: 'info', message: `Successor: ${successor.value}` })
      node.value = successor.value
      node.right = this._delete(node.right, successor.value)
    }

    return node
  }

  // Insert methods (existing)
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
      message: `Starting search for position to insert ${value}`,
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
            message: `Found empty spot! Insert ${value} as left child of ${current.value}`
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
            message: `Found empty spot! Insert ${value} as right child of ${current.value}`
          })
          break
        }
        current = current.right
      } else {
        steps.push({
          type: 'duplicate',
          message: `${value} already exists in the tree!`,
          logType: 'info'
        })
        break
      }
    }

    return steps
  }

  insert(value) {
    this.clearFlags(this.root)
    const newNode = new TreeNode(value)
    newNode.isNew = true
    
    if (this.root === null) {
      this.root = newNode
      return [{ type: 'insert', message: `Inserted ${value} as root` }]
    }
    
    return this.insertNode(this.root, newNode)
  }

  insertNode(node, newNode) {
    const ops = []
    
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode
        ops.push({ type: 'insert', message: `Inserted ${newNode.value} as left child of ${node.value}` })
      } else {
        ops.push(...this.insertNode(node.left, newNode))
      }
    } else if (newNode.value > node.value) {
      if (node.right === null) {
        node.right = newNode
        ops.push({ type: 'insert', message: `Inserted ${newNode.value} as right child of ${node.value}` })
      } else {
        ops.push(...this.insertNode(node.right, newNode))
      }
    } else {
      ops.push({ type: 'info', message: `Value ${newNode.value} already exists` })
    }
    
    return ops
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
    return [{ type: 'info', message: 'Tree cleared' }]
  }
}
