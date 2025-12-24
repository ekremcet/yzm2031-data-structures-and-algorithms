#include <iostream>
#include <algorithm>
#include <climits>

using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// ======================================================================================
// PROBLEM 3: AVL Verification
// ======================================================================================

/*
    isValidAVL(TreeNode* root)
*/

// Helper to get height of a node. Returns 0 for nullptr.
int getHeight(TreeNode* node) {
    // TODO: Implement this function
    return 0;
}

// Helper to check if it's a valid BST
bool isBSTHelper(TreeNode* node, long long minVal, long long maxVal) {
    // TODO: Implement this function
    return true;
}

// Helper to check if it's balanced and return height (or -1 if unbalanced)
int checkBalance(TreeNode* node) {
    // TODO: Implement this function
    return 0;
}

bool isValidAVL(TreeNode* root) {
    // TODO: Implement this function
    return false;
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
        Valid AVL:
              2
             / \
            1   3
    */
    TreeNode* root1 = new TreeNode(2);
    root1->left = new TreeNode(1);
    root1->right = new TreeNode(3);

    cout << "Tree 1 (AVL) - Is Valid? " << (isValidAVL(root1) ? "Yes" : "No") << " (Expected: Yes)" << endl;

    /*
        Not Balanced (Skewed):
            1
             \
              2
               \
                3
    */
    TreeNode* root2 = new TreeNode(1);
    root2->right = new TreeNode(2);
    root2->right->right = new TreeNode(3);

    cout << "Tree 2 (Skewed) - Is Valid? " << (isValidAVL(root2) ? "Yes" : "No") << " (Expected: No)" << endl;

    /*
        Balanced but not BST:
              2
             / \
            3   1
    */
    TreeNode* root3 = new TreeNode(2);
    root3->left = new TreeNode(3);
    root3->right = new TreeNode(1);

    cout << "Tree 3 (Not BST) - Is Valid? " << (isValidAVL(root3) ? "Yes" : "No") << " (Expected: No)" << endl;

    deleteTree(root1);
    deleteTree(root2);
    deleteTree(root3);

    return 0;
}

