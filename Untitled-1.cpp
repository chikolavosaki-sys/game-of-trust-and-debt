#include <iostream>
using namespace std;

struct node {
    int data;
    node* next;
    node(int x) : data(x), next(nullptr) {}
};

class linkedstack {
    node* head;
public:
    linkedstack() {
        head = nullptr;
    }
    bool isempty() {
        return head == nullptr;
    }
    void push(int x) {
        node* newnode = new node(x);
        newnode->next = head;
        head = newnode;
    }
    int pop() {
        if (isempty()) {
            cout << "stack underflow\n";
            return -1;
        }
        node* temp = head;
        int val = temp->data;
        head = head->next;
        delete temp;
        return val;
    }
    int peek() {
        if (isempty()) {
            cout << "stack is empty\n";
            return -1;
        }
        return head->data;
    }
    void insertatbeginning(int x) {
        push(x);
    }
    void insertsorted(int x) {
        node* newnode = new node(x);
        if (head == nullptr || head->data >= x) {
            newnode->next = head;
            head = newnode;
        } else {
            node* curr = head;
            while (curr->next != nullptr && curr->next->data < x) {
                curr = curr->next;
            }
            newnode->next = curr->next;
            curr->next = newnode;
        }
    }
    void deleteatposition(int pos) {
        if (pos <= 0) {
            cout << "invalid position\n";
            return;
        }
        if (head == nullptr) {
            cout << "list is empty\n";
            return;
        }
        if (pos == 1) {
            node* temp = head;
            head = head->next;
            delete temp;
            return;
        }
        node* curr = head;
        for (int i = 1; i < pos - 1 && curr->next != nullptr; i++) {
            curr = curr->next;
        }
        if (curr->next == nullptr) {
            cout << "position out of range\n";
            return;
        }
        node* todel = curr->next;
        curr->next = todel->next;
        delete todel;
    }
    void deletebyvalue(int x) {
        if (head == nullptr) return;
        if (head->data == x) {
            node* temp = head;
            head = head->next;
            delete temp;
            return;
        }
        node* curr = head;
        while (curr->next != nullptr && curr->next->data != x) {
            curr = curr->next;
        }
        if (curr->next == nullptr) {
            cout << "value not found\n";
            return;
        }
        node* todel = curr->next;
        curr->next = todel->next;
        delete todel;
    }
    void display() {
        node* curr = head;
        cout << "stack/list: ";
        while (curr != nullptr) {
            cout << curr->data;
            if (curr->next != nullptr) cout << " -> ";
            curr = curr->next;
        }
        cout << " -> NULL\n";
    }
};

int main() {
    linkedstack st;

    st.push(10);
    st.push(30);
    st.push(20);

    st.display();

    cout << "top: " << st.peek() << "\n";

    cout << "popped: " << st.pop() << "\n";

    st.display();

    st.insertsorted(25);
    st.insertsorted(5);
    st.insertsorted(35);

    cout << "after sorted inserts:\n";
    st.display();

    st.deleteatposition(2);
    cout << "after deleting pos 2:\n";
    st.display();

    st.deletebyvalue(30);
    cout << "after deleting value 30:\n";
    st.display();

    return 0;
}
