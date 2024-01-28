#include <iostream>
#include <string>
#include <vector>
#include <sstream>
using namespace std;

template <class T> class Node
{
    public:
        T data;
        class Node* next;
    
        Node(T data, Node *ptr = 0)
        {
            this->data = data;
            next = ptr;
        }

        //Copy contructor
        Node(const Node& other): data(other.data), next(new Node<T>(*other.next)){

        }
        
        //Move constructor
        Node(Node&& other): data(other.data), next(other.next){
            other.next = nullptr;
        }
        
        ~Node(){
            delete next;
        }
        
        //copy assignment operator
        Node& operator=(const Node& other){
            if (&other == this) return *this;
            delete next;
            data = other.data;
            next = other.next ? new Node<T>(*other.next):nullptr;
            return *this;
        }
        
        //move assignment operator
        Node& operator = (Node&& other) {
            if(&other == this) return *this;
            delete next;
            data = other.data;
            next = other.next;
            other.next = nullptr;
            return *this;
        }
        
};

template <class T> class Queue
{
        Node<T> *head;
        Node<T> *tail;
    public:
        int nodeSize = 0;
        Queue()
        {
            head = tail = 0;
        }

        ~Queue()
        {
            if (head)
            {
                delete head;
            }
        }

        void enqueue(T data)
        {
            Node<T>* temp = new Node<T>(data);
            if(tail == 0)
            {
                head = tail = temp;
            }
            else
            {
                tail->next = temp;
                tail = temp;
            }
            nodeSize++;
        }

        int isEmpty()
        {
            return head == 0;
        }

        T dequeue()
        {
            if(isEmpty())
            {
                throw underflow_error("The queue is empty and cannot dequeue\n");
            }
            Node<T>* temp;
            T frontData = head->data;

            temp = head;
            head = temp->next;

            delete temp;
            nodeSize--;
            return frontData;
        }

        int get_size()
        {
            return nodeSize;
        }

        friend stringstream& operator <<(stringstream &s, Queue<T> &q){
            s << "[";
            Node<T>* tmp = q.head;
            while(tmp)
            {
                if(tmp->next == 0)
                {
                    s << tmp->data;
                }
                else
                {
                    s << tmp->data;
                    s << ',';
                }
                tmp = tmp->next;
            }
            s << "]";
            return s;
        }
};

