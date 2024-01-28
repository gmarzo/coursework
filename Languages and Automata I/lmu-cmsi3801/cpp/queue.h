template <typename T> class Queue {

template <class T> class Node
{
    public:
        T data;
        class Node* next;
        Node(T data, Node *ptr = 0);
};

template <class T> class Queue
{
        /*Node<T> *head;
        Node<T> *tail;*/
    public:
        Node<T> *head;
        Node<T> *tail;  
        int nodeSize = 0;
        Queue();

        ~Queue();

        void enqueue(T data);

        int isEmpty();

        T dequeue();

        int get_size();

        friend stringstream& operator <<(stringstream &s, Queue<T> &q);
};



#endif