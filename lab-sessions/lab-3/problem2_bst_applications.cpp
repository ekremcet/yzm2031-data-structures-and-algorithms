#include <iostream>
#include <vector>

using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// ======================================================================================
// PROBLEM 2: BST Applications
// ======================================================================================

/*
    1. kthSmallest(TreeNode* root, int k)
    Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed)
    of all the values of the nodes in the tree.
*/
int kthSmallest(TreeNode* root, int k) {
    // TODO: Implement this function
    return -1;
}

/*
    2. LCA(TreeNode* root, TreeNode* p, TreeNode* q)
    Find the Lowest Common Ancestor (LCA) of two given nodes in the BST.
*/
TreeNode* LCA(TreeNode* root, TreeNode* p, TreeNode* q) {
    // TODO: Implement this function
    return nullptr;
}

/*
    3. rangeSum(TreeNode* root, int L, int R)
    Return the sum of values of all nodes with a value in the inclusive range [L, R].
*/
int rangeSum(TreeNode* root, int L, int R) {
    // TODO: Implement this function
    return 0;
}

/*
    4. invertTree(TreeNode* root)
    Invert a binary tree. Given the root of a binary tree, invert the tree, and return its root.
*/
TreeNode* invertTree(TreeNode* root) {
    // TODO: Implement this function
    return nullptr;
}

// Helper to delete tree
void deleteTree(TreeNode* root) {
    if (!root) return;
    deleteTree(root->left);
    deleteTree(root->right);
    delete root;
}

int main() {
    /*
        BST:
              5
             / \
            3   7
           / \   \
          2   4   8
    */
    TreeNode* root = new TreeNode(5);
    root->left = new TreeNode(3);
    root->right = new TreeNode(7);
    root->left->left = new TreeNode(2);
    root->left->right = new TreeNode(4);
    root->right->right = new TreeNode(8);

    TreeNode* p = root->left; // 3
    TreeNode* q = root->left->right; // 4
    
    // Test 1: K-th Smallest
    cout << "3rd Smallest: " << kthSmallest(root, 3) << " (Expected: 4)" << endl;
    
    // Test 2: LCA
    TreeNode* lca = LCA(root, p, q);
    cout << "LCA of 3 and 4: " << (lca ? lca->val : -1) << " (Expected: 3)" << endl;
    
    // Test 3: LCA across root
    lca = LCA(root, root->left->left, root->right->right); // 2 and 8
    cout << "LCA of 2 and 8: " << (lca ? lca->val : -1) << " (Expected: 5)" << endl;

    // Test 4: Range Sum [3, 7] -> 3+4+5+7 = 19
    cout << "Range Sum [3, 7]: " << rangeSum(root, 3, 7) << " (Expected: 19)" << endl;

    // Test 5: Invert Tree
    root = invertTree(root);
    cout << "After Invert, Root Left: " << (root->left ? root->left->val : -1) << " (Expected: 7)" << endl;
    cout << "After Invert, Root Right: " << (root->right ? root->right->val : -1) << " (Expected: 3)" << endl;

    deleteTree(root);
    return 0;
}

