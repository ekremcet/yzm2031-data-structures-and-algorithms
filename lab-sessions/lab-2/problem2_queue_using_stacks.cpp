#include <iostream>
#include <stack>

using namespace std;

class QueueUsingStacks {
private:
    stack<int> stack1;  // For enqueue operations
    stack<int> stack2;  // For dequeue operations

    // Helper function to transfer elements from stack1 to stack2
    void transfer() {
        // TODO: Transfer all elements from stack1 to stack2
        // This reverses the order, giving us FIFO behavior
    }

public:
    QueueUsingStacks() {
        // Constructor - stacks are automatically initialized
    }
    
    void enqueue(int value) {
        // TODO: Add element to queue
        // Hint: Which stack should you push to?
    }
    
    int dequeue() {
        // TODO: Remove and return front element
        // Hint: When should you call transfer()?
        return -1;
    }
    
    int front() {
        // TODO: Return front element without removing it
        return -1;
    }
    
    bool isEmpty() {
        // TODO: Check if queue is empty
        // Hint: Both stacks must be empty
        return true;
    }
};

int main() {
    cout << "=== Problem 2: Implement Queue using Two Stacks ===" << endl;
    
    QueueUsingStacks q;
    
    // Test 1: Basic enqueue and dequeue
    cout << "\nTest 1 - Basic operations:" << endl;
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);
    
    cout << "After enqueuing 10, 20, 30:" << endl;
    cout << "  Dequeue: " << q.dequeue() << endl;  // Expected: 10
    cout << "  Dequeue: " << q.dequeue() << endl;  // Expected: 20
    
    // Test 2: Mixed operations
    cout << "\nTest 2 - Mixed operations:" << endl;
    q.enqueue(40);
    q.enqueue(50);
    
    cout << "After enqueuing 40, 50:" << endl;
    cout << "  Front: " << q.front() << endl;      // Expected: 30
    cout << "  Dequeue: " << q.dequeue() << endl;  // Expected: 30
    cout << "  Dequeue: " << q.dequeue() << endl;  // Expected: 40
    cout << "  Dequeue: " << q.dequeue() << endl;  // Expected: 50
    
    cout << "  Is empty? " << (q.isEmpty() ? "Yes" : "No") << endl;  // Expected: Yes
    
    // Test 3: Enqueue after emptying
    cout << "\nTest 3 - Enqueue after emptying:" << endl;
    q.enqueue(100);
    q.enqueue(200);
    cout << "After enqueuing 100, 200:" << endl;
    cout << "  Front: " << q.front() << endl;       // Expected: 100
    cout << "  Dequeue: " << q.dequeue() << endl;   // Expected: 100
    cout << "  Front: " << q.front() << endl;       // Expected: 200
    
    return 0;
}
